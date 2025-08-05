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
import { MdMovieFilter, MdDashboard } from "react-icons/md";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import {
  getRevenueByMonth,
  getRevenueByQuarter,
  getRevenueThisMonth,
  getRevenueThisWeek,
  getRevenueThisQuarter,
  getRevenueToday,
  getCurrentMovies,
} from "../../../services/API";
import { getMovieGenreStats } from "../../../services/APIForAdmin/API";

const DashboardAdmin = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [dailyTicketData, setDailyTicketData] = useState([]);
  const [genreData, setGenreData] = useState([]);

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
            { month: "Quarter 1", revenue: 0 },
            { month: "Quarter 2", revenue: 0 },
            { month: "Quarter 3", revenue: 0 },
            { month: "Quarter 4", revenue: 0 },
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
            month: day.dayName, // Use Vietnamese day name, fallback to English
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

  // Fetch movie genre statistics
  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const response = await getMovieGenreStats();
        if (response && response.data) {
          // Transform API data to chart format
          const chartData = response.data.map((item) => ({
            name: item.genre,
            value: item.count,
            percentage: item.percentage,
          }));
          setGenreData(chartData);
        }
      } catch (error) {
        console.error("Error fetching genre data:", error);
        // Set fallback data if API fails
        setGenreData([
          { name: "Action", value: 0, percentage: 0 },
          { name: "Comedy", value: 0, percentage: 0 },
          { name: "Drama", value: 0, percentage: 0 },
        ]);
      }
    };

    fetchGenreData();
  }, []);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const COLORS = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <MdDashboard className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Cinema Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start w-full max-w-full ">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid select-none grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 w-full">
            <div className="bg-white rounded-xl p-4 sm:p-6 flex-1 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50/50 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm sm:text-base font-medium mb-2">
                    Total Tickets Sold
                  </p>
                  <p className="font-bold text-xl sm:text-2xl text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    25,340
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <FaTicket size={20} className="text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 flex-1 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm sm:text-base font-medium mb-2">
                    Revenue
                  </p>
                  <p className="font-bold text-xl sm:text-2xl text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                    $25,340
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <RiMoneyDollarCircleFill
                    size={20}
                    className="text-emerald-600"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 flex-1 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm sm:text-base font-medium mb-2">
                    Active Movies
                  </p>
                  <p className="font-bold text-xl sm:text-2xl text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    25,340
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <MdMovieFilter size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 flex-1 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm sm:text-base font-medium mb-2">
                    Upcoming Shows
                  </p>
                  <p className="font-bold text-xl sm:text-2xl text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                    25,340
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <IoCalendar size={20} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-4 sm:gap-6">
            <div className="w-full select-none xl:w-[70%] space-y-4 sm:space-y-6">
              <div className="bg-white w-full h-[250px] sm:h-[320px] rounded-xl p-4 sm:p-6 font-bold shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                      Sales Overview
                    </p>
                    <p className="text-sm text-gray-500">
                      Track your revenue performance
                    </p>
                  </div>
                  <CustomSelect
                    value={timeFilter}
                    onChange={handleTimeFilterChange}
                    options={timeOptions}
                    placeholder="Select time period"
                    className="min-w-[140px]"
                    dropdownClassName="border-2 border-purple-100 shadow-xl"
                    optionClassName="hover:shadow-sm"
                  />
                </div>
                <ResponsiveContainer width="100%" height="75%">
                  <AreaChart data={salesOverviewData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                    <YAxis fontSize={12} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      fill="url(#colorGradient)"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-6">
                <div className="bg-white w-full sm:w-[48%] h-[250px] sm:h-[320px] rounded-xl p-4 sm:p-6 font-bold shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                  <div className="mb-6">
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                      Daily Ticket Sales
                    </p>
                    <p className="text-sm text-gray-500">
                      Weekly performance overview
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height="75%">
                    <LineChart data={dailyTicketData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="tickets"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#6366F1", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white w-full sm:w-[48%] h-[250px] sm:h-[320px] rounded-xl p-4 sm:p-6 font-bold shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30">
                  <div className="mb-6">
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                      Genre Distribution
                    </p>
                    <p className="text-sm text-gray-500">
                      Popular movie categories
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height="75%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) =>
                          `${name} (${percentage}%)`
                        }
                        outerRadius={70}
                        dataKey="value"
                      >
                        {genreData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} movies`, name]}
                        labelFormatter={(label) => `Genre: ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top 5 Movies */}
            <div className="w-full xl:w-[30%] lg:hidden xl:block bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <p className="font-bold text-lg sm:text-xl text-gray-800 mb-2">
                  Top 5 Movies by Rating
                </p>
                <p className="text-sm text-gray-500">
                  Highest rated movies this month
                </p>
              </div>
              <div className="w-full space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between text-slate-500 text-sm font-medium pb-2 border-b border-gray-100">
                  <p>Movie Title</p>
                  <p>Rating</p>
                </div>
                {topMovies.map((movie, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm font-semibold p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center w-[75%]">
                      <div className="relative mr-3">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          loading="lazy"
                          className="w-12 sm:w-14 h-12 sm:h-14 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate font-semibold text-gray-800"
                          title={movie.title}
                        >
                          {movie.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {movie.totalRatings} reviews
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-gray-800">
                          {movie.rating ? movie.rating.toFixed(1) : "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
