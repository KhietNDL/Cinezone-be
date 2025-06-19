const Showtime = require('../models/showtime.model');
const Movie = require('../models/movie.model');
const CinemaRoom = require('../models/cinemaRoom.model');
const { validate: uuidValidate } = require('uuid');

const ERROR_CODES = {
    SHOWTIME_NOT_FOUND: 'SHOWTIME_001',
    INVALID_UUID: 'SHOWTIME_002',
    INVALID_INPUT: 'SHOWTIME_003',
    SERVER_ERROR: 'SHOWTIME_004'
};

function isValidDate(dateString) {
    // YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

function isValidTime(timeString) {
    // HH:mm:ss
    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString);
}

// Helper format
const formatShowtime = (showtime) => ({
    MovieId: showtime.MovieId,
    CinemaRoomId: showtime.CinemaRoomId,
    Duration: showtime.Duration,
    Day: normalizeDate(showtime.Day),
    Time: showtime.Time
});

// Lấy tất cả showtime
exports.getAllShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.findAll();
        res.json({
            message: 'Showtimes retrieved successfully',
            data: showtimes.map(formatShowtime)
        });
    } catch (error) {
        console.error('Error in getAllShowtimes:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Lấy showtime theo ID
exports.getShowtimeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuidValidate(id)) {
            return res.status(400).json({ error: 'Invalid UUID format', code: ERROR_CODES.INVALID_UUID });
        }
        const showtime = await Showtime.findById(id);
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found', code: ERROR_CODES.SHOWTIME_NOT_FOUND });
        }
        console.log('Showtime found:', showtime);
        res.json({
            message: 'Showtime retrieved successfully',
            data: formatShowtime(showtime)
        });
    } catch (error) {
        console.error('Error in getShowtimeById:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Tạo showtime mới
exports.createShowtime = async (req, res) => {
    try {
        const { MovieId, CinemaRoomId, Duration, Day, Time } = req.body;
        const CreatedBy = req.user.UserId; // Lấy ID của user đang đăng nhập

        console.log('Creating showtime with data:', { MovieId, CinemaRoomId, Duration, Day, Time, CreatedBy });

        if (!MovieId || !uuidValidate(MovieId)) return res.status(400).json({ error: 'MovieId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (!CinemaRoomId || !uuidValidate(CinemaRoomId)) return res.status(400).json({ error: 'CinemaRoomId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (!Duration || isNaN(Duration) || Duration <= 0) return res.status(400).json({ error: 'Duration must be a positive number', code: ERROR_CODES.INVALID_INPUT });
        if (!Day || !isValidDate(Day)) return res.status(400).json({ error: 'Day must be YYYY-MM-DD', code: ERROR_CODES.INVALID_INPUT });
        if (!Time || !isValidTime(Time)) return res.status(400).json({ error: 'Time must be HH:mm:ss', code: ERROR_CODES.INVALID_INPUT });

        const showtimeId = await Showtime.create({ MovieId, CinemaRoomId, Duration, Day, Time, CreatedBy });
        console.log('Showtime created with ID:', showtimeId);

        const newShowtime = await Showtime.findById(showtimeId);
        if (!newShowtime) {
            throw new Error('Failed to retrieve created showtime');
        }

        res.status(201).json({
            message: 'Showtime created successfully',
            data: formatShowtime(newShowtime)
        });
    } catch (error) {
        console.error('Error in createShowtime:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Cập nhật showtime
exports.updateShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuidValidate(id)) return res.status(400).json({ error: 'Invalid UUID format', code: ERROR_CODES.INVALID_UUID });
        
        const { MovieId, CinemaRoomId, Duration, Day, Time } = req.body;
        const UpdatedBy = req.user.UserId; // Lấy ID của user đang đăng nhập

        console.log('Updating showtime with data:', { id, MovieId, CinemaRoomId, Duration, Day, Time, UpdatedBy });

        const showtime = await Showtime.findById(id);
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found', code: ERROR_CODES.SHOWTIME_NOT_FOUND });
        }

        if (MovieId && !uuidValidate(MovieId)) return res.status(400).json({ error: 'MovieId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (CinemaRoomId && !uuidValidate(CinemaRoomId)) return res.status(400).json({ error: 'CinemaRoomId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (Duration && (isNaN(Duration) || Duration <= 0)) return res.status(400).json({ error: 'Duration must be a positive number', code: ERROR_CODES.INVALID_INPUT });
        if (Day && !isValidDate(Day)) return res.status(400).json({ error: 'Day must be YYYY-MM-DD', code: ERROR_CODES.INVALID_INPUT });
        if (Time && !isValidTime(Time)) return res.status(400).json({ error: 'Time must be HH:mm:ss', code: ERROR_CODES.INVALID_INPUT });

        const success = await Showtime.update(id, {
            MovieId: MovieId || showtime.MovieId,
            CinemaRoomId: CinemaRoomId || showtime.CinemaRoomId,
            Duration: Duration || showtime.Duration,
            Day: Day || showtime.Day,
            Time: Time || showtime.Time,
            UpdatedBy
        });

        if (success) {
            const updatedShowtime = await Showtime.findById(id);
            res.json({
                message: 'Showtime updated successfully',
                data: formatShowtime(updatedShowtime)
            });
        } else {
            res.status(400).json({ error: 'Showtime not updated', code: ERROR_CODES.SHOWTIME_NOT_FOUND });
        }
    } catch (error) {
        console.error('Error in updateShowtime:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Xóa showtime
exports.deleteShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuidValidate(id)) return res.status(400).json({ error: 'Invalid UUID format', code: ERROR_CODES.INVALID_UUID });
        
        const DeletedBy = req.user.UserId; // Lấy ID của user đang đăng nhập
        console.log('Deleting showtime:', { id, DeletedBy });

        const success = await Showtime.delete(id, DeletedBy);
        
        if (success) {
            res.json({ message: 'Showtime deleted successfully' });
        } else {
            res.status(404).json({ error: 'Showtime not found', code: ERROR_CODES.SHOWTIME_NOT_FOUND });
        }
    } catch (error) {
        console.error('Error in deleteShowtime:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Search showtime by day and time
exports.searchShowtimes = async (req, res) => {
    try {
        const { Day, Time } = req.query;
        console.log('Searching showtimes with:', { Day, Time });
        
        // Chuẩn hóa ngày
        const normalizedDay = normalizeDate(Day);
        if (!normalizedDay) return res.status(400).json({ error: 'Day must be YYYY-MM-DD', code: ERROR_CODES.INVALID_INPUT });
        
        if (Time && !isValidTime(Time)) return res.status(400).json({ error: 'Time must be HH:mm:ss', code: ERROR_CODES.INVALID_INPUT });
        
        const showtimes = await Showtime.searchByDayTime(normalizedDay, Time);
        res.json({
            message: 'Showtimes search successful',
            data: showtimes.map(formatShowtime)
        });
    } catch (error) {
        console.error('Error in searchShowtimes:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message 
        });
    }
};

// Helper để chuẩn hóa ngày về dạng YYYY-MM-DD
function normalizeDate(dateString) {
    if (!dateString) return null;
    if (typeof dateString !== 'string') {
        // Nếu là Date object, chuyển sang ISO string
        if (dateString instanceof Date) {
            return dateString.toISOString().slice(0, 10);
        }
        // Nếu là số hoặc kiểu khác, chuyển sang string
        dateString = String(dateString);
    }
    // Nếu là ISO dạng 2025-06-18T17:00:00.000Z thì lấy phần trước 'T'
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }
    // Thay thế các ký tự không phải số hoặc dấu gạch ngang thành '-'
    let normalized = dateString.replace(/[./\\]/g, '-');
    // Nếu đúng định dạng YYYY-MM-DD thì trả về
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
    // Nếu là dạng YYYY-M-D thì thêm số 0
    const parts = normalized.split('-');
    if (parts.length === 3) {
        const [y, m, d] = parts;
        if (y.length === 4 && m.length <= 2 && d.length <= 2) {
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
    }
    return null;
}

// API: Lấy khung thời gian chiếu phim theo movieId và day
exports.getShowtimesByMovieAndDay = async (req, res) => {
    try {
        const { movieId } = req.query;
        let { day } = req.query;
        // Chuẩn hóa ngày
        day = normalizeDate(day);
        if (!movieId || !uuidValidate(movieId)) {
            return res.status(400).json({ error: 'Invalid or missing movieId (UUID)', code: ERROR_CODES.INVALID_UUID });
        }
        if (!day || !isValidDate(day)) {
            return res.status(400).json({ error: 'Invalid or missing day (YYYY-MM-DD)', code: ERROR_CODES.INVALID_INPUT });
        }
        // Kiểm tra movieId tồn tại
        const movie = await Movie.getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found', code: ERROR_CODES.SHOWTIME_NOT_FOUND });
        }
        // Lấy các suất chiếu
        const showtimes = await Showtime.searchByMovieAndDay(movieId, day);
        if (!showtimes.length) {
            return res.json({
                movieId,
                day,
                showtimes: []
            });
        }
        // Lấy tên phòng chiếu cho từng suất
        const result = await Promise.all(showtimes.map(async (st) => {
            const room = await CinemaRoom.getCinemaRoomById(st.CinemaRoomId);
            return {
                showtimeId: st.ShowtimeId,
                time: st.Time,
                roomName: room ? room.Name : null
            };
        }));
        res.json({
            movieId,
            day,
            showtimes: result
        });
    } catch (error) {
        console.error('Error in getShowtimesByMovieAndDay:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: ERROR_CODES.SERVER_ERROR,
            details: error.message
        });
    }
}; 