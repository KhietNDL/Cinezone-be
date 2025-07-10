const db = require("../config/database");

/**
 * Kiểm tra các ghế có thực sự sát nhau trên lưới (hàng hoặc cột liền kề)
 * @param {Array<string>} seatIds - Danh sách SeatId cần kiểm tra
 * @throws Error nếu ghế không hợp lệ
 */
async function validateSeatsAdjacent(seatIds) {
  if (!Array.isArray(seatIds) || seatIds.length < 2) return true;

  const [seats] = await db.promise().query(
    `SELECT SeatId, SeatNumber FROM Seats WHERE SeatId IN (?) AND IsDeleted = 0`,
    [seatIds]
  );
  if (seats.length !== seatIds.length) {
    throw new Error("Some seats not found");
  }

  // Chuyển SeatNumber thành tọa độ (row, col)
  const seatMap = {};
  const coords = seats.map(s => {
    const match = /^([A-Za-z]+)(\d+)$/.exec(s.SeatNumber);
    if (!match) throw new Error(`Invalid seat format: ${s.SeatNumber}`);
    // row: mã ASCII của ký tự đầu (A=65, B=66,...), col: số ghế
    const row = match[1].toUpperCase().charCodeAt(0);
    const col = Number(match[2]);
    seatMap[`${row},${col}`] = true;
    return { row, col };
  });

  // BFS kiểm tra liên thông
  const visited = {};
  const queue = [];
  queue.push(coords[0]);
  visited[`${coords[0].row},${coords[0].col}`] = true;
  let count = 1;

  const directions = [
    { dr: 0, dc: 1 },  // phải
    { dr: 0, dc: -1 }, // trái
    { dr: 1, dc: 0 },  // xuống
    { dr: -1, dc: 0 }, // lên
  ];

  while (queue.length) {
    const { row, col } = queue.shift();
    for (const { dr, dc } of directions) {
      const nr = row + dr;
      const nc = col + dc;
      const key = `${nr},${nc}`;
      if (seatMap[key] && !visited[key]) {
        visited[key] = true;
        queue.push({ row: nr, col: nc });
        count++;
      }
    }
  }

  if (count !== coords.length) {
    throw new Error("Seats must be adjacent (connected horizontally or vertically)");
  }
  return true;
}

async function bookingSeatsValidator(req, res, next) {
  try {
    const seatIds = req.body.seatIds;
    await validateSeatsAdjacent(seatIds);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function bookingValidator(req, res, next) {
  const { userId, showtimeId, seatIds, promotionTitle, discount, CreatedBy } = req.body;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required and must be a string' });
  }
  if (!showtimeId || typeof showtimeId !== 'string') {
    return res.status(400).json({ error: 'showtimeId is required and must be a string' });
  }
  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ error: 'seatIds must be a non-empty array' });
  }
  for (const seatId of seatIds) {
    if (typeof seatId !== 'string') {
      return res.status(400).json({ error: 'Each seatId must be a string' });
    }
  }
  if (promotionTitle && typeof promotionTitle !== 'string') {
    return res.status(400).json({ error: 'promotionTitle must be a string' });
  }
  if (discount !== undefined && (typeof discount !== 'number' || discount < 0)) {
    return res.status(400).json({ error: 'discount must be a non-negative number' });
  }
  if (CreatedBy && typeof CreatedBy !== 'string') {
    return res.status(400).json({ error: 'CreatedBy must be a string' });
  }
  next();
}

module.exports = {
  validateSeatsAdjacent,
  bookingSeatsValidator,
  bookingValidator
};