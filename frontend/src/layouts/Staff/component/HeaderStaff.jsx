import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaCircleUser, FaXmark, FaBars } from "react-icons/fa6";
import { MdAccountCircle, MdOutlineLogout } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";

const HeaderStaff = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error when Sign out:", error);
      setIsOpen(false);
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
              navigate("/staff");
            }}
            className="w-[80px] h-[40px] sm:w-[100px] sm:h-[50px] md:w-[140px] md:h-[70px] object-cover"
          />
          <div className="ml-2 sm:ml-4 hidden md:block">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Staff Portal
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
              className="flex items-center space-x-2 sm:space-x-3 md:bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-all duration-200 group md:border md:border-gray-200 hover:border-gray-300"
              onClick={toggleDropdown}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Staff Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <MdAccountCircle className="text-white text-xl sm:text-2xl" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              <div className="hidden sm:flex sm:flex-col">
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {user.fullName || user.FullName || "Staff"}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Staff Member
                </p>
              </div>

              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180 hidden sm:block"
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

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 lg:w-full md:w-[200px] w-[150px] bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-xl z-10 overflow-hidden">
                <div className="">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {user.fullName || user.FullName || "Staff"}
                    </p>
                    <p className="text-xs text-gray-500">Staff Member</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 sm:gap-3 font-medium transition-colors duration-200 cursor-pointer hover:text-red-700"
                  >
                    <MdOutlineLogout className="text-base sm:text-lg" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            role="button"
            onClick={() => {
              navigate("/login");
            }}
            className="group flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="text-lg sm:text-2xl mr-1 sm:mr-2">
              <FaCircleUser />
            </div>
            <span className="hidden sm:inline">Sign In</span>
            <span className="sm:hidden">Login</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999] p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-4 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                <MdOutlineLogout className="text-xl sm:text-2xl" />
                Confirm Sign Out
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                  <MdOutlineLogout className="text-purple-600 text-2xl sm:text-3xl" />
                </div>
              </div>

              <p className="text-gray-700 text-center text-base sm:text-lg mb-2 font-semibold">
                Are you sure you want to sign out?
              </p>
              <p className="text-gray-500 text-center text-sm mb-4 sm:mb-6">
                You will need to sign in again to access the staff portal.
              </p>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <FaXmark className="text-base" />
                  Cancel
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineLogout className="text-base" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderStaff;
