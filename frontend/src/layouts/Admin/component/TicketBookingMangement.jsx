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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Ticket Booking Management
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-gray-50 ${stat.color}`}
                    >
                      <IconComponent size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by Booking ID, account ID, phone or identity card number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All</option>
                  <option>Successful</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identity card
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookingData.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.memberId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.identityCard}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.phoneNumber}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                      title={booking.movie}
                    >
                      {booking.movie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.seat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center">
              <nav className="flex items-center space-x-2">
                <div
                  role="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  Previous
                </div>

                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg border ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <div
                  role="button"
                  onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                  className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 3}
                >
                  Next
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingManagement;
