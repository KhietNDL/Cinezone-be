// Updated: Optimized network requests - removed duplicate API calls
import React, { useEffect, useState, useCallback } from "react";
import { Users, CheckCircle, Clock, Film, Eye, Ticket } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import UserAvatar from "../userComponent/UserAvatar";
import {
  getAllBookings,
  getBookingById,
  searchBookingsByUser,
} from "../../../services/API";
import {
  getTopMoviesByTickets,
  getTopGenresByTickets,
} from "../../../services/APIForAdmin/API";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Pagination from "../movieComponent/Pagination";
import StatsCards from "../ticketComponent/StatsCards";

const TicketBookingManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

  // Stats data for all bookings
  const [allBookingDetails, setAllBookingDetails] = useState({});

  // Chart data states
  const [topMoviesData, setTopMoviesData] = useState([]);
  const [topGenresData, setTopGenresData] = useState([]);

  // Helper function to map filter to backend status
  const getStatusFromFilter = (filter) => {
    switch (filter) {
      case "successful":
        return "successful"; // Status 2 (Paid) or 3 (Completed)
      case "pending":
        return "pending"; // Status 1 (Pending)
      case "cancelled":
        return "cancelled"; // Status 4 (Cancelled)
      case "all":
      default:
        return null;
    }
  };

  // Stats calculation based on all bookings
  const totalBookings = Object.keys(allBookingDetails).length;
  const successfulBookings = Object.values(allBookingDetails).filter(
    (booking) => booking.status === 2 || booking.status === 3
  ).length;
  const pendingBookings = Object.values(allBookingDetails).filter(
    (booking) => booking.status === 1
  ).length;
  const cancelledBookings = Object.values(allBookingDetails).filter(
    (booking) => booking.status === 4
  ).length;

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

  const handleFilterChange = (filterType) => {
    setStatusFilter(filterType);
    setCurrentPage(1); // Reset to page 1 when filter changes

    // Use backend filtering instead of client-side
    const status = getStatusFromFilter(filterType);
    if (searchTerm.trim()) {
      searchBookingData(searchTerm, status);
    } else {
      fetchBookings(status);
    }
  };

  // Fetch all bookings for statistics calculation
  const getAllBookingsForStats = useCallback(async () => {
    try {
      const params = {
        page: 1,
        limit: 10000, // Large number to get all bookings
        sortBy: "CreatedAt",
        sortOrder: "desc",
      };

      const data = await getAllBookings(params);
      if (data.data) {
        // Fetch details for all bookings for accurate stats
        const fetchAllDetails = async () => {
          const detailsPromises = data.data.map(async (booking) => {
            const bookingId = booking.BookingId;
            try {
              const detail = await getBookingById(bookingId);
              return { [bookingId]: detail };
            } catch {
              // Fallback to booking data with basic structure
              return {
                [bookingId]: {
                  ...booking,
                  buyerName: booking.buyerName || "Unknown",
                  buyerPhone: booking.buyerPhone || "N/A",
                  movieNameEnglish: booking.movieNameEnglish || "N/A",
                  seats: booking.seats || "N/A",
                  status: booking.status || 1,
                  TotalAmount: booking.TotalAmount || 0,
                },
              };
            }
          });
          const details = await Promise.all(detailsPromises);
          const updatedDetails = details.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          setAllBookingDetails(updatedDetails);
        };
        await fetchAllDetails();
      }
    } catch (error) {
      console.error("Error fetching all bookings for stats:", error);
      setAllBookingDetails({});
    }
  }, []);

  const fetchBookings = useCallback(
    async (status = null) => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: "CreatedAt",
          sortOrder: "desc",
        };

        // Add status filter if provided
        if (status) {
          params.status = status;
        }

        const data = await getAllBookings(params);
        setBookings(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }

        // Fetch details for current page bookings only
        const fetchDetails = async () => {
          const detailsPromises = data.data.map(async (booking) => {
            const bookingId = booking.BookingId;
            try {
              const detail = await getBookingById(bookingId);
              return { [bookingId]: detail };
            } catch (error) {
              // Only log if it's not a "not found" error
              if (!error.message?.includes("not found")) {
                console.error(
                  `Error fetching detail for booking ${bookingId}:`,
                  error
                );
              }
              // Fallback to booking data with basic structure
              return {
                [bookingId]: {
                  ...booking,
                  buyerName: booking.buyerName || "Unknown",
                  buyerPhone: booking.buyerPhone || "N/A",
                  movieNameEnglish: booking.movieNameEnglish || "N/A",
                  seats: booking.seats || "N/A",
                  status: booking.status || 1,
                  TotalAmount: booking.TotalAmount || 0,
                },
              };
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
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Load initial data khi component mount
  useEffect(() => {
    if (!searchTerm) {
      fetchBookings();
    }
    // Load stats data separately to avoid duplicate calls
    if (Object.keys(allBookingDetails).length === 0) {
      getAllBookingsForStats();
    }
  }, [fetchBookings, searchTerm, getAllBookingsForStats, allBookingDetails]);

  const searchBookingData = useCallback(
    async (searchTerm, status = null) => {
      if (!searchTerm.trim()) {
        fetchBookings(status);
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

        // Add status filter if provided
        if (status) {
          params.status = status;
        }

        const response = await searchBookingsByUser(searchTerm, params);
        if (response) {
          // Chuẩn hóa dữ liệu booking
          const bookingsData = response.data
            ? response.data.map(normalizeBookingData)
            : [];

          setBookings(bookingsData);

          // Xử lý pagination từ response
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
          } else {
            const total = bookingsData.length;
            setTotalPages(Math.ceil(total / itemsPerPage));
          }

          // Fetch chi tiết cho từng booking - Reset booking details khi search
          const detailsPromises = bookingsData.map(async (booking) => {
            const bookingId = booking.BookingId;
            try {
              const detail = await getBookingById(bookingId);
              return { [bookingId]: detail };
            } catch (error) {
              // Only log if it's not a "not found" error
              if (!error.message?.includes("not found")) {
                console.error(
                  `Error fetching detail for booking ${bookingId}:`,
                  error
                );
              }
              // Fallback to booking data with basic structure
              return {
                [bookingId]: {
                  ...booking,
                  buyerName: booking.buyerName || "Unknown",
                  buyerPhone: booking.buyerPhone || "N/A",
                  movieNameEnglish: booking.movieNameEnglish || "N/A",
                  seats: booking.seats || "N/A",
                  status: booking.status || 1,
                  TotalAmount: booking.TotalAmount || 0,
                },
              };
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
      const status = getStatusFromFilter(statusFilter);

      if (searchTerm) {
        searchBookingData(searchTerm, status);
      } else {
        fetchBookings(status);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, statusFilter, searchBookingData, fetchBookings]);

  // Fetch chart data
  useEffect(() => {
    const fetchTopMoviesStats = async () => {
      try {
        const response = await getTopMoviesByTickets(10);
        if (response?.data && Array.isArray(response.data)) {
          setTopMoviesData(response.data);
        } else {
          setTopMoviesData([]);
        }
      } catch (error) {
        console.error("Error fetching top movies stats:", error);
        setTopMoviesData([]);
      }
    };

    const fetchTopGenresStats = async () => {
      try {
        const response = await getTopGenresByTickets(5);
        if (response?.data && Array.isArray(response.data)) {
          setTopGenresData(response.data);
        } else {
          setTopGenresData([]);
        }
      } catch (error) {
        console.error("Error fetching top genres stats:", error);
        setTopGenresData([]);
      }
    };

    fetchTopMoviesStats();
    fetchTopGenresStats();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending:
        "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300 shadow-sm",
      Paid: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300 shadow-sm",
      Completed:
        "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm",
      Cancelled:
        "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300 shadow-sm",
      Unknown:
        "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300 shadow-sm",
    };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${
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
        // Only log if it's not a "not found" error
        if (!error.message?.includes("not found")) {
          console.error(`Error fetching booking detail:`, error);
        }
        // Use fallback booking data
        const fallbackBooking = {
          ...booking,
          buyerName: booking.buyerName || "Unknown",
          buyerPhone: booking.buyerPhone || "N/A",
          movieNameEnglish: booking.movieNameEnglish || "N/A",
          seats: booking.seats || "N/A",
          status: booking.status || 1,
          TotalAmount: booking.TotalAmount || 0,
        };
        setSelectedBooking(fallbackBooking);
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
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-50 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isOpen ? "" : "pointer-events-none"
          }`}
        >
          <div
            data-testid="booking-modal"
            className={`bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-300 border border-gray-200 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Booking Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete booking information & status
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
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
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 font-medium">
                  Booking ID:{" "}
                  <span className="text-gray-900 font-mono font-semibold">
                    {booking.BookingId}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Full Name:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {booking.buyerName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Identity Card:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {booking.identityCard || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="font-semibold text-gray-900">
                        {booking.buyerPhone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Movie Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                      <Film className="w-4 h-4 text-purple-600" />
                    </div>
                    Movie Information
                  </h4>
                  <div className="space-y-3">
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium block mb-1">
                        Movie:
                      </span>
                      <span className="font-semibold text-gray-900 text-lg">
                        {booking.movieNameEnglish}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Show Time:
                      </span>
                      <span className="font-semibold text-white bg-purple-600 px-3 py-1 rounded-md text-sm">
                        {booking.showTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Room:</span>
                      <span className="font-semibold text-gray-900">
                        {booking.room}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Duration:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {booking.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Seats:</span>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          if (!booking.seats || booking.seats === "N/A") {
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                N/A
                              </span>
                            );
                          }

                          const seatArray = Array.isArray(booking.seats)
                            ? booking.seats
                            : typeof booking.seats === "string"
                            ? booking.seats.split(",")
                            : [booking.seats.toString()];

                          return seatArray.map((seat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                            >
                              {typeof seat === "string" ? seat.trim() : seat}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promotions & Concessions */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    Promotions & Concessions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Promotion:
                      </span>
                      <span
                        className={`font-medium px-3 py-1 rounded-md text-sm ${
                          booking.PromotionId
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
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
                        className={`font-medium px-3 py-1 rounded-md text-sm ${
                          booking.hasConcessions
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {booking.hasConcessions ? "Yes" : "No"}
                      </span>
                    </div>
                    {booking.hasConcessions &&
                      booking.concessionItems &&
                      booking.concessionItems.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-600 font-medium block mb-2">
                            Items:
                          </span>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                            {booking.concessionItems.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-gray-700 bg-white rounded-md p-2 border border-gray-100"
                              >
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                <span className="font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Points & Payment */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    Points & Payment
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Points Used:
                      </span>
                      <span className="font-semibold text-white bg-orange-500 px-3 py-1 rounded-md text-sm">
                        {booking.pointsUsed || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Points Earned:
                      </span>
                      <span className="font-semibold text-white bg-green-500 px-3 py-1 rounded-md text-sm">
                        +{booking.pointEarn || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Ticket Price:
                      </span>
                      <span className="font-semibold text-purple-600 text-lg">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4 mt-4 border border-gray-200">
                      <span className="text-gray-700 font-semibold text-lg">
                        Total Amount:
                      </span>
                      <span className="font-bold text-2xl text-purple-600">
                        {formatPrice(booking.TotalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-900 font-semibold text-xl">
                      Booking Status:
                    </span>
                  </div>
                  <div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Ticket className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Ticket Booking Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Monitor Booking Activities
              </p>
            </div>
          </div>

          {/* Right: Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-[350px]">
              <div className="absolute left-3 z-10">
                <IoSearchOutline className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                placeholder="Search by phone.."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start max-w-7xl w-full overflow-x-hidden">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <StatsCards
            totalBookings={totalBookings}
            successfulBookings={successfulBookings}
            pendingBookings={pendingBookings}
            cancelledBookings={cancelledBookings}
            onFilterChange={handleFilterChange}
            activeFilter={statusFilter}
          />

          {/* Booking Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-slate-600 text-xs sm:text-sm border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0">
                        Customer Info
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0 hidden md:table-cell">
                        Phone Number
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0">
                        Movie
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0">
                        Booking Time
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0 hidden lg:table-cell">
                        Seats
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 shrink-0">
                        Status
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-[140px] shrink-0">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.BookingId}
                        onClick={() => openModal(booking)}
                        className="border-b cursor-pointer border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-xs sm:text-sm transition-all duration-200 group"
                      >
                        <td className="py-3 px-4 shrink-0">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <UserAvatar
                                fullName={
                                  (
                                    allBookingDetails[booking.BookingId] ||
                                    bookingDetails[booking.BookingId]
                                  )?.buyerName || "User"
                                }
                                size="md"
                                showHover={true}
                              />
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                                {(
                                  allBookingDetails[booking.BookingId] ||
                                  bookingDetails[booking.BookingId]
                                )?.buyerName || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 shrink-0 text-gray-600 hidden md:table-cell">
                          {(
                            allBookingDetails[booking.BookingId] ||
                            bookingDetails[booking.BookingId]
                          )?.buyerPhone || "N/A"}
                        </td>
                        <td className="py-3 px-4 shrink-0">
                          <span className="block text-gray-600">
                            {(
                              allBookingDetails[booking.BookingId] ||
                              bookingDetails[booking.BookingId]
                            )?.movieNameEnglish || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 shrink-0 text-gray-600">
                          {formatDateTime(booking.BookingDate) || "N/A"}
                        </td>
                        <td className="py-3 px-4 shrink-0 text-gray-600 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const seats = (
                                allBookingDetails[booking.BookingId] ||
                                bookingDetails[booking.BookingId]
                              )?.seats;

                              if (!seats || seats === "N/A") {
                                return (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    N/A
                                  </span>
                                );
                              }

                              // Handle both string and array cases
                              const seatArray = Array.isArray(seats)
                                ? seats
                                : typeof seats === "string"
                                ? seats.split(",")
                                : [seats.toString()];

                              return seatArray.map((seat, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                                >
                                  {typeof seat === "string"
                                    ? seat.trim()
                                    : seat}
                                </span>
                              ));
                            })()}
                          </div>
                        </td>
                        <td className="py-3 px-4 shrink-0">
                          {getStatusBadge(
                            getBookingStatusText(
                              (
                                allBookingDetails[booking.BookingId] ||
                                bookingDetails[booking.BookingId]
                              )?.status ?? booking.status
                            )
                          )}
                        </td>
                        <td className="py-3 px-4 w-[140px] shrink-0">
                          <div className="flex justify-center space-x-1 sm:space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(booking);
                              }}
                              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                              title="View Booking"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* No data state */}
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No booking records available"}
                  </p>
                </div>
              )}
            </div>

            {/* Card Layout for Mobile */}
            <div className="block sm:hidden">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No booking records available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {bookings.map((booking) => (
                    <article
                      key={booking.BookingId}
                      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-indigo-50/30 group"
                      onClick={() => openModal(booking)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <UserAvatar
                            fullName={
                              (
                                allBookingDetails[booking.BookingId] ||
                                bookingDetails[booking.BookingId]
                              )?.buyerName || "User"
                            }
                            size="xl"
                            showHover={true}
                            className="shadow-md group-hover:shadow-lg transition-shadow duration-300 ring-2 ring-gray-100 group-hover:ring-purple-200"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                            <Ticket className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                            {(
                              allBookingDetails[booking.BookingId] ||
                              bookingDetails[booking.BookingId]
                            )?.buyerName || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500 truncate group-hover:text-purple-600 transition-colors duration-300">
                            {(
                              allBookingDetails[booking.BookingId] ||
                              bookingDetails[booking.BookingId]
                            )?.movieNameEnglish || "N/A"}
                          </p>
                          <div className="flex items-center mt-1">
                            {getStatusBadge(
                              getBookingStatusText(
                                (
                                  allBookingDetails[booking.BookingId] ||
                                  bookingDetails[booking.BookingId]
                                )?.status ?? booking.status
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100">
                          <p className="font-medium text-purple-700">Phone</p>
                          <p className="text-purple-600">
                            {(
                              allBookingDetails[booking.BookingId] ||
                              bookingDetails[booking.BookingId]
                            )?.buyerPhone || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                          <p className="font-medium text-blue-700">Seats</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(() => {
                              const seats = (
                                allBookingDetails[booking.BookingId] ||
                                bookingDetails[booking.BookingId]
                              )?.seats;

                              if (!seats || seats === "N/A") {
                                return (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-600 border border-gray-300">
                                    N/A
                                  </span>
                                );
                              }

                              // Handle both string and array cases
                              const seatArray = Array.isArray(seats)
                                ? seats
                                : typeof seats === "string"
                                ? seats.split(",")
                                : [seats.toString()];

                              return seatArray.map((seat, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-200 text-blue-800 border border-blue-300"
                                >
                                  {typeof seat === "string"
                                    ? seat.trim()
                                    : seat}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                          <p className="font-medium text-green-700">
                            Booking Date
                          </p>
                          <p className="text-green-600">
                            {formatDateTime(booking.BookingDate) || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                          <p className="font-medium text-orange-700">Total</p>
                          <p className="text-orange-600 font-semibold">
                            {formatPrice(
                              (
                                allBookingDetails[booking.BookingId] ||
                                bookingDetails[booking.BookingId]
                              )?.TotalAmount || 0
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(booking);
                          }}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {" "}
            {/* Top Movies by Tickets Pie Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Top Movies by Ticket Sales (Pie Chart)
                </h3>
                <p className="text-sm text-gray-500">
                  Distribution of ticket sales among top movies
                </p>
              </div>
              <div className="h-[350px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topMoviesData.slice(0, 8)} // Show top 8 movies to avoid overcrowding
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ title, percent }) =>
                        `${
                          title && title.length > 15
                            ? title.substring(0, 15) + "..."
                            : title || "Unknown"
                        } (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="ticketsSold"
                    >
                      {topMoviesData.slice(0, 8).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#8B5CF6", // Purple
                              "#06B6D4", // Cyan
                              "#10B981", // Green
                              "#F59E0B", // Yellow
                              "#EF4444", // Red
                              "#EC4899", // Pink
                              "#6366F1", // Indigo
                              "#84CC16", // Lime
                            ][index % 8]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value.toLocaleString()} tickets`,
                        `${props.payload.title || "Unknown Movie"}`,
                      ]}
                      labelStyle={{ color: "#333" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        entry.payload.title && entry.payload.title.length > 20
                          ? entry.payload.title.substring(0, 20) + "..."
                          : entry.payload.title || "Unknown Movie"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <span className="font-medium text-gray-700">
                      Total Tickets Sold (Top Movies):
                    </span>
                    <span className="font-bold text-lg text-purple-600">
                      {topMoviesData
                        .slice(0, 8)
                        .reduce((sum, item) => sum + (item.ticketsSold || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topMoviesData.slice(0, 8).map((movie, index) => (
                      <div
                        key={movie.movieId}
                        className="flex justify-between items-center p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 shadow-sm"
                            style={{
                              backgroundColor: [
                                "#8B5CF6", // Purple
                                "#06B6D4", // Cyan
                                "#10B981", // Green
                                "#F59E0B", // Yellow
                                "#EF4444", // Red
                                "#EC4899", // Pink
                                "#6366F1", // Indigo
                                "#84CC16", // Lime
                              ][index % 8],
                            }}
                          ></div>
                          <span className="font-medium text-xs">
                            {movie.title && movie.title.length > 15
                              ? movie.title.substring(0, 15) + "..."
                              : movie.title || "Unknown Movie"}
                            :
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">
                          {(movie.ticketsSold || 0).toLocaleString()} tickets
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Top Genres by Tickets Pie Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Top Genres by Ticket Sales
                </h3>
                <p className="text-sm text-gray-500">
                  Distribution of ticket sales among different genres
                </p>
              </div>
              <div className="h-[350px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topGenresData} // Show all genres
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ genre, percent }) =>
                        `${genre} (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="ticketsSold"
                    >
                      {topGenresData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#10B981", // Green
                              "#06B6D4", // Cyan
                              "#8B5CF6", // Purple
                              "#F59E0B", // Yellow
                              "#EF4444", // Red
                              "#EC4899", // Pink
                              "#6366F1", // Indigo
                              "#84CC16", // Lime
                            ][index % 8]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value.toLocaleString()} tickets`,
                        `${props.payload.genre} Genre`,
                      ]}
                      labelStyle={{ color: "#333" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => entry.payload.genre}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center mb-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                    <span className="font-medium text-gray-700">
                      Total Tickets Sold (All Genres):
                    </span>
                    <span className="font-bold text-lg text-emerald-600">
                      {topGenresData
                        .reduce((sum, item) => sum + (item.ticketsSold || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topGenresData.map((genre, index) => (
                      <div
                        key={genre.genre}
                        className="flex justify-between items-center p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-lg transition-all duration-200 border border-transparent hover:border-emerald-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 shadow-sm"
                            style={{
                              backgroundColor: [
                                "#10B981", // Green
                                "#06B6D4", // Cyan
                                "#8B5CF6", // Purple
                                "#F59E0B", // Yellow
                                "#EF4444", // Red
                                "#EC4899", // Pink
                                "#6366F1", // Indigo
                                "#84CC16", // Lime
                              ][index % 8],
                            }}
                          ></div>
                          <span className="font-medium text-xs">
                            {genre.genre}:
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">
                          {(genre.ticketsSold || 0).toLocaleString()} tickets
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
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
