const SeatShowtime = require('../models/seatshowtime.model');

// Lấy tất cả
const getAllSeatShowtimes = async (req, res) => {
  try {
    const data = await SeatShowtime.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy theo id
const getSeatShowtimeById = async (req, res) => {
  try {
    const { seatShowtimeId } = req.params;
    const data = await SeatShowtime.getById(seatShowtimeId);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo mới
const createSeatShowtime = async (req, res) => {
  try {
    const id = await SeatShowtime.create(req.body);
    res.status(201).json({ seatShowtimeId: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật
const updateSeatShowtime = async (req, res) => {
  try {
    const { seatShowtimeId } = req.params;
    const success = await SeatShowtime.update(seatShowtimeId, req.body);
    if (!success) return res.status(404).json({ error: 'Not found or not updated' });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa mềm
const deleteSeatShowtime = async (req, res) => {
  try {
    const { seatShowtimeId } = req.params;
    const { deletedBy } = req.body;
    const success = await SeatShowtime.delete(seatShowtimeId, deletedBy);
    if (!success) return res.status(404).json({ error: 'Not found or not deleted' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSeatShowtimes,
  getSeatShowtimeById,
  createSeatShowtime,
  updateSeatShowtime,
  deleteSeatShowtime,
};
