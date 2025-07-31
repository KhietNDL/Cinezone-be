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