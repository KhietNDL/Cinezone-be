import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoWeb.png";
import {
  FaSearch,
  FaUser,
  FaBell,
  FaTicketAlt,
  FaBoxOpen,
  FaClock,
  FaRegSmileBeam,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { searchMovies } from "../../../services/API";
import { slugify } from "./Slug";
import { io } from "socket.io-client";

function getBookingMessage(status) {
  switch (status) {
    case 2:
      return "Your ticket has been confirmed";
    case 3:
      return "Your ticket has been checked in";
    case 4:
      return "Your ticket has been cancelled";
    default:
      return "Your booking status has changed";
  }
}

function getOrderMessage(status) {
  switch (status) {
    case 2:
      return "Your order has been completed";
    case 3:
      return "Your order is being processed";
    case 4:
      return "Your order has been cancelled";
    default:
      return "Your order status has changed";
  }
}

function getPaymentMessage(status) {
  switch (status) {
    case "completed":
      return "Payment completed successfully";
    case "pending":
      return "Payment is being processed";
    case "failed":
      return "Payment failed";
    default:
      return "Payment status has changed";
  }
}

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [newNotiCount, setNewNotiCount] = useState(0);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchMovies({ name: query });
      if (response.data.data) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleMovieSelect = (MovieName) => {
    const slug = slugify(MovieName);
    navigate(`/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:4458");
    socket.emit("join", user.userId || user.UserId);
    console.log("[FE] Join room:", user.userId || user.UserId);

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 8)); // Chỉ giữ 8 noti mới nhất
      setNewNotiCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, [user]);

  // Khi mở popup notification thì reset số lượng mới
  useEffect(() => {
    if (showNoti) setNewNotiCount(0);
  }, [showNoti]);

  // Khi user đăng nhập hoặc reload
  useEffect(() => {
    async function fetchMemberHistory() {
      try {
        const res = await fetch(
          `http://localhost:4458/api/payment/history?memberId=${user.userId}&page=1&limit=8&sortBy=CreatedAt&sortOrder=desc`
        );
        
        // Kiểm tra response status
        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`);
          setNotifications([]);
          return;
        }
        
        // Kiểm tra content type
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          const text = await res.text();
          console.error("Response text:", text);
          setNotifications([]);
          return;
        }
        
        const data = await res.json();
        
        // Kiểm tra cấu trúc data
        if (!data || !data.data || !Array.isArray(data.data)) {
          console.error("Invalid data structure:", data);
          setNotifications([]);
          return;
        }

        // Chuyển đổi data thành notification để hiển thị
        const notifications = data.data.map((item) => {
          const { payment, booking, orderProduct } = item;

          // Helper để lấy điểm cộng/trừ
          const getScoreValue = (booking) => {
            if (!booking) return 0;
            if (booking.pointEarn && booking.pointEarn > 0) return booking.pointEarn;
            if (booking.pointUse && booking.pointUse > 0) return -booking.pointUse;
            return 0;
          };

          if (booking && orderProduct) {
            // Có cả booking và orderProduct
            // Lấy tên sản phẩm từ products array
            const productName = orderProduct.products && orderProduct.products.length > 0 
              ? orderProduct.products[0].productName 
              : "Unknown Product";
            
            return {
              type: "combo",
              paymentId: payment.PaymentId,
              movieNameEnglish: booking.movieNameEnglish || booking.movieNameVN || "Unknown Movie",
              orderProductId: orderProduct.orderProductId,
              productName: productName,
              status: payment.Status,
              message: `${getBookingMessage(booking.status)} & ${getOrderMessage(orderProduct.status)}`,
              createdAt: payment.CreatedAt,
              scoreValue: getScoreValue(booking),
              bookingStatus: booking.status,
              orderStatus: orderProduct.status,
            };
          } else if (booking) {
            // Chỉ có booking
            return {
              type: "booking",
              paymentId: payment.PaymentId,
              movieNameEnglish: booking.movieNameEnglish || booking.movieNameVN || "Unknown Movie",
              status: booking.status,
              message: getBookingMessage(booking.status),
              createdAt: payment.CreatedAt,
              scoreValue: getScoreValue(booking),
            };
          } else if (orderProduct) {
            // Chỉ có orderProduct
            // Lấy tên sản phẩm từ products array
            const productName = orderProduct.products && orderProduct.products.length > 0 
              ? orderProduct.products[0].productName 
              : "Unknown Product";
              
            return {
              type: "order",
              paymentId: payment.PaymentId,
              orderProductId: orderProduct.orderProductId,
              productName: productName,
              status: orderProduct.status,
              message: getOrderMessage(orderProduct.status),
              createdAt: payment.CreatedAt,
              scoreValue: 0,
            };
          } else {
            // Chỉ có payment
            return {
              type: "payment",
              paymentId: payment.PaymentId,
              status: payment.Status,
              message: getPaymentMessage(payment.Status),
              createdAt: payment.CreatedAt,
              scoreValue: 0,
            };
          }
        });

        setNotifications(notifications.slice(0, 8)); // Chỉ lấy 8 noti mới nhất
      } catch (error) {
        console.error("Error fetching member history:", error);
        // Fallback: thử gọi API booking cũ
        try {
          const fallbackRes = await fetch(
            `http://localhost:4458/api/bookings/member/${user.userId}?page=1&limit=8&sortBy=CreatedAt&sortOrder=desc`
          );
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            setNotifications(
              fallbackData.data
                .map((b) => ({
                  type: "booking",
                  movieNameEnglish: b.movieNameEnglish || b.NameOfEnglish || "Unknown Movie",
                  status: b.status || b.Status,
                  message: getBookingMessage(b.status || b.Status),
                  createdAt: b.BookingDate || b.CreatedAt,
                  scoreValue: (b.pointEarn || b.PointEarn || 0) - (b.pointUse || b.PointUse || 0),
                }))
                .slice(0, 8)
            );
          } else {
            setNotifications([]);
          }
        } catch (fallbackError) {
          console.error("Fallback API also failed:", fallbackError);
          setNotifications([]);
        }
      }
    }

    if (user?.userId) fetchMemberHistory();
  }, [user?.userId]);

  const highlightStatus = (message) => {
    if (!message) return "";
    return message
      .replace(
        /confirmed/gi,
        '<span class="text-green-600 font-bold">confirmed</span>'
      )
      .replace(
        /checked in/gi,
        '<span class="text-purple-600 font-bold">checked in</span>'
      )
      .replace(
        /cancelled/gi,
        '<span class="text-red-600 font-bold">cancelled</span>'
      )
      .replace(
        /completed/gi,
        '<span class="text-green-600 font-bold">completed</span>'
      )
      .replace(
        /pending/gi,
        '<span class="text-yellow-600 font-bold">pending</span>'
      )
      .replace(
        /failed/gi,
        '<span class="text-red-600 font-bold">failed</span>'
      );
  };
  const clearNotifications = () => {
    setNotifications([]);
  };
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-2 fixed md:px-5 bg-black/40 text-white flex items-center justify-between select-none w-[100%] top-0 left-0 z-50">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt=""
          loading="lazy"
          role="button"
          onClick={() => navigate("/")}
          className="w-[160px] h-[70px] object-cover"
        />
      </div>
      <div className="md:flex items-center text-[17px] font-bold space-x-8 hidden">
        <div
          onClick={() => navigate("/movies")}
          role="button"
          className="hover:underline shadow-2xl"
        >
          Movies
        </div>
        <Link
          to="/promotions"
          className="hover:underline shadow-2xl block text-center py-2 px-4 cursor-pointer"
          role="button"
        >
          Promotions
        </Link>
        <div
          onClick={() => navigate("/blog")}
          role="button"
          className="hover:underline shadow-2xl"
        >
          News
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center z-50">
          {/* Input search nằm sau nút search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 bg-black text-white border border-[#6a57f5] rounded-4xl pl-4 pr-13 py-2.5 outline-none z-10 ${
              isSearchOpen
                ? "w-50 md:w-70 opacity-100 visible"
                : "w-0 opacity-0 invisible px-0 py-0 border-0"
            }`}
            style={{ minWidth: 0 }}
            autoFocus={isSearchOpen}
          />

          <div
            role="button"
            className="p-2.5 z-20 border-solid border-[1px] border-[#6a57f5] rounded-full shadow-[#6a57f5] shadow-md hover:bg-[#6957f538] transition-all duration-300 bg-black"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            style={{ position: "relative" }}
          >
            <FaSearch size={20} className="text-white" />
          </div>

          {isSearchOpen && searchQuery && searchResults.length > 0 && (
            <div className="absolute p-2 right-0 pt-7 pb-3 top-3 w-50 md:w-70 bg-black border border-[#6a57f5] rounded-b-xl shadow-[#6a57f5] shadow-md max-h-40 overflow-y-auto mt-2 transition-all duration-300 z-0">
              {searchResults.map((movie) => (
                <div
                  key={movie.MovieId}
                  className="p-2 hover:bg-slate-900 cursor-pointer hover:rounded-lg text-white"
                  onClick={() => handleMovieSelect(movie.NameOfEnglish)}
                >
                  {movie.NameOfEnglish || movie.NameOfVietnamese}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Notification Icon */}
        <div
          role="button"
          className="p-2 md:p-2.5 z-20 border-solid border-[1px] border-[#6a57f5] rounded-full shadow-[#6a57f5] shadow-md hover:bg-[#6957f538] transition-all duration-300 bg-black flex-shrink-0"
          style={{ position: "relative" }}
        >
          <FaBell
            size={16}
            className="cursor-pointer md:w-5 md:h-5"
            onClick={() => setShowNoti((prev) => !prev)}
          />
          {newNotiCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold shadow-lg animate-pulse min-w-[18px] text-center">
              {newNotiCount > 99 ? "99+" : newNotiCount}
            </span>
          )}
          {showNoti && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40"
                style={{ background: "transparent" }}
                onClick={() => setShowNoti(false)}
              />
              {/* Popup notification */}
              <div className="absolute right-0 mt-5 w-80 sm:w-96 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-2xl z-50 max-h-150 overflow-hidden border border-[#6a57f5]/50 backdrop-blur-sm">
                {/* Header */}
                <div className="p-3 md:p-4 bg-gradient-to-r from-[#6a57f5] to-[#8b5cf6] text-white rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBell className="text-white" size={16} />
                      <span className="font-bold text-base md:text-lg">
                        Notifications
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-all duration-200"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={() => setShowNoti(false)}
                        className="p-1 hover:bg-white/20 rounded-full transition-all duration-200"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-120 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 md:p-8 text-center text-gray-400">
                      <FaRegSmileBeam className="mx-auto mb-3 text-2xl md:text-3xl text-gray-500" />
                      <p className="text-base md:text-lg font-medium">
                        No notifications yet
                      </p>
                      <p className="text-xs md:text-sm mt-1">
                        We'll notify you when something happens
                      </p>
                    </div>
                  ) : (
                    notifications.map((noti, idx) => (
                      <div
                        key={idx}
                        className="p-3 md:p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate("/account/history")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {noti.type === "booking" ? (
                              <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-full">
                                <FaTicketAlt
                                  className="text-blue-400"
                                  size={12}
                                />
                              </div>
                            ) : noti.type === "order" ? (
                              <div className="p-1.5 md:p-2 bg-green-500/20 rounded-full">
                                <FaBoxOpen className="text-green-400" size={12} />
                              </div>
                            ) : noti.type === "combo" ? (
                              <div className="p-1.5 md:p-2 bg-purple-500/20 rounded-full">
                                <FaTicketAlt className="text-purple-400" size={12} />
                              </div>
                            ) : (
                              <div className="p-1.5 md:p-2 bg-gray-500/20 rounded-full">
                                <FaClock className="text-gray-400" size={12} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {noti.type === "booking" ? (
                                <span className="font-semibold text-blue-400 text-sm">
                                  Ticket #{noti.movieNameEnglish}
                                </span>
                              ) : noti.type === "order" ? (
                                <span className="font-semibold text-green-400 text-sm">
                                  Order #{noti.productName}
                                </span>
                              ) : noti.type === "combo" ? (
                                <span className="font-semibold text-purple-400 text-sm">
                                  {noti.movieNameEnglish} + {noti.productName}
                                </span>
                              ) : (
                                <span className="font-semibold text-gray-400 text-sm">
                                  Payment #{noti.paymentId.slice(-8)}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                                {noti.type}
                              </span>
                            </div>
                            <div
                              className="text-xs md:text-sm text-gray-200 mb-2 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: highlightStatus(noti.message),
                              }}
                            />
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaClock className="inline-block" size={10} />
                              <span>
                                {formatTimeAgo(noti.createdAt || new Date())}
                              </span>
                              {/* Hiển thị điểm nếu có */}
                              {noti.scoreValue !== undefined &&
                                noti.scoreValue !== 0 && (
                                  <span
                                    className={`
                                ml-2 px-2 py-0.5 rounded-full font-bold
                                ${
                                  noti.scoreValue > 0
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-red-600/20 text-red-400"
                                }`}
                                  >
                                    {noti.scoreValue > 0
                                      ? `+${noti.scoreValue}`
                                      : noti.scoreValue}
                                    <span className="ml-1">pts</span>
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
                    <button
                      onClick={() => navigate("/account/history")}
                      className="w-full text-center text-sm text-[#6a57f5] hover:text-[#8b5cf6] font-medium transition-all duration-200"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {user ? (
          <div className="flex items-center space-x-2">
            {user.avatar_url ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg"></div>
                <img
                  src={user.avatar_url}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-solid border-[1px] border-[#6a57f5] shadow-[#6a57f5] shadow-md hover:shadow-lg transition-all duration-300 relative z-10"
                  onClick={() => navigate("/account")}
                />
              </div>
            ) : (
              <FaUser
                size={25}
                className="cursor-pointer text-white"
                onClick={() => navigate("/account")}
              />
            )}
          </div>
        ) : (
          <div
            role="button"
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 rounded-4xl p-2 px-6 border-[#6a57f5] shadow-[#6a57f5] hover:bg-[#6957f538] shadow-md font-bold active:scale-[1.1] transition-all duration-100"
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
