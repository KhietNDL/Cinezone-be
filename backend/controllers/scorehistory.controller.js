const ScoreHistory = require("../models/scorehistory.model");
const Booking = require("../models/booking.model");

const getAllScoreHistory = async (req, res) => {
  try {
    console.log('--- [LOG] GET /api/scorehistory ---');
    console.log('Query params:', req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const result = await ScoreHistory.getAllScoreHistory(page, limit);
    if (limit > 0 && page > 1 && result.scoreHistory.length === 0) {
      return res.status(404).json({ message: "No score history found for this page" });
    }
    if (result.scoreHistory.length === 0) {
      return res.status(200).json({ message: "No score history found", scoreHistory: [] });
    }
    console.log('Score history result:', result);
    res.status(200).json({
      scoreHistory: result.scoreHistory,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all score history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createScoreHistory = async (req, res) => {
  try {
    const { MemberId, bookingId, ChangeType, ChangeDate } = req.body;
    // 1. Lấy booking
    const booking = await Booking.getBookingById(bookingId);
    if (!booking || booking.MemberId !== MemberId) {
      return res.status(404).json({ error: "Booking not found for this user" });
    }
    // 2. Tính điểm (ví dụ: 1 điểm cho mỗi 10k TotalAmount)
    const ScoreValue = Math.floor((booking.TotalAmount || 0) / 10000);
    // 3. Lưu lịch sử điểm
    const scoreHistoryId = await ScoreHistory.createScoreHistory({
      MemberId,
      RelatedBookingId: bookingId,
      ScoreValue,
      ChangeType: ChangeType || 'add' || 'minus',
      ChangeDate: ChangeDate || new Date()
    });
    res.status(201).json({ scoreHistoryId, ScoreValue });
  } catch (error) {
    console.error("Create score history error:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateScoreHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { ChangeType, ScoreValue, ChangeDate, UpdatedBy } = req.body;
    const success = await ScoreHistory.updateScoreHistory(id, { ChangeType, ScoreValue, ChangeDate, UpdatedBy });
    if (!success) return res.status(404).json({ error: 'Score history not found or already deleted' });
    res.json({ message: 'Score history updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteScoreHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;
    const success = await ScoreHistory.deleteScoreHistory(id, DeletedBy);
    if (!success) return res.status(404).json({ error: 'Score history not found or already deleted' });
    res.json({ message: 'Score history deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScoreHistoryByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const result = await ScoreHistory.getScoreHistoryByMemberId(memberId, page, limit);
    if (limit > 0 && page > 1 && result.scoreHistory.length === 0) {
      return res.status(404).json({ message: "No score history found for this page" });
    }
    if (result.scoreHistory.length === 0) {
      return res.status(200).json({ message: "No score history found", scoreHistory: [] });
    }
    res.status(200).json({
      scoreHistory: result.scoreHistory,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get score history by memberId error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllScoreHistory,
  getScoreHistoryByMemberId,
  createScoreHistory,
  updateScoreHistory,
  deleteScoreHistory
}; 