import React, { useState } from "react";
import logo from "../../../assets/logoWeb.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Menu, X } from "lucide-react";

const HeaderAdmin = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="flex select-none p-2 w-full px-4 md:px-[20px] justify-between items-center bg-white shadow-sm">
      {/* Left Section - Logo and Mobile Menu */}
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2 z-50"
        >
          {isSidebarOpen ? (
            <X size={24} data-testid="lucide-x" />
          ) : (
            <Menu size={24} data-testid="lucide-menu" />
          )}
        </button>

        {/* Logo */}
        <div role="button" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            loading="lazy"
            role="button"
            onClick={() => {
              navigate("/admin/dashboard");
            }}
            className="w-[100px] h-[50px] md:w-[140px] md:h-[70px] object-cover"
          />
        </div>
      </div>

      {/* Right Section - User Profile */}
      <div className="flex items-center justify-end space-x-2 md:space-x-8">
        <div className="relative">
          <div
            className="flex items-center space-x-1 md:space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 md:p-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            onClick={toggleDropdown}
            data-testid="profile-trigger"
          >
            <div className="border-[1px] border-solid border-amber-500 rounded-full w-[32px] h-[32px] md:w-[40px] md:h-[40px] ring-2 ring-transparent hover:ring-amber-200 transition-all duration-300">
              <img
                src={user?.avatar_url}
                alt="avatar"
                loading="lazy"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="font-bold text-[13px] md:text-[15px] truncate text-gray-800 max-w-[100px] md:max-w-none">
                {user?.fullName}
              </p>
              <p className="text-[11px] md:text-[13px] text-slate-500 font-medium">
                Admin
              </p>
            </div>
            {/* Dropdown Arrow */}
            <svg
              className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                showDropdown ? "rotate-180" : "rotate-0"
              } hidden sm:block`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          <div
            data-testid="dropdown-menu"
            className={`absolute right-0 mt-2 w-48 md:w-58 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transition-all duration-300 ease-out transform origin-top ${
              showDropdown
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="py-2 w-full">
              {/* Mobile - Show user info in dropdown */}
              <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                <p className="font-bold text-[14px] text-gray-800 truncate">
                  {user?.fullName}
                </p>
                <p className="text-[12px] text-slate-500 font-medium">Admin</p>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                <div className="flex items-center space-x-3 w-full">
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                      <span className="animate-pulse">Logging out...</span>
                    </>
                  ) : (
                    <div role="button" className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200"
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
                      <span>Logout</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300"
          onClick={() => setShowDropdown(false)}
          role="presentation"
        />
      )}
    </div>
  );
};

export default HeaderAdmin;
