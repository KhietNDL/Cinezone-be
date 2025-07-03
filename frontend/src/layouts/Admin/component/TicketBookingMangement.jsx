import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Film, Eye } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { getAllBookings, getBookingById } from "../../../services/API";

const TicketBookingManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  // Lọc và phân trang

  const itemsPerPage = 8;
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooking = bookings.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
  // Lấy chi tiết booking khi mở modal
  const openModal = async (booking) => {
    setIsModalOpen(true);
    try {
      const detail = await getBookingById(booking.BookingId);
      setSelectedBooking({
        ...booking,
        ...detail,
      });
    } catch (error) {
      console.log(error);

      setSelectedBooking(booking); // fallback nếu lỗi
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const BookingModal = ({ booking, isOpen, onClose }) => {
    if (!booking) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-blackblack/40 transition-opacity duration-300 z-50 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isOpen ? "" : "pointer-events-none"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Booking Details</h3>
                      <p className="text-indigo-100 text-sm">
                        Complete booking information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white font-semibold">
                    Booking ID:{" "}
                    <span className="text-indigo-100">{booking.bookingId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Member ID:
                      </span>
                      <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {booking.memberId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Full Name:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.buyerName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        ID Card:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.identityCard}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="font-semibold text-gray-800">
                        {booking.buyerPhone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <Film className="w-5 h-5 text-purple-600" />
                    </div>
                    Movie Information
                  </h4>
                  <div className="space-y-3">
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium block mb-1">
                        Movie:
                      </span>
                      <span className="font-semibold text-gray-800 text-lg">
                        {booking.movieNameEnglish}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Show Time:
                      </span>
                      <span className="font-semibold text-gray-800 bg-orange-100 px-3 py-1 rounded-full text-sm">
                        {booking.showTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Theater:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.cinema}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Duration:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Seats:</span>
                      <span className="font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                        {booking.seats}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promotion & Concessions */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    Promotions & Concessions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Promotion:
                      </span>
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          booking.PromotionId
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.PromotionId || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Concessions:
                      </span>
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          booking.hasConcessions
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {booking.hasConcessions ? "Yes" : "No"}
                      </span>
                    </div>
                    {booking.hasConcessions &&
                      booking.concessionItems.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-600 font-medium block mb-2">
                            Items:
                          </span>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {booking.concessionItems.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-gray-700 bg-white rounded-md p-2 shadow-sm"
                              >
                                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                                <span className="font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Points & Payment */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    Points & Payment
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Points Used:
                      </span>
                      <span className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm">
                        {booking.pointsUsed} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Points Earned:
                      </span>
                      <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                        +{booking.pointsEarned} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Ticket Price:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatPrice(booking.ticketPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg px-4 mt-4">
                      <span className="text-gray-700 font-bold text-lg">
                        Total Amount:
                      </span>
                      <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {formatPrice(booking.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-gray-700 font-bold text-lg">
                      Booking Status:
                    </span>
                  </div>
                  <div className="transform scale-110">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex items-center h-full justify-between">
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
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <IconComponent size={24} />
                  </div>
                </div>
                <p className="font-bold text-[19px]">{stat.value}</p>
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
                  placeholder="Search by name or movie"
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
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm relative">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 text-center">#</th>
                  <th className="py-2 text-center">Booking ID</th>
                  <th className="py-2 text-center">Full name</th>
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
                    onClick={() => openModal(booking)}
                    className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center">{booking.id}</td>
                    <td className="py-2 text-center">{booking.bookingId}</td>
                    <td className="py-2 text-center">{booking.fullName}</td>
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
                      <button
                        onClick={() => openModal(booking)}
                        className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                      >
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
              {totalItems} bookings
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

      {/* Modal */}
      {isModalOpen && (
        <BookingModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TicketBookingManagement;
