const db = require('../config/database');

/**
 * Xóa các ghế trong SeatShowtime của các suất chiếu đã kết thúc
 * (Day + Time + Duration < NOW())
 */
async function cleanupOldSeats() {
  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // Lấy các ShowtimeId đã kết thúc
    const [showtimes] = await connection.query(
      `
      SELECT s.ShowtimeId
      FROM Showtimes s
      WHERE TIMESTAMPADD(MINUTE, s.Duration, CONCAT(s.Day, ' ', s.Time)) < NOW()
      `
    );
    if (showtimes.length === 0) {
      await connection.commit();
      console.log('No expired showtimes found.');
      return;
    }
    const showtimeIds = showtimes.map(st => st.ShowtimeId);

    // Xóa các ghế liên quan trong SeatShowtime
    await connection.query(
      `DELETE FROM SeatShowtime WHERE ShowtimeId IN (?)`,
      [showtimeIds]
    );

    await connection.commit();
    console.log(`Cleaned up seats for ${showtimeIds.length} expired showtimes.`);
  } catch (err) {
    await connection.rollback();
    console.error('Seat cleanup error:', err);
  } finally {
    connection.release();
  }
}

module.exports = cleanupOldSeats;