import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaCircleUser, FaXmark } from "react-icons/fa6";
import { MdAccountCircle, MdOutlineLogout } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";

const HeaderStaff = () => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full px-[20px] justify-between items-center bg-gradient-to-r from-[#6466F1] via-[#8B5CF6] to-[#4F46E5] text-white">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/staff");
          }}
          className="w-[140px] h-[70px] object-cover p-0"
        />
      </div>

      <div className="flex items-center justify-end space-x-8">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center bg-transparent rounded-4xl cursor-pointer group"
              onClick={toggleDropdown}
            >
              <div className="flex items-center bg-white rounded-4xl ">
                <div className="text-3xl flex items-center justify-end p-[1px]">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Staff Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <MdAccountCircle className="text-[#604CE9] group-hover:text-[#5038E9]" />
                  )}
                </div>
               
                <p className="max-w-full px-2 font-semibold text-[#604CE9] rounded-2xl">
                  {user.fullName || user.FullName || "Staff"}
                </p>
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-300 rounded-full shadow-lg z-10">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="cursor-pointer rounded-full w-full text-left px-4 py-2 text-sm text-red-500
                     hover:bg-red-500 hover:text-white flex items-center gap-1 font-semibold ring-2 ring-red-500"
                >
                  <MdOutlineLogout className="text-xl" />
                  Sign Out
                </button>

              </div>
            )}
          </div>
        ) : (
          <div
            role="button"
            onClick={() => {
              navigate("/login");
            }}
            className="group flex items-center bg-transparent border-2 rounded-4xl border-white hover:bg-white hover:text-[#5B4BE9]
             font-bold active:scale-[1.1] transition-all duration-100 overflow-hidden"
          >
            <div className="text-3xl flex items-center justify-end transform transition-transform duration-500 group-hover:-translate-x-2 
            group-hover:w-[40px] p-[1px]">
              <FaCircleUser />
            </div>
            <p className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] group-hover:w-[60px] font-semibold transition-all
             duration-500 whitespace-nowrap">
              Sign In
            </p>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className=" font-semibold text-center text-black text-2xl">
              Sign Out?
            </h2>
            <p className="text-gray-600 text-center text-lg mt-2">
              Do you want to sign out?
            </p>

            <div className="flex justify-between mt-6 gap-4">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-white hover:text-purple-600 
                border-2 border-purple-600 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sign out...
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <MdOutlineLogout className="text-xl" /> Sign Out
                    </div>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 border-2 border-red-600 text-red-600 bg-white rounded-md hover:bg-red-600 hover:text-white
                 transition w-1/2  disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-1"
              >
                <FaXmark className="text-xl" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderStaff;