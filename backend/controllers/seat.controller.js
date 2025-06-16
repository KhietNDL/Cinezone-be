const Seat = require('../models/seat.moddel');

// Lấy tất cả ghế
const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.getAllSeats();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy ghế theo CinemaRoomId
const getSeatsByCinemaRoomId = async (req, res) => {
  const { cinemaRoomId } = req.params;
  try {
    const seats = await Seat.getSeatsByCinemaRoomId(cinemaRoomId);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy ghế theo SeatId
const getSeatById = async (req, res) => {
  const { seatId } = req.params;
  try {
    const seat = await Seat.getSeatById(seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    res.json(seat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm ghế mới
const createSeat = async (req, res) => {
  try {
    const seatId = await Seat.createSeat(req.body);
    res.status(201).json({ seatId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật ghế
const updateSeat = async (req, res) => {
  const { seatId } = req.params;
  try {
    const success = await Seat.updateSeat(seatId, req.body);
    if (!success) return res.status(404).json({ error: 'Seat not found' });
    res.json({ message: 'Seat updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa ghế
const deleteSeat = async (req, res) => {
  const { seatId } = req.params;
  try {
    const success = await Seat.deleteSeat(seatId);
    if (!success) return res.status(404).json({ error: 'Seat not found' });
    res.json({ message: 'Seat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách ghế theo showtimeId
const getSeatsByShowtimeId = async (req, res) => {
  const { showtimeId } = req.params;
  try {
    const seats = await Seat.getSeatsByShowtimeId(showtimeId);
    res.json({
      showtimeId,
      seats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSeats,
  getSeatsByCinemaRoomId,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatsByShowtimeId // giữ lại hàm này nếu cần
};