import React, { useEffect, useState } from "react";
import {
  FaRegCalendarCheck,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AccountInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [fileList, setFileList] = useState([]);
  const { signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [profileData, setProfileData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    sex: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      const profileInfo = {
        fullName: user.FullName || "",
        dateOfBirth: user.DateOfBirth || "",
        phoneNumber: user.PhoneNumber || "",
        sex: user.Sex || "",
        email: user.Email || "",
        avatar_url: user.avatar_url || "",
      };

      setProfileData(profileInfo);
      if (user.avatar_url) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image.png",
            status: "done",
            url: user.avatar_url,
          },
        ]);
      }
    }
  }, [user]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/account/personal")) {
      setSelectedSection("personal");
    } else if (currentPath.includes("/account/history")) {
      setSelectedSection("history");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/account" || location.pathname === "/account/") {
      navigate("/account/personal", { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleNavigate = (path) => {
    console.log(`Navigating to: /account/${path}`);
    setSelectedSection(path);
    navigate(`/account/${path}`);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      setIsOpen(false);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-4 sm:p-5">
      <div className="lg:hidden absolute mt-20 top-5 left-4 z-20">
        <button
          onClick={toggleSidebar}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-all"
        >
          <FaBars size={20} />
        </button>
      </div>
      <div className="flex flex-col lg:flex-row w-full mt-35 lg:mt-22 gap-4 lg:gap-8">
        <div
          className={`fixed lg:static inset-y-0 left-0 z-60 lg:z-40 lg:w-[30%] md:w-[50%] w-full  bg-white md:rounded-2xl shadow-lg p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col`}
        >
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            <div
              role="button"
              className={`w-full flex items-center space-x-2 text-left px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                selectedSection === "personal"
                  ? "bg-purple-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleNavigate("personal")}
            >
              <FaUserCircle className="text-purple-500 text-xl sm:text-2xl flex-shrink-0" />
              <span className="truncate">Information Account</span>
            </div>
            <div
              role="button"
              className={`w-full flex items-center space-x-2 text-left px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                selectedSection === "history"
                  ? "bg-purple-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleNavigate("history")}
            >
              <FaRegCalendarCheck className="text-purple-500 text-xl sm:text-2xl flex-shrink-0" />
              <span className="truncate">History</span>
            </div>
            <div>
              <div
                role="button"
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 rounded-md transition hover:bg-rose-50 text-sm sm:text-base"
              >
                <FaSignOutAlt className="flex-shrink-0" />
                <span className="truncate">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-center">Sign Out?</h2>
              <p className="text-gray-600 text-center mt-2">
                Do you want to sign out?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 cursor-pointer border border-purple-600 text-purple-600 bg-white rounded-md hover:bg-purple-50 transition w-full sm:w-1/2 sm:mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 cursor-pointer py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition w-full sm:w-1/2 sm:ml-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sign out...
                    </>
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {isSidebarOpen && <div className="" onClick={toggleSidebar}></div>}
        <div className="flex-1 lg:w-[68%] bg-white rounded-2xl shadow-lg overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
