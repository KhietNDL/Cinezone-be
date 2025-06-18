import React, { useState } from "react";
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  Film,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";

const TicketBookingManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const statsData = [
    { title: "Total Bookings", value: 5, icon: Users, color: "text-blue-600" },
    {
      title: "Successful Bookings",
      value: 4,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Bookings",
      value: 1,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Unique Movies Booked",
      value: 2,
      icon: Film,
      color: "text-red-600",
    },
  ];

  const bookingData = [
    {
      id: 1,
      bookingId: "SY7FuDAxwX",
      memberId: "4SqI0zc7Mm",
      fullName: "Tran Van Tien",
      identityCard: "123456789",
      phoneNumber: "0775335515",
      movie: "Doctor Strange: Phù Thủy Tối Thượng",
      time: "01/12/2018 - 21:00",
      seat: "2D 2E 2F",
      status: "Successful",
    },
    {
      id: 2,
      bookingId: "GsAGMDbdGS",
      memberId: "4SqI0zc7Mm",
      fullName: "Tran Van Tien",
      identityCard: "123456789",
      phoneNumber: "0775335515",
      movie: "Doctor Strange: Phù Thủy Tối Thượng",
      time: "01/12/2018 - 21:00",
      seat: "1D 1E 1F",
      status: "Pending",
    },
    {
      id: 3,
      bookingId: "rvSv4MkigB",
      memberId: "4SqI0zc7Mm",
      fullName: "Tran Van Tien",
      identityCard: "123456789",
      phoneNumber: "0775335515",
      movie: "Doctor Strange: Phù Thủy Tối Thượng",
      time: "01/12/2018 - 21:00",
      seat: "8B",
      status: "Successful",
    },
    {
      id: 4,
      bookingId: "lRvNABP4CI",
      memberId: "4SqI0zc7Mm",
      fullName: "Tran Van Tien",
      identityCard: "123456789",
      phoneNumber: "0775335515",
      movie: "Doctor Strange: Phù Thủy Tối Thượng",
      time: "01/12/2018 - 21:00",
      seat: "4A 4B 4C",
      status: "Successful",
    },
    {
      id: 5,
      bookingId: "OdUWVGCkJr",
      memberId: "4SqI0zc7Mm",
      fullName: "Tran Van Tien",
      identityCard: "123456789",
      phoneNumber: "0775335515",
      movie: "Nhà Tù Shawshank - The Shawshan...",
      time: "01/12/2018 - 21:00",
      seat: "1A 1C 1B",
      status: "Successful",
    },
  ];
  const filteredTicketBooking = bookingData.filter(
    (booking) =>
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const itemsPerPage = 5;
  // Calculate pagination
  const totalItems = filteredTicketBooking.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooking = filteredTicketBooking.slice(startIndex, endIndex);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const getStatusBadge = (status) => {
    const statusStyles = {
      Successful: "bg-green-100 text-green-800 border border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-[20px] flex items-center h-full justify-between">
      <div className="w-[90%] space-y-4">
        {/* Stats Cards */}
        <div className="flex items-center justify-between w-full">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-md p-3 w-[23%] shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-slate-500">{stat.title}</p>
                  <div className={`p-2  rounded-full ${stat.color}`}>
                    <IconComponent size={24} />
                  </div>
                </div>{" "}
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name or email"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All</option>
                <option>Successful</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 text-center">#</th>
                  <th className="py-2 text-center">Booking ID</th>
                  {/* <th className="py-2 text-center">Member ID</th> */}
                  <th className="py-2 text-center">Full name</th>
                  {/* <th className="py-2 text-center">Identity card</th> */}
                  <th className="py-2 text-center">Phone number</th>
                  <th className="py-2 text-center">Movie</th>
                  <th className="py-2 text-center">Time</th>
                  <th className="py-2 text-center">Seat</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBooking.map((booking) => (
                  <tr
                    key={booking.id}
                    role="button"
                    className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center">{booking.id}</td>
                    <td className="py-2 text-center">{booking.bookingId}</td>
                    {/* <td className="py-2 text-center">{booking.memberId}</td> */}
                    <td className="py-2 text-center">{booking.fullName}</td>
                    {/* <td className="py-2 text-center">{booking.identityCard}</td> */}
                    <td className="py-2 text-center">{booking.phoneNumber}</td>
                    <td className="py-2 text-center" title={booking.movie}>
                      {booking.movie}
                    </td>
                    <td className="py-2 text-center">{booking.time}</td>
                    <td className="py-2 text-center">{booking.seat}</td>
                    <td className="py-2 text-center">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} promotions
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <div
                role="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Previous
              </div>
              {pageNumbers.map((page) => (
                <div
                  role="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </div>
              ))}
              <div
                role="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Next
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingManagement;
