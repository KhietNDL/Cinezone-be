import React, { useState } from "react";
import logo from "../../../assets/logoWeb.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../services/API";

// Hàm logout đã được import từ authService

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Thêm setUser để clear user data
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();

      // Clear user data từ context
      setUser(null);

      // Redirect về trang login
      navigate("/login");

      // Có thể thêm toast notification
      console.log("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex select-none p-2 w-full px-[20px] justify-between items-center bg-white">
      <div role="button" className="flex w-[20%] items-center">
        <img
          src={logo}
          alt=""
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/admin/dashboard");
          }}
          className=" w-[140px] h-[70px] object-cover"
        />
      </div>

      <div className="flex items-center justify-end w-[20%] space-x-8">
        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="border-[1px] border-solid border-amber-500 rounded-full w-[40px] h-[40px]">
              <img
                src={
                  user?.avatar_url ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="avatar"
                loading="lazy"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[15px] truncate">{user?.fullName}</p>
              <p className="text-[15px] text-slate-400">Admin</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute left-0 mt-3 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="group flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md mx-2"
                >
                  <div className="flex items-center space-x-2">
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        <span>Đang đăng xuất...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Đăng xuất</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default HeaderAdmin;
