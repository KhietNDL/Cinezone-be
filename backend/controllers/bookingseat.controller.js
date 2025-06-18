const BookingSeat = require('../models/bookingseat.model');

const createBookingSeat = async (req, res) => {
  try {
    const bookingSeatId = await BookingSeat.createBookingSeat(req.body);
    res.status(201).json({ bookingSeatId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSeatsByBookingId = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const seats = await BookingSeat.getSeatsByBookingId(bookingId);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingsBySeatId = async (req, res) => {
  const { seatId } = req.params;
  try {
    const bookings = await BookingSeat.getBookingsBySeatId(seatId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBookingSeat = async (req, res) => {
  const { bookingSeatId } = req.params;
  try {
    const success = await BookingSeat.deleteBookingSeat(bookingSeatId);
    if (!success) return res.status(404).json({ error: 'BookingSeat not found' });
    res.json({ message: 'BookingSeat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBookingSeat,
  getSeatsByBookingId,
  getBookingsBySeatId,
  deleteBookingSeat
};
