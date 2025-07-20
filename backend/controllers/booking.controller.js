const Booking = require('../models/booking.model');
const { create } = require('../models/orderProduct.model');
const ScoreHistory = require("../models/scorehistory.model");
const User = require("../models/user.model");
const Seat = require("../models/seat.moddel.js");

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
  // Lấy các tham số phân trang và sort từ query string
  const { page = 1, limit = 10, sortBy = "CreatedAt", sortOrder = "desc" } = req.query;
  try {
    const bookings = await Booking.getBookingsByMemberId(memberId, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder
    });
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
    const { userId, showtimeId, seatIds, productIds, promotionCode, PointsToUse } = req.body;
    // Kiểm tra chỉ được dùng 1 trong 2: điểm hoặc promotion
    if (promotionCode && PointsToUse) {
      return res.status(400).json({ error: 'Chỉ được dùng 1 trong 2: điểm hoặc promotion!' });
    }
    // Lấy user và quyền lợi membership
    const user = await User.getMembershipInfo(userId);
    let membershipDiscount = 0;
    if (!PointsToUse && user && user.DiscountTicket !== undefined && user.DiscountTicket !== null) {
      membershipDiscount = Number(user.DiscountTicket);
    }
    // Lấy thông tin loại ghế từ seatIds
    const seatTypeToPoint = { normal: 90, vip: 150, Couple: 250, Normal: 90, VIP: 150, Couple: 250 };
    const seatTypes = [];
    for (const seatId of seatIds) {
      const seat = await Seat.getSeatById(seatId);
      if (!seat || !seatTypeToPoint[seat.Type]) {
        return res.status(400).json({ error: 'Chỉ cho phép đổi điểm cho các loại ghế: normal, vip, double!' });
      }
      seatTypes.push(seat.Type);
    }
    let pointsUsed = 0;
    let newScoreBalance = null;
    let discount = 0;
    // Nếu dùng điểm
    if (PointsToUse) {
      const totalRequiredPoints = seatTypes.reduce((sum, type) => sum + seatTypeToPoint[type], 0);
      if (PointsToUse != totalRequiredPoints) {
        return res.status(400).json({ error: 'Số điểm phải đúng bằng tổng số điểm quy định cho từng loại ghế!' });
      }
      if (!user || user.ScoreBalance < PointsToUse) {
        return res.status(400).json({ error: 'Không đủ điểm để sử dụng!' });
      }
      discount = PointsToUse * 1000;
      pointsUsed = PointsToUse;
      newScoreBalance = user.ScoreBalance - PointsToUse;
    }
    // Gọi holdBooking ở model, truyền thêm discount và membershipDiscount
    const result = await Booking.holdBooking({
      userId,
      showtimeId,
      seatIds,
      productIds,
      promotionCode,
      discount, // discount từ điểm nếu có
      membershipDiscount, // phần trăm giảm giá membership nếu không dùng điểm
      CreatedBy: userId
    });
    // Nếu dùng điểm, trừ điểm và ghi lịch sử
    if (pointsUsed > 0) {
      await User.updateScoreBalance(userId, newScoreBalance);
      await ScoreHistory.createScoreHistory({
        MemberId: userId,
        RelatedBookingId: result.bookingId,
        ScoreValue: -pointsUsed,
        ChangeType: '2',
        ChangeDate: new Date(),
        CreatedBy: userId
      });
    }
    res.json({
      ...result,
      pointsUsed,
      newScoreBalance: newScoreBalance !== null ? newScoreBalance : user.ScoreBalance,
      discount
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.confirmBooking(bookingId);
    // Lấy thông tin booking chi tiết (bao gồm danh sách ghế và giá gốc)
    const booking = await Booking.getBookingDetail(bookingId);
    console.log('[DEBUG] Booking info:', booking);

    if (booking) {
      // Lấy danh sách ghế và giá gốc từng ghế
      const seatPrices = booking.seatPrices || {}; // { seatNumber: price }
      // Tính tổng tiền gốc
      const originalAmount = Object.values(seatPrices).reduce((sum, price) => sum + Number(price), 0);
      console.log('[DEBUG] originalAmount:', originalAmount);

      // Lấy quyền lợi membership (PointMultiplier)
      const userInfo = await User.getMembershipInfo(booking.MemberId);
      console.log('[DEBUG] User membership info:', userInfo);
      const pointMultiplier = userInfo && userInfo.PointMultiplier ? Number(userInfo.PointMultiplier) : 1;

      // Tính điểm dựa trên tổng tiền gốc
      const basePoint = Math.floor((originalAmount || 0) / 10000);
      const earnedPoint = Math.floor(basePoint * pointMultiplier);
      console.log('[DEBUG] basePoint:', basePoint, 'pointMultiplier:', pointMultiplier, 'earnedPoint:', earnedPoint);

      if (earnedPoint > 0) {
        // Ghi nhận lịch sử điểm
        await ScoreHistory.createScoreHistory({
          MemberId: booking.MemberId,
          RelatedBookingId: bookingId,
          ScoreValue: +earnedPoint,
          ChangeType: '1',
          ChangeDate: new Date(),
          CreatedBy: booking.MemberId
        });
        // Cộng điểm vào user (cả ScoreBalance và TotalAccumulatedPoints)
        await User.updateScoreAndAccumulated(booking.MemberId, earnedPoint);
        console.log('[DEBUG] Updated user score with earnedPoint:', earnedPoint);
        // Tự động nâng hạng nếu đủ điểm
        const [membershipTypes] = await require('../config/database').promise().query(
          'SELECT * FROM MembershipType WHERE IsDeleted = 0 ORDER BY MinPoint ASC'
        );
        let newType = null;
        for (const type of membershipTypes) {
          if (userInfo.TotalAccumulatedPoints + earnedPoint >= type.MinPoint) {
            newType = type;
          }
        }
        if (newType && newType.MembershipTypeId != userInfo.MembershipTypeId) {
          await User.upgradeMembership(
            booking.MemberId,
            newType.MembershipTypeId,
            new Date(),
            null
          );
          console.log('[DEBUG] Upgraded membership to:', newType);
        }
      }
    }
    res.json({ message: 'Booking confirmed successfully' });
  } catch (err) {
    console.error('[DEBUG] Error in confirmBooking:', err);
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
    // Lấy thông tin booking
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    // Tìm lịch sử điểm đã trừ cho booking này
    const [scoreRows] = await require('../config/database').promise().query(
      "SELECT * FROM ScoreHistory WHERE RelatedBookingId = ? AND ScoreValue < 0 AND IsDeleted = 0",
      [bookingId]
    );
    let pointsRefunded = 0;
    if (scoreRows.length > 0) {
      pointsRefunded = Math.abs(scoreRows.reduce((sum, row) => sum + row.ScoreValue, 0));
      // Cộng lại điểm cho user
      const user = await User.findById(booking.MemberId);
      if (user) {
        const newScoreBalance = (user.ScoreBalance || 0) + pointsRefunded;
        await User.updateScoreBalance(booking.MemberId, newScoreBalance);
        // Ghi lịch sử hoàn điểm
        await ScoreHistory.createScoreHistory({
          MemberId: booking.MemberId,
          RelatedBookingId: bookingId,
          ScoreValue: pointsRefunded,
          ChangeType: 4,
          ChangeDate: new Date(),
          CreatedBy: booking.MemberId
        });
      }
    }
    const result = await Booking.cancelBooking(bookingId);
    if (result) {
      res.status(200).json({ message: "Booking cancelled successfully", pointsRefunded });
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
