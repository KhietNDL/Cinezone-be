const db = require("../config/database");

class MovieModel {
  static async getMovieShowtimes(movieId) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.ShowDate, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.MovieId = ?
      ORDER BY mv.MovieId, st.ShowDate
    `;
    try {
      const [rows] = await db.promise().query(sql, [movieId]);
      return rows;
    } catch (error) {
      throw new Error('Error getting movie showtimes: ' + error.message);
    }
  }

  static async getMovieShowtimesByVietnameseName(nameOfVietnamese) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.ShowDate, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.NameOfVietnamese = ?
      ORDER BY mv.MovieId, st.ShowDate
    `;
    try {
      const [rows] = await db.promise().query(sql, [nameOfVietnamese]);
      return rows;
    } catch (error) {
      throw new Error('Error getting movie showtimes by Vietnamese name: ' + error.message);
    }
  }

  static async getMovieShowtimesByEnglishName(nameOfEnglish) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.ShowDate, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.NameOfEnglish = ?
      ORDER BY mv.MovieId, st.ShowDate
    `;
    try {
      const [rows] = await db.promise().query(sql, [nameOfEnglish]);
      return rows;
    } catch (error) {
      throw new Error('Error getting movie showtimes by English name: ' + error.message);
    }
  }
}

module.exports = MovieModel;
