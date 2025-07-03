const Showtime = require('../models/showtime.model');
const Movie = require('../models/movie.model');
const CinemaRoom = require('../models/cinemaRoom.model');
const { validate: uuidValidate } = require('uuid');
const { normalizeDate } = require("../middlewares/showtime.validator");

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
    VersionId: showtime.VersionId,
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

// Tạo showtime mới (batch)
exports.createShowtime = async (req, res) => {
    try {
        const { VersionId, CinemaRoomId, Duration, Day, Times } = req.body;
        const CreatedBy = req.user.UserId;

        if (!VersionId || !uuidValidate(VersionId)) return res.status(400).json({ error: 'VersionId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (!CinemaRoomId || !uuidValidate(CinemaRoomId)) return res.status(400).json({ error: 'CinemaRoomId must be UUID', code: ERROR_CODES.INVALID_UUID });
        if (!Duration || isNaN(Duration) || Duration <= 0) return res.status(400).json({ error: 'Duration must be a positive number', code: ERROR_CODES.INVALID_INPUT });
        if (!Day || !isValidDate(Day)) return res.status(400).json({ error: 'Day must be YYYY-MM-DD', code: ERROR_CODES.INVALID_INPUT });
        if (!Array.isArray(Times) || Times.length === 0) return res.status(400).json({ error: 'Times must be a non-empty array', code: ERROR_CODES.INVALID_INPUT });

        // Validate ngày không được là quá khứ và nếu là ngày hiện tại thì chỉ cho phép tạo showtime cho 7 ngày sau trở đi
        const today = new Date();
        today.setHours(0,0,0,0);
        const showDate = new Date(Day);
        showDate.setHours(0,0,0,0);
        if (showDate < today) {
            return res.status(400).json({ error: 'Không thể tạo showtime cho ngày trong quá khứ!' });
        }
        const diffDays = Math.floor((showDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            return res.status(400).json({ error: 'Chỉ được phép tạo showtime cho ngày cách hiện tại ít nhất 7 ngày!' });
        }

        const results = [];
        for (const Time of Times) {
            if (!isValidTime(Time)) {
                results.push({ Time, success: false, error: 'Time must be HH:mm:ss' });
                continue;
            }
            try {
                const showtimeId = await Showtime.create({ VersionId, CinemaRoomId, Duration, Day, Time, CreatedBy });
                const newShowtime = await Showtime.findById(showtimeId);
                results.push({ Time, success: true, data: formatShowtime(newShowtime) });
            } catch (err) {
                results.push({ Time, success: false, error: err.message });
            }
        }
        res.status(201).json({
            message: 'Batch showtime creation result',
            results
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

exports.getSeatsByShowtime = async (req, res) => {
  const { showtimeId } = req.params;
  try {
    const result = await Showtime.getSeatsWithStatusByShowtime(showtimeId);
    if (!result) {
      return res.status(404).json({ error: 'Showtime not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getShowtimesByMovieId = async (req, res) => {
    const { movieId } = req.params;
    try {
        const rows = await Showtime.getShowtimesByMovie(movieId);
        // Loại trùng theo Day + roomName
        const unique = new Set();
        const result = [];
        rows.forEach(row => {
            const key = `${row.Day}_${row.Name}`;
            if (!unique.has(key)) {
                unique.add(key);
                result.push({
                    Day: normalizeDate(row.Day),
                });
            }
        });

        // Sắp xếp theo ngày
        result.sort((a, b) => a.Day.localeCompare(b.Day));
        res.json({
            movieId,
            showtimes: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShowtimesByMovieIdAndDay = async (req, res) => {
    const { movieId } = req.params;
    let { day } = req.query;
    day = normalizeDate(day);

    if (!movieId || !day) {
        return res.status(400).json({ error: 'Missing movieId or day' });
    }

    try {
        const rows = await Showtime.searchByMovieIdAndDay(movieId, day);

        // Gom nhóm theo version
        const versionMap = {};
        rows.forEach(row => {
            const version = row.VersionType;
            if (!versionMap[version]) {
                versionMap[version] = [];
            }
            // Lấy giờ:phút từ row.Time (giả sử row.Time là chuỗi "HH:mm:ss")
            const timeHM = typeof row.Time === 'string' ? row.Time.slice(0, 5) : '';
            versionMap[version].push({
                showtimeId: row.ShowtimeId,
                time: timeHM,
                roomName: row.roomName
            });
        });

        const result = Object.entries(versionMap).map(([version, showtimes]) => ({
            version,
            showtimes
        }));

        res.json({
            movieId,
            day,
            versions: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy showtime theo VersionId
exports.getShowtimesByVersionId = async (req, res) => {
    const { versionId } = req.params;
    try {
        const rows = await Showtime.getShowtimesByVersion(versionId);
        // Loại trùng theo Day + roomName
        const unique = new Set();
        const result = [];
        rows.forEach(row => {
            const key = `${row.Day}_${row.Name}`;
            if (!unique.has(key)) {
                unique.add(key);
                result.push({
                    Day: normalizeDate(row.Day),
                });
            }
        });
        result.sort((a, b) => a.Day.localeCompare(b.Day));
        res.json({
            versionId,
            showtimes: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
