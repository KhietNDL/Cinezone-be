import React, { useEffect, useState } from "react";
import { FaRegCalendarCheck, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
const AccountInformation = () => {
  const navigate = useNavigate();
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
  useEffect(() => {
    navigate("/account/personal");
  }, [navigate]);
  const handleNavigate = (path) => {
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

  //hàm xử lý click avatar
  const handleAvatarClick = () => {
    setSelectedSection("personal");
    navigate("/account/personal");
  };
  const [openIndex, setOpenIndex] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});

  const renderProfileImage = () => {
    if (!profileData.avatar_url || imageError) {
      // Hiển thị avatar mặc định (có thể là chữ cái đầu của tên)
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
    <div className="flex flex-col min-h-screen bg-blue-950 p-[20px]">
      <main className="flex w-full justify-between  p-4 md:p-8 ">
        <div className="w-[30%] bg-white rounded-2xl shadow-lg p-6 mt-10">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 cursor-pointer hover:border-purple-400 transition-colors"
              onClick={handleAvatarClick}
            >
              {renderProfileImage()}
            </div>
            <h2 className="text-xl font-bold mt-4">{profileData.fullName} </h2>
            <p className="text-gray-600"> {profileData.email}</p>
          </div>
          <div className="mt-6 space-y-4">
            {/*Nút xem hồ sơ của tôi */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "personal" ? "bg-purple-200" : "bg-gray-100"
              }`}
              onClick={() => handleNavigate("personal")}
            >
              <FaUserCircle className="text-purple-500 text-2xl" />
              <span>Information Account</span>
            </button>

            {/*Nút xem vé xem phim đã đặt trước đó */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "ticket" ? "bg-purple-200" : "bg-gray-100"
              }`}
              onClick={() => handleNavigate("ticket")}
            >
              <FaRegCalendarCheck className="text-purple-500 text-2xl" />
              <span>Vé xem phim</span>
            </button>

            {/*Nút đăng xuất tài khoản */}
            <div>
              {/* Nút đăng xuất */}
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 rounded-md hover:bg-gray-100 transition"
              >
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>

              {/* Modal đăng xuất */}
              {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-center">
                      Sign Out?
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                      Do you want to sign out?
                    </p>

                    {/* Nút hành động */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-600 transition w-1/2 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="px-4 py-2 border border-purple-950 text-white-500 rounded-md hover:bg-purple-100 transition w-1/2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300-500 mr-2"></div>
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
        {/*Ngăn cách các nút và thông tin hiênhj bên phải */}
        <div className="w-[68%] h-full overflow-y-auto rounded-2xl mt-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AccountInformation;
