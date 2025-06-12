import React, { useEffect, useState } from "react";
import { FaRegCalendarCheck, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AccountInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("personal");
  const { user, isLoading: authLoading } = useAuth();

  const [imageError, setImageError] = useState(false);
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
    if (currentPath.includes('/account/personal')) {
      setSelectedSection('personal');
    } else if (currentPath.includes('/account/history')) {
      setSelectedSection('history');
    }
  }, [location.pathname]);

  // Chỉ auto navigate khi đang ở route /account chính (không có sub-route)
  useEffect(() => {
    if (location.pathname === '/account' || location.pathname === '/account/') {
      navigate("/account/personal", { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleNavigate = (path) => {
    console.log(`Navigating to: /account/${path}`); // Debug log
    setSelectedSection(path);
    navigate(`/account/${path}`);
  };

  const handleRedirect = () => {
    navigate(`/`);
  };

  const handleAvatarClick = () => {
    setSelectedSection("personal");
    navigate("/account/personal");
  };

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [errors, setErrors] = useState({});

  const renderProfileImage = () => {
    if (!profileData.avatar_url || imageError) {
      const initial = profileData.fullName
        ? profileData.fullName.charAt(0).toUpperCase()
        : "?";
      return (
        <div className="w-full h-full bg-purple-400 flex items-center justify-center text-white text-4xl font-bold">
          {initial}
        </div>
      );
    }

    return (
      <img
        src={profileData.avatar_url}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-[20px] pt-[40px]">
      <main className="flex w-full justify-between p-4 md:p-8">
        <div className="w-[30%] bg-white rounded-2xl shadow-lg p-6 mt-10">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 cursor-pointer hover:border-purple-400 transition-colors"
              onClick={handleAvatarClick}
            >
              {renderProfileImage()}
            </div>
            <h2 className="text-xl font-bold mt-4">{profileData.fullName}</h2>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
          
          <div className="mt-6 space-y-4">
            {/* Nút Information Account */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg transition-colors ${
                selectedSection === "personal" ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleNavigate("personal")}
            >
              <FaUserCircle className="text-purple-500 text-2xl" />
              <span>Information Account</span>
            </button>

            {/* Nút History */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg transition-colors ${
                selectedSection === "history" ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"
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
                className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 rounded-md hover:bg-gray-100 transition"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
              
              {/* Modal đăng xuất */}
              {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                   
                    <p className="text-gray-600 text-center mt-2">
                      You want log out ?
                    </p>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition w-1/2 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          console.log("Đăng xuất...");
                          localStorage.removeItem("token");
                          localStorage.removeItem("expiration");
                          localStorage.clear();
                          setIsOpen(false);
                          handleRedirect();
                        }}
                        className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-100 transition w-1/2 ml-2"
                      >
                        Log Out
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