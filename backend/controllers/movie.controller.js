const MovieModel = require('../models/movie.model');

// Lấy version, showtime, room theo movieId
const getMovieShowtimes = async (req, res) => {
  const { movieId } = req.params;
  try {
    const rows = await MovieModel.getMovieShowtimes(movieId);
    // Gom nhóm theo version
    const movieinfo = {};
    rows.forEach(row => {
      if (!movieinfo[row.Version]) {
        movieinfo[row.Version] = {
          version: row.Version,
          showtimes: []
        };
      }
      movieinfo[row.Version].showtimes.push({
        showtimeId: row.ShowtimeId,
        showDate: row.ShowDate,
        duration: row.Duration,
        room: {
          roomId: row.CinemaRoomId,
          roomName: row.Name
        }
      });
    });
    res.json({
      movieId,
      movieinfo: Object.values(movieinfo)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieShowtimesByVietnameseName = async (req, res) => {
  const { nameOfVietnamese } = req.params;
  try {
    const rows = await MovieModel.getMovieShowtimesByVietnameseName(nameOfVietnamese);
    const movieinfo = {};
    rows.forEach(row => {
      if (!movieinfo[row.Version]) {
        movieinfo[row.Version] = {
          version: row.Version,
          showtimes: []
        };
      }
      movieinfo[row.Version].showtimes.push({
        showtimeId: row.ShowtimeId,
        showDate: row.ShowDate,
        duration: row.Duration,
        room: {
          roomId: row.CinemaRoomId,
          roomName: row.Name
        }
      });
    });
    res.json({
      nameOfVietnamese,
      movieinfo: Object.values(movieinfo)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieShowtimesByEnglishName = async (req, res) => {
  const { nameOfEnglish } = req.params;
  try {
    const rows = await MovieModel.getMovieShowtimesByEnglishName(nameOfEnglish);
    const movieinfo = {};
    rows.forEach(row => {
      if (!movieinfo[row.Version]) {
        movieinfo[row.Version] = {
          version: row.Version,
          showtimes: []
        };
      }
      movieinfo[row.Version].showtimes.push({
        showtimeId: row.ShowtimeId,
        showDate: row.ShowDate,
        duration: row.Duration,
        room: {
          roomId: row.CinemaRoomId,
          roomName: row.Name
        }
      });
    });
    res.json({
      nameOfEnglish,
      movieinfo: Object.values(movieinfo)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMovieShowtimes, getMovieShowtimesByVietnameseName, getMovieShowtimesByEnglishName };
