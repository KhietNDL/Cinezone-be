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
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { searchMovies } from "../../../services/API";
import { slugify } from "./Slug";
import { io } from "socket.io-client";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);

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
      console.log("[FE] Received notification:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

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
      );
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
        <div className="relative">
          <FaBell
            size={24}
            className="cursor-pointer"
            onClick={() => setShowNoti((prev) => !prev)}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-2 text-xs font-bold shadow-lg animate-pulse">
              {notifications.length}
            </span>
          )}
          {showNoti && (
            <div className="absolute right-0 mt-3 w-100 bg-white text-black rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
              <div className="p-3 font-bold border-b text-lg flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-xl">
                <FaBell className="text-indigo-500" />
                Notification
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  <FaRegSmileBeam className="inline-block mr-2 text-xl text-gray-400" />
                  No notifications
                </div>
              ) : (
                notifications.map((noti, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-b last:border-b-0 flex items-start gap-3 hover:bg-indigo-50 transition-all cursor-pointer"
                    onClick={() => navigate("/account/history")}
                  >
                    <div>
                      {noti.type === "booking" && (
                        <div className="flex items-center gap-2">
                          <FaTicketAlt className="text-blue-500" />
                          <span className="font-semibold text-blue-700">
                            Ticket <b>{noti.bookingId}</b>
                          </span>
                        </div>
                      )}
                      {noti.type === "orderProduct" && (
                        <div className="flex items-center gap-2">
                          <FaBoxOpen className="text-green-500" />
                          <span className="font-semibold text-green-700">
                            Order <b>{noti.orderProductId}</b>
                          </span>
                        </div>
                      )}
                      <div
                        className="mt-1 text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: highlightStatus(noti.message),
                        }}
                      />
                      <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <FaClock className="inline-block" />
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
