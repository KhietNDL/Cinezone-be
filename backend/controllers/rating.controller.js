const Rating = require('../models/rating.model');
const Movie = require('../models/movie.model');

const ratingController = {
  createRating: async (req, res) => {
    try {
      const userId = req.user.UserId;
      const { movieId, rating, comment } = req.body;
      if (!movieId || !rating) {
        return res.status(400).json({ message: 'movieId và rating là bắt buộc' });
      }
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
      }
      // Kiểm tra đã rating chưa
      const hasRated = await Rating.checkUserRatedMovie(userId, movieId);
      if (hasRated) {
        return res.status(400).json({ message: 'Bạn đã rating phim này rồi' });
      }
      // Kiểm tra đã xem phim chưa
      console.log(`[DEBUG] User ${userId} trying to rate movie ${movieId}`);
      const hasWatched = await Rating.checkUserWatchedMovie(userId, movieId);
      console.log(`[DEBUG] Has watched result: ${hasWatched}`);
      if (!hasWatched) {
        return res.status(400).json({ message: 'Bạn chưa đủ điều kiện rating (chưa có booking hoặc chưa qua khung giờ chiếu)' });
      }
      // Lưu rating
      await Rating.createRating({ userId, movieId, rating, comment });
      // Cập nhật điểm trung bình và tổng số rating cho phim
      const summary = await Rating.getMovieRatingSummary(movieId);
      await Movie.updateMovieRatingStats(movieId, summary.averageRating, summary.totalRatings);
      return res.status(201).json({ message: 'Rating thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getRatingsByMovie: async (req, res) => {
    try {
      const { movieId } = req.params;
      const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
      const result = await Rating.getRatingsByMovie(movieId, { page: Number(page), limit: Number(limit), sortBy });
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  updateRating: async (req, res) => {
    try {
      const userId = req.user.UserId;
      const { ratingId } = req.params;
      const { rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
      }
      // Kiểm tra quyền sở hữu
      const [row] = await Rating.getRatingById(ratingId);
      if (!row || row.UserId !== userId) {
        return res.status(403).json({ message: 'Không có quyền sửa rating này' });
      }
      await Rating.updateRating(ratingId, { rating, comment });
      // Cập nhật lại điểm trung bình phim
      const summary = await Rating.getMovieRatingSummary(row.MovieId);
      await Movie.updateMovieRatingStats(row.MovieId, summary.averageRating, summary.totalRatings);
      return res.json({ message: 'Cập nhật rating thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  deleteRating: async (req, res) => {
    try {
      const userId = req.user.UserId;
      const { ratingId } = req.params;
      const [row] = await Rating.getRatingById(ratingId);
      if (!row || row.UserId !== userId) {
        return res.status(403).json({ message: 'Không có quyền xóa rating này' });
      }
      await Rating.deleteRating(ratingId, userId);
      // Cập nhật lại điểm trung bình phim
      const summary = await Rating.getMovieRatingSummary(row.MovieId);
      await Movie.updateMovieRatingStats(row.MovieId, summary.averageRating, summary.totalRatings);
      return res.json({ message: 'Xóa rating thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getMovieRatingSummary: async (req, res) => {
    try {
      const { movieId } = req.params;
      const summary = await Rating.getMovieRatingSummary(movieId);
      return res.json(summary);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = ratingController; 