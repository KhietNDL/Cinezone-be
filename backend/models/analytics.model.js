const db = require("../config/database");

class Analytics {
    static async getRevenueByMonth(year) {
        const sql = `
      SELECT MONTH(BookingDate) as month, SUM(TotalAmount) as total
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3) AND YEAR(BookingDate) = ?
      GROUP BY MONTH(BookingDate)
      ORDER BY month
    `;
        const [rows] = await db.promise().query(sql, [year]);
        const data = [];
        for (let i = 1; i <= 12; i++) {
            const found = rows.find(r => Number(r.month) === i);
            data.push({
                month: i,
                total: found ? Number(found.total) : 0
            });
        }
        return data;
    }

    static async getRevenueByQuarter(year) {
        const sql = `
      SELECT QUARTER(BookingDate) as quarter, SUM(TotalAmount) as total
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3) AND YEAR(BookingDate) = ?
      GROUP BY QUARTER(BookingDate)
      ORDER BY quarter
    `;
        const [rows] = await db.promise().query(sql, [year]);
        const data = [];
        for (let i = 1; i <= 4; i++) {
            const found = rows.find(r => Number(r.quarter) === i);
            data.push({
                quarter: i,
                total: found ? Number(found.total) : 0
            });
        }
        return data;
    }

    static async getRevenueThisMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const sql = `
      SELECT SUM(TotalAmount) as total
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3)
        AND YEAR(BookingDate) = ? AND MONTH(BookingDate) = ?
    `;
        const [rows] = await db.promise().query(sql, [year, month]);
        return rows[0]?.total || 0;
    }

    static async getRevenueThisWeek() {
        const sql = `
      SELECT SUM(TotalAmount) as total
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3)
        AND YEARWEEK(BookingDate, 1) = YEARWEEK(CURDATE(), 1)
    `;
        const [rows] = await db.promise().query(sql);
        return rows[0]?.total || 0;
    }

    static async getRevenueThisQuarter() {
        const now = new Date();
        const year = now.getFullYear();
        const quarter = Math.floor((now.getMonth() + 3) / 3);
        const sql = `
      SELECT SUM(TotalAmount) as total
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3)
        AND YEAR(BookingDate) = ? AND QUARTER(BookingDate) = ?
    `;
        const [rows] = await db.promise().query(sql, [year, quarter]);
        return rows[0]?.total || 0;
    }

    static async getAgeGroups() {
        const sql = `
      SELECT
        CASE
          WHEN TIMESTAMPDIFF(YEAR, m.DateOfBirth, CURDATE()) < 18 THEN '<18'
          WHEN TIMESTAMPDIFF(YEAR, m.DateOfBirth, CURDATE()) BETWEEN 18 AND 24 THEN '18-24'
          WHEN TIMESTAMPDIFF(YEAR, m.DateOfBirth, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
          WHEN TIMESTAMPDIFF(YEAR, m.DateOfBirth, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
          WHEN TIMESTAMPDIFF(YEAR, m.DateOfBirth, CURDATE()) BETWEEN 45 AND 54 THEN '45-54'
          ELSE '55+' END AS ageGroup,
        COUNT(*) as total
      FROM Bookings b
      JOIN Users m ON b.MemberId = m.UserId
      WHERE b.IsDeleted = 0 AND b.Status IN (2,3)
      GROUP BY ageGroup
      ORDER BY ageGroup
    `;
        const [rows] = await db.promise().query(sql);
        return rows;
    }

    static async countTicketsByDate({ type = 'day', year, month }) {
        let groupBy, dateCondition = '', params = [];
        
        if (type === 'day') {
            groupBy = 'DATE(b.BookingDate)';
            dateCondition = 'YEAR(b.BookingDate) = ? AND MONTH(b.BookingDate) = ?';
            params = [year, month];
        } else if (type === 'month') {
            groupBy = 'YEAR(b.BookingDate), MONTH(b.BookingDate)';
            dateCondition = 'YEAR(b.BookingDate) = ?';
            params = [year];
        } else if (type === 'year') {
            groupBy = 'YEAR(b.BookingDate)';
            dateCondition = '1=1';
            params = [];
        } else {
            throw new Error('Invalid type');
        }

        const sql = `
            SELECT ${groupBy} as period, COUNT(t.TicketId) as total
            FROM Tickets t
            JOIN Bookings b ON t.BookingId = b.BookingId
            WHERE t.IsDeleted = 0 AND b.Status IN (2,3) AND ${dateCondition}
            GROUP BY ${groupBy}
            ORDER BY period ASC
        `;
        const [rows] = await db.promise().query(sql, params);

        // Chỉ normalize khi thống kê theo ngày
        if (type === 'day') {
            const { normalizeDate } = require("../middlewares/showtime.validator");
            return rows.map(row => ({
                ...row,
                period: normalizeDate(row.period)
            }));
        }
        return rows;
    }
}

module.exports = Analytics;