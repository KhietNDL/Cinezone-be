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
import DeadPoolPoster from "../../../assets/DeadPoolPoster.jpg";
import TheEndPoster from "../../../assets/TheEndPoster.jpg";
import DoctorStrangePoster from "../../../assets/DoctorStrangePoster.jpg";
import SpiderManPoster from "../../../assets/SpiderManPoster.jpg";
import imageMovie5 from "../../../assets/imageMovie5.jpg";
import { getRevenueByMonth, getRevenueByQuarter, getRevenueThisMonth, getRevenueThisWeek, getRevenueThisQuarter } from '../../../services/API';

const DashboardAdmin = () => {
  const topMovies = [
    {
      title: "Deadpools & Wolverine",
      tickets: 3210,
      image: DeadPoolPoster,
    },
    {
      title: "The End",
      tickets: 2850,
      image: TheEndPoster,
    },
    {
      title: "Doctor Strange",
      tickets: 1980,
      image: DoctorStrangePoster,
    },
    {
      title: "Spider-Man No Way Home",
      tickets: 4520,
      image: SpiderManPoster,
    },
    {
      title: "Phim hay quá...",
      tickets: 3210,
      image: imageMovie5,
    },
  ];

  const MovieFillter = [...topMovies].sort((a, b) => b.tickets - a.tickets);

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
      } catch (err) {}
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
      } catch (err) {}
    };
    const fetchRevenueThisMonth = async () => {
      try {
        const res = await getRevenueThisMonth();
        if (res && res.total) {
          setSalesOverviewData([{ month: 'This Month', revenue: Number(res.total) }]);
        } else {
          setSalesOverviewData([{ month: 'This Month', revenue: 0 }]);
        }
      } catch (err) {}
    };
    const fetchRevenueThisWeek = async () => {
      try {
        const res = await getRevenueThisWeek();
        if (res && res.total) {
          setSalesOverviewData([{ month: 'This Week', revenue: Number(res.total) }]);
        } else {
          setSalesOverviewData([{ month: 'This Week', revenue: 0 }]);
        }
      } catch (err) {}
    };
    const fetchRevenueThisQuarter = async () => {
      try {
        const res = await getRevenueThisQuarter();
        if (res && res.total) {
          setSalesOverviewData([{ month: 'This Quarter', revenue: Number(res.total) }]);
        } else {
          setSalesOverviewData([{ month: 'This Quarter', revenue: 0 }]);
        }
      } catch (err) {}
    };
    if (timeFilter === "Month") {
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

  const lineChartData = [
    { date: "02/03/2025", tickets: 7 },
    { date: "12/03/2025", tickets: 15 },
    { date: "19/03/2025", tickets: 28 },
    { date: "27/03/2025", tickets: 21 },
    { date: "03/04/2025", tickets: 10 },
  ];

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
                  <LineChart data={lineChartData}>
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
              Top 5 Movies by Ticket Sales
            </p>
            <div className="w-full space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-slate-500 text-xs sm:text-sm">
                <p>Movie Title</p>
                <p>Tickets</p>
              </div>
              {MovieFillter.map((poster, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold"
                >
                  <div className="flex items-center w-[70%] sm:w-[75%]">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      loading="lazy"
                      className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded-md mr-2 sm:mr-3"
                    />
                    <p className="truncate" title={poster.title}>
                      {poster.title}
                    </p>
                  </div>
                  <p>{poster.tickets.toLocaleString()}</p>
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
