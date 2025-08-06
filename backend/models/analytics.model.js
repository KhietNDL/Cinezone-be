const db = require("../config/database");
const { formatDateTime, formatDateTimeString } = require("../utils/date");

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

    // Xác định các tháng trong quý hiện tại
    const startMonth = (currentQuarter - 1) * 3 + 1; // Tháng đầu tiên của quý
    const endMonth = currentQuarter * 3; // Tháng cuối cùng của quý

    // Tạo mảng chứa các tháng trong quý
    const monthsInQuarter = [];
    for (let i = startMonth; i <= endMonth; i++) {
      monthsInQuarter.push({
        month: i,
        monthName: ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'][i - 1],
        monthNameVN: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'][i - 1]
      });
    }

    // Truy vấn dữ liệu doanh thu cho từng tháng trong quý hiện tại
    const sql = `
    SELECT 
      MONTH(BookingDate) as month,
      SUM(TotalAmount) as total,
      COUNT(*) as bookingCount
    FROM Bookings
    WHERE IsDeleted = 0 AND Status IN (2,3)
      AND YEAR(BookingDate) = ?
      AND QUARTER(BookingDate) = ?
    GROUP BY MONTH(BookingDate)
    ORDER BY month
  `;

    const [rows] = await db.promise().query(sql, [currentYear, currentQuarter]);

    // Cập nhật thông tin doanh thu cho mỗi tháng
    let totalQuarterRevenue = 0;
    let totalQuarterBookings = 0;

    for (const row of rows) {
      const month = monthsInQuarter.find(m => m.month === Number(row.month));
      if (month) {
        month.total = Number(row.total);
        month.bookingCount = Number(row.bookingCount);
        totalQuarterRevenue += Number(row.total);
        totalQuarterBookings += Number(row.bookingCount);
      }
    }

    // Thêm thông tin về doanh thu vào các tháng chưa có dữ liệu
    for (const month of monthsInQuarter) {
      if (!month.hasOwnProperty('total')) {
        month.total = 0;
        month.bookingCount = 0;
      }
    }

    // Lấy thông tin ngày bắt đầu và kết thúc của quý
    const startDate = `${currentYear}-${startMonth.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(currentYear, endMonth, 0).getDate();
    const endDate = `${currentYear}-${endMonth.toString().padStart(2, '0')}-${lastDay}`;

    return {
      currentYear,
      currentQuarter,
      label: `Q${currentQuarter}`,
      startDate,
      endDate,
      monthRange: `${startMonth}-${endMonth}`,
      months: monthsInQuarter,
      totalRevenue: totalQuarterRevenue,
      totalBookings: totalQuarterBookings
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

  static async getEmployeesAgeGroups() {
    const sql = `
      SELECT
        CASE
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 18 THEN '<18'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 18 AND 24 THEN '18-24'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 45 AND 54 THEN '45-54'
          ELSE '55+' END AS ageGroup,
        COUNT(*) as total
      FROM Users
      WHERE IsDeleted = 0 AND Role = '2'
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

  static async getUsersByMembershipRank() {
    const sql = `
    SELECT 
      CASE 
        WHEN TotalAccumulatedPoints < 1000 THEN 'Bronze'
        WHEN TotalAccumulatedPoints < 3000 THEN 'Silver'
        WHEN TotalAccumulatedPoints < 7000 THEN 'Gold'
        ELSE 'Diamond'
      END AS rankName,
      COUNT(*) as userCount
    FROM Users
    WHERE IsDeleted = 0
    GROUP BY rankName
    ORDER BY 
      CASE rankName
        WHEN 'Bronze' THEN 1
        WHEN 'Silver' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Diamond' THEN 4
      END
  `;

    const [rows] = await db.promise().query(sql);

    const membershipRanks = [
      {
        rank: 'Bronze',
        name: 'Đồng',
        nameEN: 'Bronze',
        minPoints: 0,
        maxPoints: 999,
        count: 0
      },
      {
        rank: 'Silver',
        name: 'Bạc',
        nameEN: 'Silver',
        minPoints: 1000,
        maxPoints: 2999,
        count: 0
      },
      {
        rank: 'Gold',
        name: 'Vàng',
        nameEN: 'Gold',
        minPoints: 3000,
        maxPoints: 6999,
        count: 0
      },
      {
        rank: 'Diamond',
        name: 'Kim cương',
        nameEN: 'Diamond',
        minPoints: 7000,
        maxPoints: null,
        count: 0
      }
    ];

    for (const row of rows) {
      const rankIndex = membershipRanks.findIndex(r => r.rank === row.rankName);
      if (rankIndex >= 0) {
        membershipRanks[rankIndex].count = Number(row.userCount);
      }
    }

    return membershipRanks;
  }

  static async getMovieGenreStats() {
    const sql = `
    SELECT 
      m.Genres
    FROM 
      Movies m
    WHERE 
      m.IsDeleted = 0
  `;

    const [rows] = await db.promise().query(sql);

    // Khởi tạo đối tượng đếm thể loại
    const genreCounts = {};

    // Đếm thể loại từ mỗi phim
    for (const row of rows) {
      try {
        // Xử lý trường hợp Genres là chuỗi JSON hoặc mảng
        let genres;
        if (typeof row.Genres === 'string') {
          // Nếu là chuỗi, chúng ta giả định là danh sách phân tách bằng dấu phẩy
          genres = row.Genres.split(',').map(g => g.trim());
        } else if (Array.isArray(row.Genres)) {
          // Nếu đã là mảng
          genres = row.Genres;
        } else {
          // Trường hợp là null hoặc không định nghĩa
          continue;
        }

        // Đếm mỗi thể loại
        genres.forEach(genre => {
          if (!genreCounts[genre]) {
            genreCounts[genre] = 0;
          }
          genreCounts[genre]++;
        });
      } catch (error) {
        console.error("Lỗi khi xử lý thể loại phim:", error);
        continue;
      }
    }

    // Chuyển đổi thành mảng để sắp xếp
    const genreStats = Object.keys(genreCounts).map(genre => ({
      genre,
      count: genreCounts[genre]
    }));

    // Sắp xếp theo số lượng giảm dần
    genreStats.sort((a, b) => b.count - a.count);

    return genreStats;
  }

  static async getEmployeeTenureStats() {
    const sql = `
    SELECT
      CASE
        WHEN TIMESTAMPDIFF(MONTH, CreatedAt, CURDATE()) < 3 THEN 'Less than 3 months'
        WHEN TIMESTAMPDIFF(MONTH, CreatedAt, CURDATE()) BETWEEN 3 AND 5 THEN '3-6 months'
        WHEN TIMESTAMPDIFF(MONTH, CreatedAt, CURDATE()) BETWEEN 6 AND 11 THEN '6-12 months'
        WHEN TIMESTAMPDIFF(MONTH, CreatedAt, CURDATE()) BETWEEN 12 AND 23 THEN '1-2 years'
        WHEN TIMESTAMPDIFF(MONTH, CreatedAt, CURDATE()) BETWEEN 24 AND 59 THEN '2-5 years'
        ELSE 'Over 5 years'
      END AS tenureGroup,
      COUNT(*) as total
    FROM Users
    WHERE IsDeleted = 0 AND Role = '2'
    GROUP BY tenureGroup
    ORDER BY
      CASE tenureGroup
        WHEN 'Less than 3 months' THEN 1
        WHEN '3-6 months' THEN 2
        WHEN '6-12 months' THEN 3
        WHEN '1-2 years' THEN 4
        WHEN '2-5 years' THEN 5
        WHEN 'Over 5 years' THEN 6
      END
  `;

    const [rows] = await db.promise().query(sql);

    const tenureGroups = [
      { group: 'Less than 3 months', nameEN: 'Less than 3 months', total: 0, order: 1 },
      { group: '3-6 months', nameEN: '3-6 months', total: 0, order: 2 },
      { group: '6-12 months', nameEN: '6-12 months', total: 0, order: 3 },
      { group: '1-2 years', nameEN: '1-2 years', total: 0, order: 4 },
      { group: '2-5 years', nameEN: '2-5 years', total: 0, order: 5 },
      { group: 'Over 5 years', nameEN: 'Over 5 years', total: 0, order: 6 }
    ];

    for (const row of rows) {
      const group = tenureGroups.find(g => g.group === row.tenureGroup);
      if (group) {
        group.total = Number(row.total);
      }
    }

    return tenureGroups;
  }

  static async getTopMoviesByTickets(limit = 10, { day, month, year } = {}) {
    let where = `t.IsDeleted = 0 AND b.Status IN (2,3) AND mv.IsDeleted = 0`;
    const params = [];
    if (year) {
      where += ` AND YEAR(b.BookingDate) = ?`;
      params.push(year);
    }
    if (month) {
      where += ` AND MONTH(b.BookingDate) = ?`;
      params.push(month);
    }
    if (day) {
      where += ` AND DAY(b.BookingDate) = ?`;
      params.push(day);
    }
    const sql = `
      SELECT 
        mv.MovieId,
        mv.NameOfVietnamese,
        mv.NameOfEnglish,
        mv.PosterImage,
        mv.Genres,
        COUNT(t.TicketId) as ticketCount
      FROM Tickets t
      JOIN Bookings b ON t.BookingId = b.BookingId
      JOIN Showtimes s ON b.ShowtimeId = s.ShowtimeId
      JOIN Version v ON s.VersionId = v.VersionId
      JOIN Movies mv ON v.MovieId = mv.MovieId
      WHERE ${where}
      GROUP BY mv.MovieId
      ORDER BY ticketCount DESC
      LIMIT ?
    `;
    params.push(limit);
    const [rows] = await db.promise().query(sql, params);
    return rows.map(row => ({
      movieId: row.MovieId,
      title: row.NameOfVietnamese || row.NameOfEnglish,
      ticketsSold: Number(row.ticketCount)
    }));
  }

  static async getTopGenresByTickets(limit = 5, { day, month, year } = {}) {
    let where = `t.IsDeleted = 0 AND b.Status IN (2,3) AND mv.IsDeleted = 0`;
    const params = [];
    if (year) {
      where += ` AND YEAR(b.BookingDate) = ?`;
      params.push(year);
    }
    if (month) {
      where += ` AND MONTH(b.BookingDate) = ?`;
      params.push(month);
    }
    if (day) {
      where += ` AND DAY(b.BookingDate) = ?`;
      params.push(day);
    }
    const sql = `
      SELECT 
        mv.Genres,
        COUNT(t.TicketId) as ticketCount
      FROM Tickets t
      JOIN Bookings b ON t.BookingId = b.BookingId
      JOIN Showtimes s ON b.ShowtimeId = s.ShowtimeId
      JOIN Version v ON s.VersionId = v.VersionId
      JOIN Movies mv ON v.MovieId = mv.MovieId
      WHERE ${where}
      GROUP BY mv.MovieId
    `;
    const [rows] = await db.promise().query(sql, params);

    // Gom nhóm lại theo từng thể loại
    const genreMap = {};
    for (const row of rows) {
      if (!row.Genres) continue;
      let genres = row.Genres;
      if (typeof genres === 'string') {
        genres = genres.split(',').map(g => g.trim());
      }
      for (const genre of genres) {
        if (!genreMap[genre]) genreMap[genre] = 0;
        genreMap[genre] += Number(row.ticketCount);
      }
    }
    // Chuyển thành mảng và sort
    const genreStats = Object.entries(genreMap)
      .map(([genre, ticketCount]) => ({ genre, ticketCount }))
      .sort((a, b) => b.ticketCount - a.ticketCount)
      .slice(0, limit);

    return genreStats.map(g => ({
      genre: g.genre,
      ticketsSold: g.ticketCount
    }));
  }
}

module.exports = Analytics;