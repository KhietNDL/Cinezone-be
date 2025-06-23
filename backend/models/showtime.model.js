const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Hàm helper để format datetime cho MySQL
const formatDateTime = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
};

class Showtime {
    static async findAll() {
        const query = `
            SELECT * FROM Showtimes
            WHERE IsDeleted = 0 OR IsDeleted IS NULL
        `;
        try {
            console.log('Executing findAll query:', query);
            const [rows] = await db.promise().query(query);
            console.log('Raw query result:', JSON.stringify(rows, null, 2));
            
            // Kiểm tra cấu trúc bảng
            const [tableInfo] = await db.promise().query('SHOW COLUMNS FROM Showtimes');
            console.log('Table columns:', JSON.stringify(tableInfo, null, 2));

            // Kiểm tra dữ liệu mẫu với điều kiện IsDeleted
            const [sampleData] = await db.promise().query(`
                SELECT * FROM Showtimes 
                WHERE IsDeleted = 0 OR IsDeleted IS NULL
                LIMIT 1
            `);
            console.log('Sample data with IsDeleted condition:', JSON.stringify(sampleData, null, 2));

            return rows;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        const query = `
            SELECT * FROM Showtimes
            WHERE ShowtimeId = ? AND IsDeleted = 0
        `;
        try {
            const [rows] = await db.promise().query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async create(showtimeData) {
        const { MovieId, CinemaRoomId, Duration, Day, Time, CreatedBy } = showtimeData;
        const ShowtimeId = uuidv4();
        const now = new Date();
        const formattedCreatedAt = formatDateTime(now);

        // Kiểm tra xem MovieId và CinemaRoomId có tồn tại không
        const [movie] = await db.promise().query(
            'SELECT MovieId FROM Movies WHERE MovieId = ? AND IsDeleted = 0',
            [MovieId]
        );
        if (!movie.length) {
            throw new Error('Movie not found');
        }

        const [room] = await db.promise().query(
            'SELECT CinemaRoomId FROM CinemaRooms WHERE CinemaRoomId = ? AND IsDeleted = 0',
            [CinemaRoomId]
        );
        if (!room.length) {
            throw new Error('Cinema room not found');
        }

        // Kiểm tra trùng lịch
        const hasConflict = await this.checkTimeConflict(CinemaRoomId, Day, Time, Duration);
        if (hasConflict) {
            throw new Error('Time slot conflicts with existing showtime');
        }

        const query = `
            INSERT INTO Showtimes (
                ShowtimeId, MovieId, CinemaRoomId, Duration, Day, Time, 
                IsDeleted, CreatedAt, CreatedBy
            )
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
        `;
        try {
            await db.promise().query(query, [
                ShowtimeId, MovieId, CinemaRoomId, Duration, Day, Time,
                formattedCreatedAt, CreatedBy
            ]);
            return ShowtimeId;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    static async update(id, showtimeData) {
        const { MovieId, CinemaRoomId, Duration, Day, Time, UpdatedBy } = showtimeData;
        const now = new Date();
        const formattedUpdatedAt = formatDateTime(now);

        // Lấy thông tin showtime hiện tại
        const [currentShowtime] = await db.promise().query(
            'SELECT * FROM Showtimes WHERE ShowtimeId = ? AND IsDeleted = 0',
            [id]
        );

        if (!currentShowtime.length) {
            throw new Error('Showtime not found');
        }

        const existingShowtime = currentShowtime[0];

        // Kiểm tra xem MovieId và CinemaRoomId có tồn tại không (nếu được cung cấp)
        if (MovieId) {
            const [movie] = await db.promise().query(
                'SELECT MovieId FROM Movies WHERE MovieId = ? AND IsDeleted = 0',
                [MovieId]
            );
            if (!movie.length) {
                throw new Error('Movie not found');
            }
        }

        if (CinemaRoomId) {
            const [room] = await db.promise().query(
                'SELECT CinemaRoomId FROM CinemaRooms WHERE CinemaRoomId = ? AND IsDeleted = 0',
                [CinemaRoomId]
            );
            if (!room.length) {
                throw new Error('Cinema room not found');
            }
        }

        // Sử dụng giá trị mới nếu được cung cấp, nếu không thì giữ giá trị cũ
        const finalMovieId = MovieId || existingShowtime.MovieId;
        const finalCinemaRoomId = CinemaRoomId || existingShowtime.CinemaRoomId;
        const finalDuration = Duration || existingShowtime.Duration;
        const finalDay = Day || existingShowtime.Day;
        const finalTime = Time || existingShowtime.Time;

        // Kiểm tra trùng lịch khi cập nhật
        const hasConflict = await this.checkTimeConflict(
            finalCinemaRoomId,
            finalDay,
            finalTime,
            finalDuration,
            id
        );
        if (hasConflict) {
            throw new Error('Time slot conflicts with existing showtime');
        }

        const query = `
            UPDATE Showtimes 
            SET MovieId = ?, 
                CinemaRoomId = ?, 
                Duration = ?, 
                Day = ?, 
                Time = ?,
                UpdatedAt = ?,
                UpdatedBy = ?
            WHERE ShowtimeId = ? AND IsDeleted = 0
        `;
        try {
            const [result] = await db.promise().query(query, [
                finalMovieId,
                finalCinemaRoomId,
                finalDuration,
                finalDay,
                finalTime,
                formattedUpdatedAt,
                UpdatedBy,
                id
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }

    static async delete(id, DeletedBy) {
        const now = new Date();
        const formattedDeletedAt = formatDateTime(now);
        
        const query = `
            UPDATE Showtimes 
            SET IsDeleted = 1, 
                DeletedAt = ?, 
                DeletedBy = ? 
            WHERE ShowtimeId = ? AND IsDeleted = 0
        `;
        try {
            const [result] = await db.promise().query(query, [formattedDeletedAt, DeletedBy, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }

    static async checkTimeConflict(CinemaRoomId, Day, Time, Duration, excludeId = null) {
        const query = `
            SELECT * FROM Showtimes 
            WHERE CinemaRoomId = ? 
            AND Day = ? 
            AND IsDeleted = 0
            AND (
                (Time <= ? AND ADDTIME(Time, SEC_TO_TIME(Duration * 60)) > ?) OR
                (Time < ADDTIME(?, SEC_TO_TIME(Duration * 60)) AND ADDTIME(Time, SEC_TO_TIME(Duration * 60)) >= ?)
            )
        `;
        const params = [CinemaRoomId, Day, Time, Time, Time, Time];
        
        if (excludeId) {
            query += ' AND ShowtimeId != ?';
            params.push(excludeId);
        }

        try {
            const [rows] = await db.promise().query(query, params);
            return rows.length > 0;
        } catch (error) {
            console.error('Error in checkTimeConflict:', error);
            throw error;
        }
    }

    static async searchByDayTime(Day, Time) {
        let query = `
            SELECT * FROM Showtimes
            WHERE IsDeleted = 0 AND Day = ?
        `;
        const params = [Day];
        if (Time) {
            query += ' AND Time = ?';
            params.push(Time);
        }
        try {
            const [rows] = await db.promise().query(query, params);
            return rows;
        } catch (error) {
            console.error('Error in searchByDayTime:', error);
            throw error;
        }
    }

    static async getSeatsWithStatusByShowtime(showtimeId) {
        // 1. Lấy CinemaRoomId và Name từ Showtime JOIN CinemaRooms
        const [showtimeRows] = await db.promise().query(
            `SELECT st.CinemaRoomId, cr.Name 
             FROM Showtimes st 
             JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId 
             WHERE st.ShowtimeId = ? AND (st.IsDeleted = 0 OR st.IsDeleted IS NULL)`,
            [showtimeId]
        );
        if (!showtimeRows.length) {
            return null;
        }
        const cinemaRoomId = showtimeRows[0].CinemaRoomId;
        const roomName = showtimeRows[0].Name;

        // 2. Lấy tất cả ghế của phòng chiếu này
        const [seatRows] = await db.promise().query(
            'SELECT SeatId, SeatNumber, Type, Price FROM Seats WHERE CinemaRoomId = ? AND IsDeleted = 0',
            [cinemaRoomId]
        );

        // 3. Lấy trạng thái ghế từ SeatShowtime cho suất chiếu này
        const [seatShowtimeRows] = await db.promise().query(
            'SELECT SeatId, Status FROM SeatShowtime WHERE ShowtimeId = ?',
            [showtimeId]
        );
        // Map trạng thái ghế
        const seatStatusMap = {};
        seatShowtimeRows.forEach(bs => {
            seatStatusMap[bs.SeatId] = bs.Status; // Status: 'taken', 'holding'
        });

        // 4. Kết hợp dữ liệu và trả về
        return {
            cinemaRoomId,
            roomName,
            seats: seatRows.map(seat => ({
                seatId: seat.SeatId,
                seatNumber: seat.SeatNumber,
                type: seat.Type,
                price: Number(seat.Price),
                status: seatStatusMap[seat.SeatId] || 'available'
            }))
        };
    }
    static async searchByMovieAndDay(MovieId, Day) {
        const query = `
            SELECT * FROM Showtimes
            WHERE IsDeleted = 0 AND MovieId = ? AND Day = ?
        `;
        try {
            const [rows] = await db.promise().query(query, [MovieId, Day]);
            return rows;
        } catch (error) {
            console.error('Error in searchByMovieAndDay:', error);
            throw error;
        }
    }

    static async getShowtimesByMovie(movieId) {
        const sql = `
          SELECT 
            st.Day
          FROM Version vs
          JOIN Showtimes st ON vs.VersionId = st.VersionId
          WHERE vs.MovieId = ? AND (st.IsDeleted = 0 OR st.IsDeleted IS NULL)
          ORDER BY st.Day;
        `;
        try {
          const [rows] = await db.promise().query(sql, [movieId]);
          return rows;
        } catch (error) {
          throw new Error("Error getting showtimes by movie: " + error.message);
        }
    }
    static async getShowtimesByMovieName(movieName) {
        const sql = `
          SELECT 
        mv.MovieId, 
        st.Day
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE (mv.NameOfVietnamese = ? OR mv.NameOfEnglish = ?)
            AND (st.IsDeleted = 0)
      ORDER BY mv.MovieId, st.Day

        `;
        try {
          const [rows] = await db.promise().query(sql, [movieName, movieName]);
          return rows;
        } catch (error) {
          throw new Error("Error getting showtimes by movie name: " + error.message);
        }
    }
    static async searchByMovieIdAndDay(movieId, day) {
        const sql = `
      SELECT 
        st.ShowtimeId,
        st.Time,
        vs.VersionType,
        cr.Name as roomName,
		mv.NameOfEnglish,
        mv.NameOfVietnamese
      FROM Movies mv
      JOIN Version vs ON mv.MovieId = vs.MovieId
      JOIN Showtimes st ON vs.VersionId = st.VersionId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.MovieId = ?
        AND st.Day = ?
        AND st.IsDeleted = 0
      ORDER BY vs.VersionType, st.Time
    `;
        try {
            const [rows] = await db.promise().query(sql, [movieId, day]);
            return rows;
        } catch (error) {
            throw new Error("Error searching showtimes by movieId and day: " + error.message);
        }
    }
}

module.exports = Showtime;
module.exports = Showtime;