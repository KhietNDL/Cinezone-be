// backend/middlewares/seat.validator.js

function validateSeat(req, res, next) {
  const { SeatNumber, Type } = req.body;

  // Validate SeatNumber: A1-H8
  const seatNumberPattern = /^[A-H][1-8]$/;
  if (!SeatNumber || !seatNumberPattern.test(SeatNumber)) {
    return res.status(400).json({ error: 'SeatNumber must be in format A1-H8 (A-H + 1-8)' });
  }

  // Validate Type: Normal, Vip, Couple
  const validTypes = ['Normal', 'Vip', 'Couple'];
  if (!Type || !validTypes.includes(Type)) {
    return res.status(400).json({ error: 'Type must be one of: Normal, Vip, Couple' });
  }

  next();
}

module.exports = { validateSeat };
