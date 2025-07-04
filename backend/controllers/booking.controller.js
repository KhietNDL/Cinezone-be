const Booking = require('../models/booking.model');
const { create } = require('../models/orderProduct.model');
const ScoreHistory = require("../models/scorehistory.model");
const User = require("../models/user.model");

const getBookingById = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingsByMemberId = async (req, res) => {
  const { memberId } = req.params;
  try {
    const bookings = await Booking.getBookingsByMemberId(memberId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const success = await Booking.createBooking(req.body);
    if (!success) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const success = await Booking.updateBooking(bookingId, req.body);
    if (!success) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const success = await Booking.deleteBooking(bookingId);
    if (!success) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 0, sortBy = 'CreatedAt', sortOrder = 'desc' } = req.query;
    const result = await Booking.getAllBookings({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestBookingByMemberId = async (req, res) => {
  const { memberId } = req.params;
  try {
    const booking = await Booking.getLatestBookingByMemberId(memberId);
    if (!booking) return res.status(404).json({ error: 'No bookings found for this member' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const holdBooking = async (req, res) => {
  try {
    //const userId = req.user.userId; // Lấy từ middleware xác thực
    const { userId, showtimeId, seatIds, promotionTitle } = req.body;
    const CreatedBy = req.user ? req.user.id : null; // Assuming user ID is available in req.user
    const result = await Booking.holdBooking({ userId, showtimeId, seatIds, promotionTitle, CreatedBy });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.confirmBooking(bookingId);

    // Lấy thông tin booking vừa xác nhận
    const booking = await Booking.getBookingById(bookingId);
    if (booking) {
      const ScoreValue = Math.floor((booking.TotalAmount || 0) / 10000);
      if (ScoreValue > 0) {
        // Ghi nhận lịch sử điểm
        await ScoreHistory.createScoreHistory({
          MemberId: booking.MemberId,
          RelatedBookingId: bookingId,
          ScoreValue: +ScoreValue,
          ChangeType: '1',
          ChangeDate: new Date(),
          CreatedBy: booking.MemberId
        });
        // Cộng điểm vào user
        const user = await User.findById(booking.MemberId);
        if (user) {
          const newScoreBalance = (user.ScoreBalance || 0) + ScoreValue;
          await User.updateScoreBalance(booking.MemberId, newScoreBalance);
        }
      }
    }

    res.json({ message: 'Booking confirmed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const checkinBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await Booking.checkinBooking(bookingId);
    if (result.success) {
      return res.status(200).json({ message: result.message });
    }
    return res.status(400).json({ error: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const detail = await Booking.getBookingDetail(bookingId);
    if (!detail) return res.status(404).json({ error: "Booking not found" });
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const result = await Booking.cancelBooking(bookingId);
    if (result) {
      res.status(200).json({ message: "Booking cancelled successfully" });
    } else {
      res.status(400).json({ message: "Cancel booking failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findBookingsByUserInfo = async (req, res) => {
  try {
    const { email, cccd, phone } = req.query;
    const bookings = await Booking.findBookingsByUserInfo({ email, cccd, phone });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingsByMemberId,
  createBooking,
  updateBooking,
  deleteBooking,
  getLatestBookingByMemberId,
  holdBooking,
  confirmBooking,
  checkinBooking,
  getBookingDetail,
  cancelBooking,
  findBookingsByUserInfo,
};
