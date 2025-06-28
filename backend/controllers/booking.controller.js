const Booking = require('../models/booking.model');

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
    const bookingId = await Booking.createBooking(req.body);
    res.status(201).json({ bookingId });
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
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
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
    const { userId, showtimeId, seatIds, productIds, promotionTitle } = req.body;
    const result = await Booking.holdBooking({ userId, showtimeId, seatIds, productIds, promotionTitle });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.confirmBooking(bookingId);
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
  cancelBooking
};
