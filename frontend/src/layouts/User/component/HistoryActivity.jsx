import React, { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import {
  getBookingHistory
} from "../../../services/API";

const HistoryActivity = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const { user } = useAuth();


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
        setHistoryData(response || []);
      } catch (error) {
        console.error("Lỗi khi lấy history:", error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 2:
        return 'bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium';
      case 4:
        return 'bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium';
      default:
        return 'bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 2:
        return 'Success';
      case 4:
        return 'Canceled';
      case 'Waiting':
        return 'Waiting';
      default:
        return 'Unknown';
    }
  };

  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = historyData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-all duration-200 ${i === currentPage
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-purple-50 hover:border-purple-300"
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
        >
          {totalPages}
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
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
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
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Activity History</h1>
        <p className="text-gray-600 text-lg">Track your booking history and use your loyalty points</p>
      </div>

      <div className="flex mb-8 space-x-2 bg-gray-100 p-2 rounded-2xl">
        <button
          onClick={() => setActiveTab("booking")}
          className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "booking"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
        >
          Booking History
        </button>
        <button
          onClick={() => setActiveTab("points")}
          className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "points"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
        >
          Points Activity
        </button>
      </div>

      {activeTab === "booking" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
            </div>
            {historyData.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, historyData.length)} of {historyData.length} bookings
              </div>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            {historyData.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Booking History</h3>
                <p className="text-gray-500">You haven't made any bookings yet</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Number Ticket</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Room</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Add Point</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item.id || index} className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-800">{item.movieNameEnglish || 'Unknown Movie'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-gray-700">
                            {item.showTime || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-gray-700">
                            {item.showDate || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700 flex justify-center">
                          {item.seats ? (Array.isArray(item.seats) ? item.seats.length : item.seats.toString().split(',').length) : 0}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-gray-700">
                            {item.room || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700 font-medium">{item.totalAmount || '0'}</td>
                        <td className="py-4 px-6 text-gray-700 flex justify-center">{item.addPoint || '0'}</td>
                        <td className="py-4 px-6">
                          <span className={`${getStatusStyle(item.status)} px-4 py-2 rounded-full text-sm font-medium`}>
                            {getStatusLabel(item.status)}
                          </span>

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
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Points Activity</h3>
          <p className="text-gray-500">Your loyalty points activity will appear here</p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
            View Points Details
          </button>
        </div>
      )}

    </div>
  );
};

export default HistoryActivity;