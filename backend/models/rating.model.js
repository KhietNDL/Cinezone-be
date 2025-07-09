const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Rating {
  static async createRating({ userId, movieId, rating, comment }) {
    const ratingId = uuidv4();
    const now = new Date();
    const sql = `INSERT INTO Ratings (RatingId, UserId, MovieId, Rating, Comment, CreatedAt, UpdatedAt, IsDeleted, DeletedBy)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)`;
    await db.promise().query(sql, [ratingId, userId, movieId, rating, comment, now, now]);
    return ratingId;
  }

  static async getRatingsByMovie(movieId, { page = 1, limit = 10, sortBy = 'newest' }) {
    let orderBy = 'CreatedAt DESC';
    if (sortBy === 'oldest') orderBy = 'CreatedAt ASC';
    if (sortBy === 'rating_high') orderBy = 'Rating DESC';
    if (sortBy === 'rating_low') orderBy = 'Rating ASC';
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM Ratings WHERE MovieId = ? AND IsDeleted = 0 ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const [rows] = await db.promise().query(sql, [movieId, limit, offset]);
    const [countRows] = await db.promise().query('SELECT COUNT(*) as total FROM Ratings WHERE MovieId = ? AND IsDeleted = 0', [movieId]);
    const total = countRows[0].total;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    return {
      ratings: rows,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        limit: limit > 0 ? limit : rows.length,
      },
    };
  }

  static async updateRating(ratingId, { rating, comment }) {
    const now = new Date();
    const sql = `UPDATE Ratings SET Rating = ?, Comment = ?, UpdatedAt = ? WHERE RatingId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [rating, comment, now, ratingId]);
    return result.affectedRows > 0;
  }

  static async deleteRating(ratingId, deletedBy) {
    const now = new Date();
    const sql = `UPDATE Ratings SET IsDeleted = 1, DeletedBy = ?, UpdatedAt = ? WHERE RatingId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [deletedBy, now, ratingId]);
    return result.affectedRows > 0;
  }

  static async getMovieRatingSummary(movieId) {
    // Lấy average, total, và phân phối rating
    const [avgRows] = await db.promise().query('SELECT AVG(Rating) as averageRating, COUNT(*) as totalRatings FROM Ratings WHERE MovieId = ? AND IsDeleted = 0', [movieId]);
    const [distRows] = await db.promise().query('SELECT Rating, COUNT(*) as count FROM Ratings WHERE MovieId = ? AND IsDeleted = 0 GROUP BY Rating', [movieId]);
    const ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    distRows.forEach(r => { ratingDistribution[r.Rating] = r.count; });
    return {
      averageRating: Number(avgRows[0].averageRating || 0).toFixed(2),
      totalRatings: avgRows[0].totalRatings,
      ratingDistribution
    };
  }

  static async checkUserRatedMovie(userId, movieId) {
    const [rows] = await db.promise().query('SELECT * FROM Ratings WHERE UserId = ? AND MovieId = ? AND IsDeleted = 0', [userId, movieId]);
    return rows.length > 0;
  }

  static async checkUserWatchedMovie(userId, movieId) {
    console.log(`[DEBUG] Checking if user ${userId} watched movie ${movieId}`);
    
    // Kiểm tra user đã có booking cho movie này và đã qua khung giờ chiếu
    const sql = `SELECT b.BookingId, s.Day, s.Time, m.RunningTime
      FROM Bookings b
      JOIN Showtimes s ON b.ShowtimeId = s.ShowtimeId
      JOIN Version v ON s.VersionId = v.VersionId
      JOIN Movies m ON v.MovieId = m.MovieId
      WHERE b.MemberId = ? AND v.MovieId = ? AND b.Status = 2 AND b.IsDeleted = 0 AND s.IsDeleted = 0 AND m.IsDeleted = 0`;
    
    console.log(`[DEBUG] SQL Query: ${sql}`);
    console.log(`[DEBUG] Parameters: userId=${userId}, movieId=${movieId}`);
    
    const [rows] = await db.promise().query(sql, [userId, movieId]);
    console.log(`[DEBUG] Found ${rows.length} bookings`);
    console.log(`[DEBUG] Booking data:`, JSON.stringify(rows, null, 2));
    
    if (!rows.length) {
      console.log(`[DEBUG] No bookings found, returning false`);
      return false;
    }
    
    // Kiểm tra đã qua khung giờ chiếu (thời gian bắt đầu + thời lượng phim)
    const now = new Date();
    console.log(`[DEBUG] Current time: ${now.toISOString()}`);
    
    for (const row of rows) {
      console.log(`[DEBUG] Processing booking:`, JSON.stringify(row, null, 2));
      
      // Kiểm tra dữ liệu Day và Time
      console.log(`[DEBUG] Day: ${row.Day}, Time: ${row.Time}`);
      
      if (!row.Day || !row.Time) {
        console.log(`[DEBUG] Missing Day or Time data, skipping`);
        continue;
      }
      
      try {
        // Xử lý Day và Time từ database
        let showDateTime;
        
        if (row.Day instanceof Date) {
          // Nếu Day đã là Date object, chỉ cần set time
          showDateTime = new Date(row.Day);
          const [hours, minutes, seconds] = row.Time.split(':');
          showDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds), 0);
        } else {
          // Nếu Day là string, tạo Date từ string
          showDateTime = new Date(row.Day + 'T' + row.Time);
        }
        
        // Kiểm tra xem Date có hợp lệ không
        if (isNaN(showDateTime.getTime())) {
          console.log(`[DEBUG] Invalid date created from: Day=${row.Day}, Time=${row.Time}`);
          continue;
        }
        
        console.log(`[DEBUG] Show date/time: ${showDateTime.toISOString()}`);
        
        const movieDuration = (row.RunningTime || 120) * 60000; // Thời lượng phim tính bằng phút, chuyển sang milliseconds
        console.log(`[DEBUG] Movie duration: ${row.RunningTime} minutes = ${movieDuration} ms`);
        
        const endDateTime = new Date(showDateTime.getTime() + movieDuration);
        console.log(`[DEBUG] End date/time: ${endDateTime.toISOString()}`);
        
        console.log(`[DEBUG] Is end time < now? ${endDateTime < now}`);
        
        if (endDateTime < now) {
          console.log(`[DEBUG] Found valid booking, returning true`);
          return true;
        }
      } catch (error) {
        console.log(`[DEBUG] Error processing date: ${error.message}`);
        continue;
      }
    }
    
    console.log(`[DEBUG] No valid bookings found, returning false`);
    return false;
  }

  static async getRatingById(ratingId) {
    const [rows] = await db.promise().query('SELECT * FROM Ratings WHERE RatingId = ? AND IsDeleted = 0', [ratingId]);
    return rows;
  }
}

module.exports = Rating; 