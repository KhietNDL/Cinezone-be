import React, { useEffect, useState } from "react";
import { FaRegCalendarCheck, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
const AccountInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [fileList, setFileList] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const { setUser, signOut } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("personal");
  // eslint-disable-next-line no-unused-vars
  const { user, isLoading: authLoading } = useAuth(); // Lấy user từ AuthContext

  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Thông tin", user);
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

  // Cập nhật selectedSection dựa trên URL hiện tại
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/account/personal")) {
      setSelectedSection("personal");
    } else if (currentPath.includes("/account/history")) {
      setSelectedSection("history");
    }
  }, [location.pathname]);

  // Chỉ auto navigate khi đang ở route /account chính (không có sub-route)
  useEffect(() => {
    if (location.pathname === "/account" || location.pathname === "/account/") {
      navigate("/account/personal", { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleNavigate = (path) => {
    console.log(`Navigating to: /account/${path}`); // Debug log
    setSelectedSection(path);
    navigate(`/account/${path}`);
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

  const [openIndex, setOpenIndex] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-[20px] pt-[40px]">
      <main className="flex w-full justify-between p-4 md:p-8">
        <div className="w-[30%] bg-white rounded-2xl shadow-lg p-6 mt-10">
          <div className="mt-6 space-y-4">
            {/* Nút Information Account */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg transition-colors ${
                selectedSection === "personal"
                  ? "bg-purple-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleNavigate("personal")}
            >
              <FaUserCircle className="text-purple-500 text-2xl" />
              <span>Information Account</span>
            </button>

            {/* Nút History */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg transition-colors ${
                selectedSection === "history"
                  ? "bg-purple-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleNavigate("history")}
            >
              <FaRegCalendarCheck className="text-purple-500 text-2xl" />
              <span>History</span>
            </button>

            {/* Nút đăng xuất */}
            <div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 rounded-md transition hover:bg-rose-50"
              >
                <FaSignOutAlt />

                <span>Sign Out</span>
              </button>

              {/* Modal đăng xuất */}
              {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-center">
                      Sign Out?
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                      Do you want to sign out?
                    </p>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="px-4 py-2 border border-purple-600 text-purple-600 bg-white rounded-md hover:bg-purple-50 transition w-1/2 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition w-1/2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="w-[68%] h-full overflow-y-auto rounded-2xl mt-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AccountInformation;
