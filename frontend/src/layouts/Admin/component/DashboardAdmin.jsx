import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaTicket } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdMovieFilter } from "react-icons/md";
import {
  getRevenueByMonth,
  getRevenueByQuarter,
  getRevenueThisMonth,
  getRevenueThisWeek,
  getRevenueThisQuarter,
  getRevenueToday,
  getCurrentMovies,
} from "../../../services/API";

const DashboardAdmin = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [dailyTicketData, setDailyTicketData] = useState([]);

  const [salesOverviewData, setSalesOverviewData] = useState([
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ]);

  const [timeFilter, setTimeFilter] = useState("This Month");
  const timeOptions = [
    "This Month",
    "Month",
    "This Week",
    "Quarter",
    "This Quarter",
  ];

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        // Lấy tất cả phim hiện tại
        const response = await getCurrentMovies({
          page: 1,
          limit: 50, // Lấy nhiều phim để có thể filter ra top 5
          sortBy: "CreatedAt",
          sortOrder: "desc",
        });

        if (response.data) {
          // Filter và sort phim theo rating, chỉ lấy phim có rating
          const moviesWithRating = response.data
            .filter((movie) => movie.AverageRating && movie.AverageRating > 0)
            .sort((a, b) => b.AverageRating - a.AverageRating)
            .slice(0, 5); // Lấy top 5

          // Transform data để match với format component
          const transformedMovies = moviesWithRating.map((movie) => ({
            title: movie.NameOfEnglish,
            rating: parseFloat(movie.AverageRating) || 0,
            image: movie.PosterImage,
            movieId: movie.MovieId,
            totalRatings: movie.TotalRatings || 0,
          }));

          setTopMovies(transformedMovies);
        }
      } catch (error) {
        console.error("Error fetching current movies:", error);
        setTopMovies([]);
      }
    };

    fetchTopMovies();
  }, []);

  useEffect(() => {
    const fetchDailyTicketData = async () => {
      try {
        const res = await getRevenueThisWeek();
        if (res && res.data) {
          // Function to format dates to dd/mm format, only use actual dates
          const formatToDateOnly = (dateStr) => {
            // Only process if we have a valid date string
            if (dateStr && dateStr.includes("-")) {
              const date = new Date(dateStr);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }
            return null; // Return null for non-date entries
          };

          // Transform weekly data to daily ticket format
          const dailyData = res.data
            .map((day) => ({
              date: formatToDateOnly(day.date),
              tickets: day.bookingCount || 0,
              revenue: Number(day.total) || 0,
              originalDate: day.date,
            }))
            .filter((item) => item.date !== null); // Only keep items with valid dates

          setDailyTicketData(dailyData);
        } else {
          setDailyTicketData([]);
        }
      } catch (error) {
        console.error("Error fetching daily ticket data:", error);
        setDailyTicketData([]);
      }
    };

    fetchDailyTicketData();
  }, []);

  useEffect(() => {
    const fetchRevenueByMonth = async () => {
      try {
        const year = new Date().getFullYear();
        const res = await getRevenueByMonth(year);
        if (res && res.data) {
          const chartData = [
            { month: "Jan", revenue: 0 },
            { month: "Feb", revenue: 0 },
            { month: "Mar", revenue: 0 },
            { month: "Apr", revenue: 0 },
            { month: "May", revenue: 0 },
            { month: "Jun", revenue: 0 },
            { month: "Jul", revenue: 0 },
            { month: "Aug", revenue: 0 },
            { month: "Sep", revenue: 0 },
            { month: "Oct", revenue: 0 },
            { month: "Nov", revenue: 0 },
            { month: "Dec", revenue: 0 },
          ];
          const monthMap = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
          };
          res.data.forEach((item) => {
            const shortMonth = monthMap[item.label];
            const idx = chartData.findIndex((m) => m.month === shortMonth);
            if (idx !== -1) chartData[idx].revenue = item.total;
          });
          setSalesOverviewData(chartData);
        }
      } catch (error) {
        console.error("Error fetching revenue by month:", error);
      }
    };
    const fetchRevenueByQuarter = async () => {
      try {
        const year = new Date().getFullYear();
        const res = await getRevenueByQuarter(year);
        if (res && res.data) {
          // Map về 4 quý
          const chartData = [
            { month: "Q1", revenue: 0 },
            { month: "Q2", revenue: 0 },
            { month: "Q3", revenue: 0 },
            { month: "Q4", revenue: 0 },
          ];
          res.data.forEach((item, idx) => {
            if (chartData[idx]) chartData[idx].revenue = item.total;
          });
          setSalesOverviewData(chartData);
        }
      } catch (error) {
        console.error("Error fetching revenue by quarter:", error);
      }
    };
    const fetchRevenueThisMonth = async () => {
      try {
        const res = await getRevenueThisMonth();
        if (res && res.data) {
          const chartData = res.data.map((week) => ({
            month: week.label,
            revenue: Number(week.total) || 0,
            week: week.week,
            bookingCount: week.bookingCount || 0,
            dateRange: week.dateRange,
          }));
          setSalesOverviewData(chartData);
        } else if (res && res.totalRevenue) {
          // Fallback to total revenue if data array is not available
          setSalesOverviewData([
            { month: "This Month", revenue: Number(res.totalRevenue) },
          ]);
        } else {
          setSalesOverviewData([{ month: "This Month", revenue: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching revenue this month:", error);
      }
    };
    const fetchRevenueThisWeek = async () => {
      try {
        const res = await getRevenueThisWeek();
        if (res && res.data) {
          // Map the daily data to chart format
          const chartData = res.data.map((day) => ({
            month: day.dayNameVN || day.dayName, // Use Vietnamese day name, fallback to English
            revenue: Number(day.total) || 0,
            date: day.date,
            bookingCount: day.bookingCount || 0,
          }));
          setSalesOverviewData(chartData);
        } else if (res && res.totalRevenue) {
          // Fallback to total revenue if data array is not available
          setSalesOverviewData([
            { month: "This Week", revenue: Number(res.totalRevenue) },
          ]);
        } else {
          setSalesOverviewData([{ month: "This Week", revenue: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching revenue this week:", error);
      }
    };
    const fetchRevenueThisQuarter = async () => {
      try {
        const res = await getRevenueThisQuarter();
        if (res && res.total && res.total.quarters) {
          // Map the quarterly data to chart format
          const chartData = res.total.quarters.map((quarter) => ({
            month: quarter.label, // "Q1", "Q2", "Q3", "Q4"
            revenue: Number(quarter.total) || 0,
            quarter: quarter.quarter,
            monthRange: quarter.monthRange,
            bookingCount: quarter.bookingCount || 0,
            dateRange: quarter.dateRange,
            isCurrent: quarter.isCurrent,
          }));
          setSalesOverviewData(chartData);
        } else if (res && res.total) {
          // Fallback: if it's just a number or has a different structure
          const totalRevenue =
            typeof res.total === "number"
              ? res.total
              : res.total.quarters?.find((q) => q.isCurrent)?.total || 0;
          setSalesOverviewData([
            { month: "This Quarter", revenue: Number(totalRevenue) },
          ]);
        } else {
          setSalesOverviewData([{ month: "This Quarter", revenue: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching revenue this quarter:", error);
      }
    };

    const fetchRevenueToday = async () => {
      try {
        const res = await getRevenueToday();
        if (res && res.total) {
          setSalesOverviewData([
            { month: "Today", revenue: Number(res.total) },
          ]);
        } else {
          setSalesOverviewData([{ month: "Today", revenue: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching revenue today:", error);
      }
    };

    if (timeFilter === "Today") {
      fetchRevenueToday();
    } else if (timeFilter === "Month") {
      fetchRevenueByMonth();
    } else if (timeFilter === "Quarter") {
      fetchRevenueByQuarter();
    } else if (timeFilter === "This Month") {
      fetchRevenueThisMonth();
    } else if (timeFilter === "This Week") {
      fetchRevenueThisWeek();
    } else if (timeFilter === "This Quarter") {
      fetchRevenueThisQuarter();
    }
    // Có thể bổ sung API cho các filter khác ở đây
  }, [timeFilter]);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const pieChartData = [
    { name: "Action", value: 400 },
    { name: "Comedy", value: 300 },
    { name: "Drama", value: 300 },
  ];

  const COLORS = ["#0088FE", "#FFBB28", "#8884d8"];

  return (
    <div className="flex flex-col items-center lg:items-start h-auto min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
          <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm sm:text-base">
                Total Tickets Sold
              </p>
              <div className="p-1 sm:p-2 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaTicket size={18} sm={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="font-bold text-base sm:text-[19px]">25,340</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm sm:text-base">Revenue</p>
              <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
                <RiMoneyDollarCircleFill
                  size={18}
                  sm={20}
                  className="text-red-500"
                />
              </div>
            </div>
            <p className="font-bold text-base sm:text-[19px]">$25,340</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm sm:text-base">
                Active Movies
              </p>
              <div className="p-1 sm:p-2 bg-amber-100 rounded-lg flex items-center justify-center">
                <MdMovieFilter size={18} sm={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="font-bold text-base sm:text-[19px]">25,340</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm sm:text-base">
                Upcoming Shows
              </p>
              <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
                <IoCalendar size={18} sm={20} className="text-red-500" />
              </div>
            </div>
            <p className="font-bold text-base sm:text-[19px]">25,340</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-4 sm:gap-6">
          <div className="w-full xl:w-[70%] space-y-4 sm:space-y-6">
            <div className="bg-white w-full h-[250px] sm:h-[300px] rounded-lg p-3 sm:p-4 font-bold shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm sm:text-base">Sales Overview</p>
                <select
                  value={timeFilter}
                  onChange={handleTimeFilterChange}
                  className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none"
                >
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={salesOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-6">
              <div className="bg-white w-full sm:w-[48%] h-[250px] sm:h-[300px] rounded-lg p-3 sm:p-4 font-bold shadow-sm">
                <p className="mb-2 text-sm sm:text-base">Daily Ticket Sales</p>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={dailyTicketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} sm={14} />
                    <YAxis fontSize={12} sm={14} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white w-full sm:w-[48%] h-[250px] sm:h-[300px] rounded-lg p-3 sm:p-4 font-bold shadow-sm">
                <p className="mb-2 text-sm sm:text-base">Genre Distribution</p>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => name}
                      outerRadius={60}
                      sm={80}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      wrapperStyle={{ fontSize: "12px" }}
                      sm={{ fontSize: "14px" }}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top 5 Movies */}
          <div className="w-full xl:w-[30%] lg:hidden xl:block bg-white p-4 sm:p-5 rounded-lg shadow-sm">
            <p className="font-bold text-sm sm:text-base mb-3 sm:mb-4">
              Top 5 Movies by Average Rating
            </p>
            <div className="w-full space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-slate-500 text-xs sm:text-sm">
                <p>Movie Title</p>
                <p>Rating</p>
              </div>
              {topMovies.map((movie, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold"
                >
                  <div className="flex items-center w-[70%] sm:w-[75%]">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      loading="lazy"
                      className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded-md mr-2 sm:mr-3"
                    />
                    <p className="truncate" title={movie.title}>
                      {movie.title}
                    </p>
                  </div>
                  <p>{movie.rating ? movie.rating.toFixed(1) : "0.0"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
