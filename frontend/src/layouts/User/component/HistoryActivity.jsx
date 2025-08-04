import React, { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import {
  getBookingHistory,
  getPaymentHistory,
  getScoreHistoryByMemberId,
} from "../../../services/API";

const HistoryActivity = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [historyData, setHistoryData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [filteredScoreHistory, setFilteredScoreHistory] = useState([]);

  // Filter và Search states cho booking
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Filter và Search states cho points
  const [pointsSearchTerm, setPointsSearchTerm] = useState("");
  const [pointsStatusFilter, setPointsStatusFilter] = useState("all");
  const [pointsDateFilter, setPointsDateFilter] = useState("");

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Helper function to convert date to dd/mm/yyyy format
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to convert dd/mm/yyyy to yyyy-mm-dd for date input
  const convertDDMMYYYYtoYYYYMMDD = (ddmmyyyy) => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Helper function to convert yyyy-mm-dd to dd/mm/yyyy
  const convertYYYYMMDDtoDDMMYYYY = (yyyymmdd) => {
    if (!yyyymmdd) return "";
    const parts = yyyymmdd.split("-");
    if (parts.length !== 3) return "";
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Filter và Search functions cho booking (sử dụng paymentHistory)
  const applyFilters = () => {
    const safePaymentHistory = Array.isArray(paymentHistory) ? paymentHistory : [];
    let filtered = [...safePaymentHistory];

    // Search by movie name
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.booking?.movieNameEnglish?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.booking?.status?.toString() === statusFilter
      );
    }

    // Filter by date - so sánh với format dd/mm/yyyy
    if (dateFilter) {
      const selectedDateDDMMYYYY = convertYYYYMMDDtoDDMMYYYY(dateFilter);
      filtered = filtered.filter((item) => {
        if (!item.booking?.BookingDate) return false;
        const bookingDateDDMMYYYY = formatDateToDDMMYYYY(item.booking.BookingDate);
        return bookingDateDDMMYYYY === selectedDateDDMMYYYY;
      });
    }

    // Luôn sort theo newest first (cố định)
    filtered.sort((a, b) => {
      const dateA = new Date(a.booking?.BookingDate);
      const dateB = new Date(b.booking?.BookingDate);
      return dateB - dateA; // newest first
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Filter functions cho points
  const applyPointsFilters = () => {
    const safeScoreHistory = Array.isArray(scoreHistory) ? scoreHistory : [];
    let filtered = [...safeScoreHistory];

    // Search by booking ID
    if (pointsSearchTerm) {
      filtered = filtered.filter((item) =>
        item.RelatedBookingId?.toLowerCase().includes(
          pointsSearchTerm.toLowerCase()
        )
      );
    }

    // Filter by change type
    if (pointsStatusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.ChangeType.toString() === pointsStatusFilter
      );
    }

    // Filter by date
    if (pointsDateFilter) {
      const selectedDateDDMMYYYY = convertYYYYMMDDtoDDMMYYYY(pointsDateFilter);
      filtered = filtered.filter((item) => {
        if (!item.ChangeDate) return false;
        const changeDateDDMMYYYY = formatDateToDDMMYYYY(item.ChangeDate);
        return changeDateDDMMYYYY === selectedDateDDMMYYYY;
      });
    }

    // Luôn sort theo newest first (cố định)
    filtered.sort((a, b) => {
      const dateA = new Date(a.ChangeDate);
      const dateB = new Date(b.ChangeDate);
      return dateB - dateA; // newest first
    });

    setFilteredScoreHistory(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  const clearPointsFilters = () => {
    setPointsSearchTerm("");
    setPointsStatusFilter("all");
    setPointsDateFilter("");
  };

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getBookingHistory(user.userId);
        console.log("Booking History in HistoryPage:", response);
        setHistoryData(response?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy history:", error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user]);

    useEffect(() => {
  const fetchPaymentHistory = async () => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getPaymentHistory(user.userId);
      const rawData = response?.data || [];
      // setPaymentHistory(rawData);
      console.log("Payment History in HistoryPage:", rawData);

      // Lọc trùng theo bookingId thủ công
      const seen = new Set();
      const uniqueData = rawData.filter((item) => {
        const id = item.booking?.BookingId;
        console.log("Checking ID:", id);
        if (!id) return true;
        if (seen.has(id)) return false; 
        seen.add(id);
        return true;
      });

      setPaymentHistory(uniqueData);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử thanh toán:", error);
      setPaymentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPaymentHistory();

   const fetchScoreHistory = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getScoreHistoryByMemberId(user.userId);
        console.log("SCORE History in HistoryPage:", response);
        setScoreHistory(response || []);
      } catch (error) {
        console.error("Lỗi khi lấy history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreHistory();
}, [user]);


  
  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, paymentHistory]);

  useEffect(() => {
    applyPointsFilters();
  }, [pointsSearchTerm, pointsStatusFilter, pointsDateFilter, scoreHistory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 2:
        return "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium";
      case 4:
        return "bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium";
      case 1:
        return "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium";
      default:
        return "bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium";
    }
  };

  const getStatusLabel = (status) => {
    const statusValue =
      typeof status === "string"
        ? status === "Waiting"
          ? "Waiting"
          : parseInt(status)
        : status;

    switch (statusValue) {
      case 2:
        return "Success";
      case 4:
        return "Canceled";
      case 1:
        return "Waiting";
      default:
        return "Unknown";
    }
  };

  // Pagination cho booking

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Pagination cho points
  const totalPagesPoints = Math.ceil(
    filteredScoreHistory.length / itemsPerPage
  );
  const currentScoreData = filteredScoreHistory.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const currentTotalPages =
      activeTab === "booking" ? totalPages : totalPagesPoints;

    if (currentTotalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(currentTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-all duration-200 ${
            i === currentPage
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-purple-50 hover:border-purple-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < currentTotalPages) {
      if (endPage < currentTotalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={currentTotalPages}
          onClick={() => handlePageChange(currentTotalPages)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
        >
          {currentTotalPages}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-6 space-x-2 mb-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() =>
            handlePageChange(Math.min(currentTotalPages, currentPage + 1))
          }
          disabled={currentPage === currentTotalPages}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 min-h-screen p-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 min-h-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Activity History
        </h1>
        <p className="text-gray-600 text-lg">
          Track your booking history and use your loyalty points
        </p>
      </div>

      <div className="flex mb-8 space-x-2 bg-gray-100 p-2 rounded-2xl">
        <button
          onClick={() => handleTabChange("booking")}
          className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === "booking"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
          }`}
        >
          Booking History
        </button>
        <button
          onClick={() => handleTabChange("points")}
          className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === "points"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
          }`}
        >
          Points Activity
        </button>
      </div>

      {activeTab === "booking" && (
        <div>
          {/* Filter và Search Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search by Movie Name */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Movie
                </label>
                <input
                  type="text"
                  placeholder="Enter movie name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filter by Status */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="2">Success</option>
                  <option value="4">Canceled</option>
                  <option value="Waiting">Waiting</option>
                </select>
              </div>

              {/* Filter by Date */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Clear Filters Button */}
              <div>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== "all" || dateFilter) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Active filters:</span>
                  {searchTerm && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Movie: "{searchTerm}"
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Status: {getStatusLabel(statusFilter)}
                    </span>
                  )}
                  {dateFilter && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Date: {convertYYYYMMDDtoDDMMYYYY(dateFilter)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 ml-4">
                Booking History
              </h2>
            </div>
            {filteredData.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} bookings
                {filteredData.length !== paymentHistory.length && (
                  <span className="ml-1 text-purple-600">
                    (filtered from {paymentHistory.length} total)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            {filteredData.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">
                  {paymentHistory.length === 0 ? "📋" : "🔍"}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {paymentHistory.length === 0
                    ? "No Booking History"
                    : "No Results Found"}
                </h3>
                <p className="text-gray-500">
                  {paymentHistory.length === 0
                    ? "You haven't made any bookings yet"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {paymentHistory.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Time
                      </th>
                      <th className="text-center py-4 px-2 font-semibold text-gray-700">
                        Ticket
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-start py-4 px-2 font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr
                        key={item.payment?.PaymentId || index}
                        className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="text-center space-x-3">
                            <span className="font-medium text-gray-800">
                              {item.booking?.movieNameEnglish || "Unknown Movie"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-center text-gray-700">
                            {item.booking?.BookingDate
                              ? new Date(item.booking.BookingDate)
                                  .toLocaleDateString("vi-VN")
                                  .replace(/\//g, "-")
                              : "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-center text-gray-700">
                            {item.booking?.BookingDate
                              ? new Date(item.booking.BookingDate).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )
                              : "N/A"}
                          </div>
                        </td>
                        <td className=" text-center py-4 px-4 text-gray-700 ">
                          {item.booking?.seats
                            ? Array.isArray(item.booking.seats)
                              ? item.booking.seats.length
                              : item.booking.seats.toString().split(",").length
                            : 0}
                        </td>
                        <td className=" text-center py-4 px-6 text-gray-700 font-medium">
                          {item.payment?.Amount || "0"}
                        </td>
                        <td className=" text-center py-4 px-6 text-gray-700 font-medium">
                          {item.booking?.buyerName || "N/A"}
                        </td>
                        <td className="text-center py-4 px-6 mr-0 ">
                          <span
                            className={`${getStatusStyle(
                              item.booking?.status
                            )} inline-flex justify-center items-center px-4 py-2 rounded-full text-sm font-medium min-w-[90px] text-center`}
                          >
                            {getStatusLabel(item.booking?.status)}
                          </span>
                        </td>

                        <td className="  text-start py-0 px-0">
                          {item.booking?.status === 2 && (
                            <button
                              onClick={() => handleViewDetail(item.booking)}
                              className="bg-blue-100 text-blue-600 px-2  py-2 w-[60px] rounded-full text-sm font-medium hover:bg-blue-500/50"
                            >
                              Detail
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "points" && (
        <div>
          {/* Filter và Search Section for Points */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search by Booking ID */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Booking ID
                </label>
                <input
                  type="text"
                  placeholder="Enter booking ID..."
                  value={pointsSearchTerm}
                  onChange={(e) => setPointsSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

             
              {/* Filter by Date */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={pointsDateFilter}
                  onChange={(e) => setPointsDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Clear Filters Button */}
              <div>
                <button
                  onClick={clearPointsFilters}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Active Filters Display for Points */}
            {(pointsSearchTerm ||
              pointsStatusFilter !== "all" ||
              pointsDateFilter) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Active filters:</span>
                  {pointsSearchTerm && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Booking ID: "{pointsSearchTerm}"
                    </span>
                  )}
                  {pointsStatusFilter !== "all" && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Type:{" "}
                      {pointsStatusFilter === "2"
                        ? "Points Used"
                        : "Points Earned"}
                    </span>
                  )}
                  {pointsDateFilter && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Date: {convertYYYYMMDDtoDDMMYYYY(pointsDateFilter)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 ml-4">
                Points Activity
              </h2>
            </div>
            {filteredScoreHistory.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredScoreHistory.length)} of{" "}
                {filteredScoreHistory.length} activities
                {filteredScoreHistory.length !== scoreHistory.length && (
                  <span className="ml-1 text-purple-600">
                    (filtered from {scoreHistory.length} total)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            {filteredScoreHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">
                  {scoreHistory.length === 0 ? "🎯" : "🔍"}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {scoreHistory.length === 0
                    ? "No Points Activity"
                    : "No Results Found"}
                </h3>
                <p className="text-gray-500">
                  {scoreHistory.length === 0
                    ? "You haven't earned or used any points yet"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {scoreHistory.length > 0 && (
                  <button
                    onClick={clearPointsFilters}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Time
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Points
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Booking ID
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {currentScoreData.map((item, index) => (
                      <tr
                        key={item.ScoreHistoryId || index}
                        className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center text-gray-700">
                            {item.ChangeDate
                              ? new Date(item.ChangeDate)
                                  .toLocaleDateString("vi-VN")
                                  .replace(/\//g, "-")
                              : "N/A"}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center text-gray-700">
                            {item.ChangeDate
                              ? new Date(item.ChangeDate).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )
                              : "N/A"}
                          </div>
                        </td>

                        <td className="text-center py-4 px-6">
                          <div
                            className={`font-semibold ${
                              item.ScoreValue > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.ScoreValue > 0
                              ? `+${item.ScoreValue}`
                              : item.ScoreValue}
                          </div>
                        </td>

                        <td className="text-center py-4 px-6 text-gray-700 font-mono text-sm">
                          {item.RelatedBookingId}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Points Summary
                      </h4>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Earned</p>
                          <p className="text-xl font-bold text-green-600">
                            +
                            {scoreHistory
                              .filter((item) => item.ScoreValue > 0)
                              .reduce((sum, item) => sum + item.ScoreValue, 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Used</p>
                          <p className="text-xl font-bold text-red-600">
                            {scoreHistory
                              .filter((item) => item.ScoreValue < 0)
                              .reduce((sum, item) => sum + item.ScoreValue, 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Net Points</p>
                          <p className="text-xl font-bold text-purple-600">
                            {scoreHistory.reduce(
                              (sum, item) => sum + item.ScoreValue,
                              0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {renderPagination()}
              </>
            )}
          </div>
        </div>
      )}

      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-8 text-white relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">CINEZONE TICKET</h3>
                <div className="w-16 h-1 bg-white/30 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="px-6 py-6 bg-white">
              {/* Movie Title */}
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedBooking.movieNameEnglish}
                </h4>
                <div className="w-18 h-0.5 bg-gray-300 mx-auto rounded-full"></div>
              </div>

              {/* Ticket Info */}
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedBooking.showDate}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Time
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedBooking.showTime}
                    </p>
                  </div>
                </div>

                {/* Room & Seats */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Room
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedBooking.room}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Seats
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {Array.isArray(selectedBooking.seats)
                        ? selectedBooking.seats.join(", ")
                        : selectedBooking.seats}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-400/50 text-white py-3 rounded-xl hover:bg-gray-400/70 transition-colors font-medium text-sm"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryActivity;