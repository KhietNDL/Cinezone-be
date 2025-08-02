import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaCircleUser, FaXmark, FaBars } from "react-icons/fa6";
import { MdAccountCircle, MdOutlineLogout } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";

const HeaderAdmin = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error when Sign out:", error);
      setIsDropdownOpen(false);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full px-3 sm:px-6 py-2 sm:py-3 justify-between items-center bg-gradient-to-r from-[#6466F1] via-[#8B5CF6] to-[#4F46E5] shadow-md border-b border-gray-200">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 mr-2 sm:mr-3"
          aria-label="Toggle sidebar"
        >
          <FaBars size={18} className="text-white sm:text-xl" />
        </button>

        <div role="button" className="flex items-center group">
          <img
            src={logo}
            alt="Logo"
            loading="lazy"
            role="button"
            onClick={() => {
              navigate("/admin/dashboard");
            }}
            className="w-[80px] h-[40px] sm:w-[100px] sm:h-[50px] md:w-[140px] md:h-[70px] object-cover"
          />
          <div className="ml-2 sm:ml-4 hidden md:block">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Cinema Management System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 sm:space-x-6">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-all duration-200 group border border-gray-200 hover:border-gray-300"
              onClick={toggleDropdown}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <MdAccountCircle className="text-white text-xl sm:text-2xl" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors truncate max-w-24 sm:max-w-32">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  Admin
                </p>
              </div>
              <div className="hidden sm:block">
                <svg
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
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
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 sm:w-64 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Admin Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <MdAccountCircle className="text-white text-xl sm:text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {user?.fullName || "Admin"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Administrator
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-1 sm:py-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                  >
                    <FaRegIdCard className="w-4 h-4 mr-2 sm:mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium">Profile Settings</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 sm:mr-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        <span className="font-medium">Signing out...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineLogout className="w-4 h-4 mr-2 sm:mr-3 text-red-500 group-hover:text-red-600 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate("/admin/login")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base font-medium"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderAdmin;
