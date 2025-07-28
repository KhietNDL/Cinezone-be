import React, { useEffect, useState, useCallback } from "react";
import { Users, CheckCircle, Clock, Film, Eye } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import {
  getAllBookings,
  getBookingById,
  searchBookingsByUser,
} from "../../../services/API";
import Pagination from "../movieComponent/Pagination";

const TicketBookingManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});

  const getBookingStatusText = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Paid";
      case 3:
        return "Completed";
      case 4:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
  };

  const statsData = [
    {
      title: "Total Bookings",
      value: totalItems,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Successful Bookings",
      value: totalPages,
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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "CreatedAt",
        sortOrder: "desc",
      };
      const data = await getAllBookings(params);
      setBookings(data.data);
      if (data.pagination) {
        setTotalItems(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }

      const fetchDetails = async () => {
        const detailsPromises = data.data.map(async (booking) => {
          const bookingId = booking.BookingId;
          try {
            const detail = await getBookingById(bookingId);
            return { [bookingId]: detail };
          } catch (error) {
            console.error(
              `Error fetching detail for booking ${bookingId}:`,
              error
            );
            return { [bookingId]: {} };
          }
        });
        const details = await Promise.all(detailsPromises);
        const updatedDetails = details.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setBookingDetails(updatedDetails);
      };
      await fetchDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);
  // Load initial data khi component mount
  useEffect(() => {
    if (!searchTerm) {
      fetchBookings();
    }
  }, [fetchBookings, searchTerm]);

  const searchBookingData = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        fetchBookings();
        return;
      }
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: "CreatedAt",
          sortOrder: "desc",
        };

        const response = await searchBookingsByUser(searchTerm, params);
        if (response) {
          // Chuẩn hóa dữ liệu booking
          const bookingsData = response.data
            ? response.data.map(normalizeBookingData)
            : [];

          setBookings(bookingsData);

          // Xử lý pagination từ response
          if (response.pagination) {
            setTotalItems(response.pagination.total);
            setTotalPages(response.pagination.totalPages);
          } else {
            const total = bookingsData.length;
            setTotalItems(total);
            setTotalPages(Math.ceil(total / itemsPerPage));
          }

          // Fetch chi tiết cho từng booking - Reset booking details khi search
          const detailsPromises = bookingsData.map(async (booking) => {
            const bookingId = booking.BookingId;
            try {
              const detail = await getBookingById(bookingId);
              return { [bookingId]: detail };
            } catch (error) {
              console.error(
                `Error fetching detail for booking ${bookingId}:`,
                error
              );
              return { [bookingId]: booking }; // Sử dụng dữ liệu booking hiện có nếu không lấy được chi tiết
            }
          });

          const details = await Promise.all(detailsPromises);
          const updatedDetails = details.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          setBookingDetails(updatedDetails);
        }
      } catch (error) {
        console.error("Error searching bookings:", error);
        setBookings([]);
        setTotalItems(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage, fetchBookings]
  );
  const normalizeBookingData = (booking) => {
    return {
      BookingId: booking.BookingId || booking.bookingId,
      status: booking.status,
      BookingDate: booking.BookingDate || booking.bookingDate,
      buyerName: booking.buyerName || booking.BuyerName,
      buyerPhone: booking.buyerPhone || booking.BuyerPhone,
      movieNameEnglish: booking.movieNameEnglish || booking.MovieNameEnglish,
      showTime: booking.showTime || booking.ShowTime,
      seats: booking.seats || booking.Seats,
      room: booking.room || booking.Room,
      duration: booking.duration || booking.Duration,
      totalPrice: booking.totalPrice || booking.TotalPrice,
      totalAmount: booking.totalAmount || booking.TotalAmount,
      pointsUsed: booking.pointsUsed || booking.PointsUsed || 0,
      pointsEarned: booking.pointsEarned || booking.PointsEarned || 0,
      hasConcessions: booking.hasConcessions || booking.HasConcessions || false,
      concessionItems: booking.concessionItems || booking.ConcessionItems || [],
      promotionTitle: booking.promotionTitle || booking.PromotionTitle,
      PromotionId: booking.PromotionId || booking.promotionId,
    };
  };

  // Effect riêng cho searchTerm để reset về trang 1
  useEffect(() => {
    if (searchTerm !== "") {
      setCurrentPage(1); // Reset về trang 1 khi có search term mới
    }
  }, [searchTerm]);

  // Thêm useEffect mới với debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchBookingData(searchTerm);
      } else {
        fetchBookings();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, searchBookingData, fetchBookings]); // Thêm currentPage để search lại khi đổi trang

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Paid: "bg-blue-100 text-blue-800 border border-blue-200",
      Completed: "bg-green-100 text-green-800 border border-green-200",
      Cancelled: "bg-red-100 text-red-800 border border-red-200",
      Unknown: "bg-gray-100 text-gray-800 border border-gray-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.Unknown
        }`}
      >
        {status}
      </span>
    );
  };

  const openModal = async (booking) => {
    setIsModalOpen(true);
    const bookingId = booking.BookingId;
    if (!bookingDetails[bookingId]) {
      try {
        const detail = await getBookingById(bookingId);
        setBookingDetails((prev) => ({ ...prev, [bookingId]: detail }));
        setSelectedBooking({ ...booking, ...detail });
      } catch (error) {
        console.log(error);
        setSelectedBooking(booking);
      }
    } else {
      setSelectedBooking({ ...booking, ...bookingDetails[bookingId] });
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
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-50 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${
            isOpen ? "" : "pointer-events-none"
          }`}
        >
          <div
            data-testid="booking-modal"
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
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
                    aria-label="Close"
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
                    <span className="text-indigo-100">{booking.BookingId}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Full Name:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.buyerName}
                      </span>
                    </div>

                    <span className="font-semibold text-gray-800">
                      {booking.identityCard}
                    </span>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="font-semibold text-gray-800">
                        {booking.buyerPhone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <Film className="w-5 h-5 text-purple-600" />
                    </div>
                    Movie Information
                  </h4>
                  <div className="space-y-3">
                    <div className="py-2 border-b border-gray-100 flex items-center justify-between">
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
                      <span className="text-gray-600 font-medium">Room:</span>
                      <span className="font-semibold text-gray-800">
                        {booking.room}
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
                        {booking.seats && booking.seats.length > 0
                          ? booking.seats.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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
                        {booking.promotionCode || "None"}
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
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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
                        {booking.pointsUsed || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Points Earned:
                      </span>
                      <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                        +{booking.pointEarn || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Ticket Price:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg px-4 mt-4">
                      <span className="text-gray-700 font-bold text-lg">
                        Total Amount:
                      </span>
                      <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {formatPrice(booking.TotalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                    {getStatusBadge(getBookingStatusText(booking.status))}
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
    <div className="h-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 w-full">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-slate-500">
                      {stat.title}
                    </p>
                    <div className={`p-1.5 rounded-full ${stat.color}`}>
                      <IconComponent size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <p className="font-bold text-base sm:text-[19px] mt-1">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="w-full py-3 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <div className="flex items-center p-2 px-3 w-full sm:w-80 rounded-xl bg-white shadow-sm">
                  <div className="shrink-0">
                    <IoSearchOutline size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 focus:outline-none w-full text-sm"
                    placeholder="Search by name or movie"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm">
              <div className="">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
                      <th className="py-2 px-2 sm:px-4 w-[120px] sm:w-[150px] text-center">
                        Full Name
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[120px] sm:w-[140px] text-center hidden md:table-cell">
                        Phone Number
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[120px] sm:w-[150px] text-center">
                        Movie
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[120px] sm:w-[140px] text-center">
                        Time
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] text-center hidden lg:table-cell">
                        Seat
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] text-center">
                        Status
                      </th>
                      <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.BookingId}
                        onClick={() => openModal(booking)}
                        className="border-b border-slate-200 hover:bg-slate-100 text-xs sm:text-sm cursor-pointer"
                      >
                        <td className="py-2 px-2 sm:px-4 w-[120px] sm:w-[150px] text-center">
                          {bookingDetails[booking.BookingId]?.buyerName ||
                            "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[120px] sm:w-[140px] text-center hidden md:table-cell">
                          {bookingDetails[booking.BookingId]?.buyerPhone ||
                            "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[120px] sm:w-[150px] text-center">
                          {bookingDetails[booking.BookingId]
                            ?.movieNameEnglish || "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[120px] sm:w-[140px] text-center">
                          {formatDateTime(booking.BookingDate) || "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] text-center hidden lg:table-cell">
                          {bookingDetails[booking.BookingId]?.seats || "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] text-center">
                          {getStatusBadge(
                            getBookingStatusText(
                              bookingDetails[booking.BookingId]?.status ??
                                booking.status
                            )
                          )}
                        </td>
                        <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(booking);
                            }}
                            className="text-blue-600 cursor-pointer hover:text-blue-800 p-2 rounded-xl border-solid border-slate-100 sm:p-2 "
                          >
                            Successfully
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

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
