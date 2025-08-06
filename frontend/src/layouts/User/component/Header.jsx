import React, { useState, useEffect, useRef } from "react";
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
  const searchInputRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [newNotiCount, setNewNotiCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchMovies({ name: query });
      if (response.data) {
        setSearchResults(response.data);
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

  // Scroll event listener for header background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change background after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMovieSelect = (MovieName) => {
    const slug = slugify(MovieName);
    navigate(`/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Function to toggle search and auto-focus
  const toggleSearch = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:4458");
    socket.emit("join", user.userId || user.UserId);
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
          `https://cinezone.info:4458/api/payment/history?memberId=${user.userId}&page=1&limit=8&sortBy=CreatedAt&sortOrder=desc`
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
            if (booking.pointEarn && booking.pointEarn > 0)
              return booking.pointEarn;
            if (booking.pointUse && booking.pointUse > 0)
              return -booking.pointUse;
            return 0;
          };

          if (booking && orderProduct) {
            // Có cả booking và orderProduct
            // Lấy tên sản phẩm từ products array
            const productName =
              orderProduct.products && orderProduct.products.length > 0
                ? orderProduct.products[0].productName
                : "Unknown Product";

            return {
              type: "combo",
              paymentId: payment.PaymentId,
              movieNameEnglish:
                booking.movieNameEnglish ||
                booking.movieNameVN ||
                "Unknown Movie",
              orderProductId: orderProduct.orderProductId,
              productName: productName,
              status: payment.Status,
              message: `${getBookingMessage(
                booking.status
              )} & ${getOrderMessage(orderProduct.status)}`,
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
              movieNameEnglish:
                booking.movieNameEnglish ||
                booking.movieNameVN ||
                "Unknown Movie",
              status: booking.status,
              message: getBookingMessage(booking.status),
              createdAt: payment.CreatedAt,
              scoreValue: getScoreValue(booking),
            };
          } else if (orderProduct) {
            // Chỉ có orderProduct
            // Lấy tên sản phẩm từ products array
            const productName =
              orderProduct.products && orderProduct.products.length > 0
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
                  movieNameEnglish:
                    b.movieNameEnglish || b.NameOfEnglish || "Unknown Movie",
                  status: b.status || b.Status,
                  message: getBookingMessage(b.status || b.Status),
                  createdAt: b.BookingDate || b.CreatedAt,
                  scoreValue:
                    (b.pointEarn || b.PointEarn || 0) -
                    (b.pointUse || b.PointUse || 0),
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
    <div
      className={`px-4 md:px-6 lg:px-8 py-3 fixed ${
        isScrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-slate-800/50"
          : "bg-black/20 "
      } text-white flex items-center justify-between select-none w-full top-0 left-0 z-50 transition-all duration-500 ease-out shadow-lg ${
        isScrolled ? "shadow-black/20" : "shadow-transparent"
      }`}
    >
      {/* Modern Logo Section */}
      <div role="button" className="flex items-center group">
        <div className="relative">
          <img
            src={logo}
            alt="CineZone Logo"
            loading="lazy"
            role="button"
            onClick={() => navigate("/")}
            className="w-[140px] md:w-[160px] lg:w-[180px] h-[60px] md:h-[70px] object-cover transition-all duration-300 ease-out group-hover:scale-105 filter drop-shadow-lg"
          />
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6a57f5]/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </div>
      </div>
      {/* Enhanced Navigation Menu */}
      <div className="hidden lg:flex items-center text-[16px] xl:text-[17px] font-semibold space-x-8 xl:space-x-10">
        <div
          onClick={() => navigate("/movies")}
          role="button"
          className="relative group cursor-pointer py-2 px-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
        >
          <span className="relative z-10 group-hover:text-[#6a57f5] transition-colors duration-300">
            Movies
          </span>
          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6a57f5] to-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </div>

        <Link
          to="/promotions"
          className="relative group cursor-pointer py-2 px-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm block text-center"
          role="button"
        >
          <span className="relative z-10 group-hover:text-[#6a57f5] transition-colors duration-300">
            Promotions
          </span>
          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6a57f5] to-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>

        <div
          onClick={() => navigate("/blog")}
          role="button"
          className="relative group cursor-pointer py-2 px-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
        >
          <span className="relative z-10 group-hover:text-[#6a57f5] transition-colors duration-300">
            News
          </span>
          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6a57f5] to-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </div>
      </div>
      {/* Modern Action Buttons */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Enhanced Search Component */}
        <div className="relative flex items-center z-10">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => {
              // Delay hiding to allow for result clicks
              setTimeout(() => {
                if (!searchQuery.trim()) {
                  setIsSearchOpen(false);
                }
              }, 200);
            }}
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out bg-slate-900/90 backdrop-blur-xl text-white border border-[#6a57f5]/50 rounded-2xl pl-4 pr-12 py-3 outline-none z-10 placeholder-gray-400 focus:border-[#6a57f5] focus:shadow-lg focus:shadow-[#6a57f5]/20 ${
              isSearchOpen
                ? "w-64 md:w-80 opacity-100 visible"
                : "w-0 opacity-0 invisible px-0 py-0 border-0"
            }`}
            style={{ minWidth: 0 }}
          />

          <button
            className="relative  p-3 bg-gradient-to-r from-[#6a57f5] to-purple-600 hover:from-[#7c6aff] hover:to-purple-700 rounded-2xl shadow-lg shadow-[#6a57f5]/30 hover:shadow-[#6a57f5]/50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 border border-[#6a57f5]/20"
            onClick={toggleSearch}
          >
            <FaSearch size={18} className="text-white" />
          </button>

          {/* Enhanced Search Results */}
          {isSearchOpen && searchQuery && searchResults.length > 0 && (
            <div className="absolute right-0 top-16 w-64 md:w-80 bg-slate-900/95 backdrop-blur-xl border border-[#6a57f5]/30 rounded-2xl shadow-2xl shadow-black/20 max-h-80 overflow-y-auto transition-all duration-300 z-30">
              <div className="p-2">
                {searchResults.map((movie) => (
                  <div
                    key={movie.MovieId}
                    className="p-3 hover:bg-[#6a57f5]/20 cursor-pointer rounded-xl text-white transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-[#6a57f5]/30"
                    onClick={() => handleMovieSelect(movie.NameOfEnglish)}
                  >
                    <div className="font-medium">
                      {movie.NameOfEnglish || movie.NameOfVietnamese}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Enhanced Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNoti((prev) => !prev)}
            className="relative p-3 bg-slate-800/80 hover:bg-[#6a57f5]/20 border border-slate-600/50 hover:border-[#6a57f5]/50 rounded-2xl shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 backdrop-blur-sm group"
          >
            <FaBell
              size={18}
              className="cursor-pointer text-gray-300 group-hover:text-[#6a57f5] transition-colors duration-300"
            />
            {newNotiCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg animate-pulse min-w-[20px] text-center leading-none">
                {newNotiCount > 99 ? "99+" : newNotiCount}
              </span>
            )}
          </button>
          {/* Enhanced Notification Popup */}
          {showNoti && (
            <>
              {/* Backdrop Overlay */}
              <div
                className="fixed inset-0 z-40 "
                onClick={() => setShowNoti(false)}
              />

              {/* Modern Notification Panel */}
              <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white rounded-3xl shadow-2xl shadow-black/40 z-50 max-h-[32rem] overflow-hidden border border-slate-700/50 animate-in slide-in-from-top-2 duration-300">
                {/* Modern Header */}
                <div className="p-5 bg-gradient-to-r from-[#6a57f5]/90 to-purple-600/90 backdrop-blur-sm rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <FaBell className="text-white" size={16} />
                      </div>
                      {newNotiCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold shadow-lg animate-pulse min-w-[18px] text-center">
                          {newNotiCount > 99 ? "99+" : newNotiCount}
                        </span>
                      )}

                      <div>
                        <h3 className="font-bold text-lg text-white">
                          Notifications
                        </h3>
                        <p className="text-white/80 text-sm">
                          Stay updated with your activities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all duration-200 backdrop-blur-sm font-medium"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={() => setShowNoti(false)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content Area */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <div className="mb-4 p-4 bg-slate-800/50 rounded-2xl inline-flex">
                        <FaRegSmileBeam className="text-3xl text-gray-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        No notifications yet
                      </h4>
                      <p className="text-sm text-gray-400">
                        We'll notify you when something happens
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-700/30">
                      {notifications.map((noti, idx) => (
                        <div
                          key={idx}
                          className="p-4 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-[#6a57f5]/50"
                          onClick={() => navigate("/account/history")}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {noti.type === "booking" ? (
                                <div className="p-2.5 bg-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                                  <FaTicketAlt
                                    className="text-blue-400"
                                    size={14}
                                  />
                                </div>
                              ) : noti.type === "order" ? (
                                <div className="p-2.5 bg-green-500/20 rounded-xl backdrop-blur-sm border border-green-500/30">
                                  <FaBoxOpen
                                    className="text-green-400"
                                    size={14}
                                  />
                                </div>
                              ) : noti.type === "combo" ? (
                                <div className="p-2.5 bg-purple-500/20 rounded-xl backdrop-blur-sm border border-purple-500/30">
                                  <FaTicketAlt
                                    className="text-purple-400"
                                    size={14}
                                  />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-gray-500/20 rounded-xl backdrop-blur-sm border border-gray-500/30">
                                  <FaClock
                                    className="text-gray-400"
                                    size={14}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {noti.type === "booking" ? (
                                  <span className="font-semibold text-blue-400 text-sm bg-blue-500/10 px-2 py-1 rounded-lg">
                                    🎬 {noti.movieNameEnglish}
                                  </span>
                                ) : noti.type === "order" ? (
                                  <span className="font-semibold text-green-400 text-sm bg-green-500/10 px-2 py-1 rounded-lg">
                                    🛍️ {noti.productName}
                                  </span>
                                ) : noti.type === "combo" ? (
                                  <span className="font-semibold text-purple-400 text-sm bg-purple-500/10 px-2 py-1 rounded-lg">
                                    🎯 {noti.movieNameEnglish} +{" "}
                                    {noti.productName}
                                  </span>
                                ) : (
                                  <span className="font-semibold text-gray-400 text-sm bg-gray-500/10 px-2 py-1 rounded-lg">
                                    💳 Payment #{noti.paymentId.slice(-8)}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 bg-slate-700/50 px-2 py-1 rounded-full capitalize">
                                  {noti.type}
                                </span>
                              </div>

                              <div
                                className="text-sm text-gray-200 mb-3 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: highlightStatus(noti.message),
                                }}
                              />

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                  <FaClock size={10} />
                                  <span>
                                    {formatTimeAgo(
                                      noti.createdAt || new Date()
                                    )}
                                  </span>
                                </div>

                                {noti.scoreValue !== undefined &&
                                  noti.scoreValue !== 0 && (
                                    <span
                                      className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                        noti.scoreValue > 0
                                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                                      }`}
                                    >
                                      {noti.scoreValue > 0
                                        ? `+${noti.scoreValue}`
                                        : noti.scoreValue}{" "}
                                      pts
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modern Footer */}
                {notifications.length > 0 && (
                  <div className="p-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/30 rounded-b-3xl">
                    <button
                      onClick={() => navigate("/account/history")}
                      className="w-full text-center text-sm text-[#6a57f5] hover:text-purple-400 font-semibold transition-all duration-300 py-2 px-4 bg-[#6a57f5]/10 hover:bg-[#6a57f5]/20 rounded-xl backdrop-blur-sm border border-[#6a57f5]/20"
                    >
                      View all notifications →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Enhanced User Profile/Auth Section */}
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
