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
      SELECT 
        WEEK(BookingDate, 1) - WEEK(DATE_SUB(BookingDate, INTERVAL DAY(BookingDate)-1 DAY), 1) + 1 as weekInMonth,
        SUM(TotalAmount) as total,
        COUNT(*) as bookingCount,
        DATE_FORMAT(MIN(DATE(BookingDate)), '%Y-%m-%d') as startDate,
        DATE_FORMAT(MAX(DATE(BookingDate)), '%Y-%m-%d') as endDate
      FROM Bookings
      WHERE IsDeleted = 0 AND Status IN (2,3)
        AND YEAR(BookingDate) = ? AND MONTH(BookingDate) = ?
      GROUP BY WEEK(BookingDate, 1) - WEEK(DATE_SUB(BookingDate, INTERVAL DAY(BookingDate)-1 DAY), 1) + 1
      ORDER BY weekInMonth
    `;

    const [rows] = await db.promise().query(sql, [year, month]);

    // Đảm bảo có đủ 4-5 tuần
    const weeks = [];
    for (let week = 1; week <= 5; week++) {
      const found = rows.find(row => Number(row.weekInMonth) === week);
      if (found || week <= 4) {
        weeks.push({
          week: week,
          label: `Week ${week}`,
          total: found ? Number(found.total) : 0,
          bookingCount: found ? Number(found.bookingCount) : 0,
          dateRange: found ? `${found.startDate} - ${found.endDate}` : null
        });
      }
    }

    return weeks;
  }

  static async getRevenueThisWeek() {
    const sql = `
        SELECT 
            WEEKDAY(BookingDate) + 1 as dayOfWeek,
            DAYNAME(BookingDate) as dayName,
            DATE_FORMAT(MAX(DATE(BookingDate)), '%Y-%m-%d') as latestDate,
            SUM(TotalAmount) as total,
            COUNT(*) as bookingCount
        FROM Bookings
        WHERE IsDeleted = 0 AND Status IN (2,3)
            AND YEARWEEK(BookingDate, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY WEEKDAY(BookingDate) + 1, DAYNAME(BookingDate)
        ORDER BY WEEKDAY(BookingDate) + 1
    `;

    const [rows] = await db.promise().query(sql);

    const daysOfWeek = [
      { dayOfWeek: 1, dayName: 'Monday', dayNameVN: 'Thứ Hai' },
      { dayOfWeek: 2, dayName: 'Tuesday', dayNameVN: 'Thứ Ba' },
      { dayOfWeek: 3, dayName: 'Wednesday', dayNameVN: 'Thứ Tư' },
      { dayOfWeek: 4, dayName: 'Thursday', dayNameVN: 'Thứ Năm' },
      { dayOfWeek: 5, dayName: 'Friday', dayNameVN: 'Thứ Sáu' },
      { dayOfWeek: 6, dayName: 'Saturday', dayNameVN: 'Thứ Bảy' },
      { dayOfWeek: 7, dayName: 'Sunday', dayNameVN: 'Chủ Nhật' }
    ];

    const data = daysOfWeek.map(day => {
      const found = rows.find(row => Number(row.dayOfWeek) === day.dayOfWeek);
      return {
        dayOfWeek: day.dayOfWeek,
        dayName: day.dayName,
        dayNameVN: day.dayNameVN,
        date: found ? found.latestDate : null, // Đã được format trong SQL
        total: found ? Number(found.total) : 0,
        bookingCount: found ? Number(found.bookingCount) : 0
      };
    });

    return data;
  }

  static async getRevenueThisQuarter(year = null) {
    const currentYear = year || new Date().getFullYear();
    const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);

    const sql = `
    SELECT 
      QUARTER(BookingDate) as quarter,
      SUM(TotalAmount) as total,
      MIN(DATE_FORMAT(BookingDate, '%Y-%m-%d')) as startDate,
      MAX(DATE_FORMAT(BookingDate, '%Y-%m-%d')) as endDate,
      COUNT(*) as bookingCount
    FROM Bookings
    WHERE IsDeleted = 0 AND Status IN (2,3)
      AND YEAR(BookingDate) = ?
    GROUP BY QUARTER(BookingDate)
    ORDER BY quarter
  `;

    const [rows] = await db.promise().query(sql, [currentYear]);

    // Tạo dữ liệu cho tất cả 4 quý
    const quarters = [
      { quarter: 1, label: 'Q1', monthRange: '1-3', total: 0, bookingCount: 0, dateRange: null, isCurrent: currentQuarter === 1 },
      { quarter: 2, label: 'Q2', monthRange: '4-6', total: 0, bookingCount: 0, dateRange: null, isCurrent: currentQuarter === 2 },
      { quarter: 3, label: 'Q3', monthRange: '7-9', total: 0, bookingCount: 0, dateRange: null, isCurrent: currentQuarter === 3 },
      { quarter: 4, label: 'Q4', monthRange: '10-12', total: 0, bookingCount: 0, dateRange: null, isCurrent: currentQuarter === 4 }
    ];

    // Cập nhật dữ liệu từ kết quả truy vấn
    for (const row of rows) {
      const quarterIndex = row.quarter - 1;
      if (quarterIndex >= 0 && quarterIndex < 4) {
        quarters[quarterIndex].total = Number(row.total);
        quarters[quarterIndex].bookingCount = Number(row.bookingCount);
        quarters[quarterIndex].dateRange = `${row.startDate} - ${row.endDate}`;
      }
    }

    return {
      currentYear,
      currentQuarter,
      quarters
    };
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

  static async getRevenueThisDay() {
    const today = new Date().toISOString().split('T')[0];

    const sql = `
    SELECT 
      DATE_FORMAT(BookingDate, '%Y-%m-%d') as bookingDate,
      SUM(TotalAmount) as total,
      COUNT(*) as bookingCount,
      MIN(DATE_FORMAT(BookingDate, '%H:%i:%s')) as firstBookingTime,
      MAX(DATE_FORMAT(BookingDate, '%H:%i:%s')) as lastBookingTime
    FROM Bookings
    WHERE IsDeleted = 0 AND Status IN (2,3)
      AND DATE(BookingDate) = CURDATE()
    GROUP BY DATE_FORMAT(BookingDate, '%Y-%m-%d')
  `;

    const [rows] = await db.promise().query(sql);

    // Nếu không có booking nào trong ngày, trả về dữ liệu mặc định
    if (rows.length === 0) {
      return {
        date: today,
        dayOfWeek: new Date().getDay() === 0 ? 7 : new Date().getDay(), // Chuyển chủ nhật từ 0 thành 7
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
        dayNameVN: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][new Date().getDay()],
        total: 0,
        bookingCount: 0,
        timeRange: null
      };
    }

    // Lấy ngày trong tuần
    const date = new Date();
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Chuyển chủ nhật từ 0 thành 7
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesVN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    // Format kết quả
    return {
      date: rows[0].bookingDate,
      dayOfWeek: dayOfWeek,
      dayName: dayNames[date.getDay()],
      dayNameVN: dayNamesVN[date.getDay()],
      total: Number(rows[0].total),
      bookingCount: Number(rows[0].bookingCount),
      timeRange: rows[0].firstBookingTime && rows[0].lastBookingTime ?
        `${rows[0].firstBookingTime} - ${rows[0].lastBookingTime}` : null
    };
  }
}

module.exports = Analytics;