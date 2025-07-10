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
        const total = await Analytics.getRevenueThisMonth();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRevenueThisWeek = async (req, res) => {
    try {
        const total = await Analytics.getRevenueThisWeek();
        res.json({ total });
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