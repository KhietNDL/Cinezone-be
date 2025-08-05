const Analytics = require("../models/analytics.model");

const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

exports.getRevenueByMonth = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        const data = await Analytics.getRevenueByMonth(year);
        const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);
        res.json({
            totalRevenue,
            data: data.map(d => ({
                label: MONTHS_EN[d.month - 1],
                total: d.total
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueByQuarter = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        const data = await Analytics.getRevenueByQuarter(year);
        const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);
        res.json({
            totalRevenue,
            data: data.map(d => ({
                label: `Quarter ${d.quarter}`,
                total: d.total
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueThisMonth = async (req, res) => {
    try {
        const data = await Analytics.getRevenueThisMonth();

        const totalRevenue = data.reduce((sum, day) => sum + day.total, 0);

        res.json({
            totalRevenue,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueThisWeek = async (req, res) => {
    try {
        const data = await Analytics.getRevenueThisWeek();

        const totalRevenue = data.reduce((sum, day) => sum + day.total, 0);

        res.json({
            totalRevenue,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueThisQuarter = async (req, res) => {
    try {
        const total = await Analytics.getRevenueThisQuarter();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserAgeGroups = async (req, res) => {
    try {
        const data = await Analytics.getAgeGroups();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeesAgeGroups = async (req, res) => {
    try {
        const data = await Analytics.getEmployeesAgeGroups();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketStats = async (req, res) => {
    try {
        const { type = 'day', year, month } = req.query;
        if (!year || (type === 'day' && !month)) {
            return res.status(400).json({ error: 'Missing year or month' });
        }
        const stats = await Analytics.countTicketsByDate({ type, year, month });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueThisDay = async (req, res) => {
    try {
        const data = await Analytics.getRevenueThisDay();

        res.json({
            totalRevenue: data.total,
            bookingCount: data.bookingCount,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsersByMembershipRank = async (req, res) => {
    try {
        const data = await Analytics.getUsersByMembershipRank();
        const totalUsers = data.reduce((sum, rank) => sum + rank.count, 0);

        res.json({
            totalUsers,
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMovieGenreStats = async (req, res) => {
    try {
        const genreStats = await Analytics.getMovieGenreStats();

        // Tính tổng số lượng
        const totalGenreCount = genreStats.reduce((sum, item) => sum + item.count, 0);

        // Chỉ lấy top 5 thể loại phổ biến nhất, còn lại gộp vào "Others"
        let topGenres = genreStats.slice(0, 5);

        // Tính tổng số lượng của các thể loại còn lại
        const otherGenresCount = genreStats.slice(5).reduce((sum, item) => sum + item.count, 0);

        // Thêm danh mục "Others" nếu có
        if (otherGenresCount > 0) {
            topGenres.push({
                genre: 'Others',
                count: otherGenresCount
            });
        }

        // Thêm tỷ lệ phần trăm
        topGenres = topGenres.map(item => ({
            ...item,
            percentage: Math.round((item.count / totalGenreCount) * 100)
        }));

        res.json({
            totalCount: totalGenreCount,
            data: topGenres,
            allGenres: genreStats // Trả về tất cả thể loại nếu frontend muốn hiển thị chi tiết hơn
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeTenureStats = async (req, res) => {
    try {
        const data = await Analytics.getEmployeeTenureStats();
        const totalEmployees = data.reduce((sum, group) => sum + group.total, 0);

        const dataWithPercentage = data.map(group => ({
            ...group,
            percentage: totalEmployees ? Math.round((group.total / totalEmployees) * 100) : 0
        }));

        res.json({
            totalEmployees,
            data: dataWithPercentage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopMoviesByTickets = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 20) limit = 20;
        const { day, month, year } = req.query;
        const filter = {};
        if (year) filter.year = Number(year);
        if (month) filter.month = Number(month);
        if (day) filter.day = Number(day);
        const data = await Analytics.getTopMoviesByTickets(limit, filter);
        res.json({
            filter: {
                day: filter.day || null,
                month: filter.month || null,
                year: filter.year || null
            },
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopGenresByTickets = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(limit) || limit < 1) limit = 5;
        if (limit > 20) limit = 20;
        const { day, month, year } = req.query;
        const filter = {};
        if (year) filter.year = Number(year);
        if (month) filter.month = Number(month);
        if (day) filter.day = Number(day);
        const data = await Analytics.getTopGenresByTickets(limit, filter);
        res.json({
            filter: {
                day: filter.day || null,
                month: filter.month || null,
                year: filter.year || null
            },
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};