import React from "react";
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
  const salesOverviewData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 2500 },
    { month: "Mar", revenue: 9000 },
    { month: "Apr", revenue: 2000 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];

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
    <div className="flex items-center justify-between">
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm ">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Tickets Sold</p>

              <div className="p-2 bg-am ber-50 rounded-full">
                <FaTicket size={20} color="gold" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Revenue</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <RiMoneyDollarCircleFill size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Active Movies</p>

              <div className="p-2 bg-amber-50 rounded-full">
                <MdMovieFilter size={20} color="gold" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Upcoming Shows</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <IoCalendar size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="w-full space-y-4">
            <div className="bg-white w-full h-[300px] rounded-[10px] p-3 font-bold shadow-sm">
              <p className="mb-2">Sales Overview</p>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={salesOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
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

            <div className="w-full  flex items-center justify-between h-[300px]">
              <div className="bg-white w-[48%] h-full rounded-[10px] p-3 font-bold shadow-sm">
                <p className="mb-2">Daily Ticket Sales</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
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
              <div className="bg-white h-[300px] w-[48%] rounded-[10px] p-3 font-bold shadow-sm">
                <p className="mb-2">Genre Distribution</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => name}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center fixed right-[-40px] top-[25%] justify-center w-[30%]">
        <div className="bg-white p-5 px-5 rounded-[20px] space-y-4 shadow-sm">
          <p className="font-bold">Top 5 Movies by Ticket Sales</p>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[14px]">Poster title</p>
              <p className="text-slate-500 text-[14px]">Tickets</p>
            </div>
            {MovieFillter.map((poster, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-[14px] font-bold"
              >
                <div className="flex items-center w-[75%]">
                  <img
                    src={poster.image}
                    alt="avatar"
                    loading="lazy"
                    className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                  />
                  <p className="truncate">{poster.title}</p>
                </div>
                <p>{poster.tickets.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
