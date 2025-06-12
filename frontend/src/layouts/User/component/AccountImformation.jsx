import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { FaRegCalendarCheck, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

import { Outlet, useNavigate } from "react-router-dom";

const AccountInformation = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);

  const [imageError, setImageError] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    imgUrl: "",
  });
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    imgUrl: "",
  });

  const fetchProfile = async () => {
    // try {
    //   setLoading(true);
    //   // const response = await getProfile();
    //   console.log("Profile response:", response);
    //   if (response && response.isSuccess && response.result) {
    //     const data = response.result;
    //     console.log("Profile response:", data);
    //     const profileInfo = {
    //       firstName: data.firstName || "",
    //       lastName: data.lastName || "",
    //       phoneNumber: data.phoneNumber || "",
    //       email: data.email || "",
    //       imgUrl: data.imgUrl || "",
    //     };
    //     setProfileData(profileInfo);
    //     setEditData(profileInfo);
    //     // Initialize fileList if imgUrl exists
    //     if (data.imgUrl) {
    //       setFileList([
    //         {
    //           uid: "-1",
    //           name: "profile-image.png",
    //           status: "done",
    //           url: data.imgUrl,
    //         },
    //       ]);
    //     }
    //   } else {
    //     if (response && response.errorMessage) {
    //       toast.error(response.errorMessage);
    //     } else {
    //       toast.error("Không thể tải thông tin hồ sơ");
    //     }
    //   }
    // } catch (error) {
    //   toast.error("Không thể tải thông tin hồ sơ");
    //   console.error("Lỗi khi tải hồ sơ:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  // useEffect(() => {
  //   fetchProfile();
  //   setSelectedSubSection(null);
  // }, [selectedSection]);

  {
    /*Các thông tin về Chi tiết thông tin của tôi */
  }
  // const [personalInfo, setPersonalInfo] = useState({
  //   fullname: "Nguyễn Thị Hồng Ngọc",

  //   email: "nguyenngocdh04@gmail.com",

  //   profileImage: "https://nguoinoitieng.tv/images/nnt/105/0/bibl.jpg",
  // });
  {
    /*Chi tiết thông tin về sức khỏe */
  }
  const handleNavigate = (path) => {
    setSelectedSection(path);
    navigate(`/account/${path}`);
  };
  const handleRedirect = (path) => {
    setSelectedSection(path);
    navigate(`/`);
  };

  {
    /*hai cái này là của trợ giúp */
  }
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  {
    /*Phần về thiết lập tài khoản */
  }
  {
    /*đặt lại mật khẩu */
  }
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const fullname = profileData.firstName + " " + profileData.lastName;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const validatePassword = (password) => {
    if (password.length < 8) return "Độ dài tối thiểu là 8 ký tự";
    if (!/[A-Z]/.test(password)) return "Phải có ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(password)) return "Phải có ít nhất 1 chữ thường";
    if (!/[0-9]/.test(password)) return "Phải có ít nhất 1 số";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Phải có ít nhất 1 ký tự đặc biệt";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };

    if (name === "password") {
      newErrors.password = validatePassword(value);
    }

    if (name === "confirmPassword") {
      newErrors.confirmPassword =
        value !== formData.password ? "Mật khẩu xác nhận không khớp" : "";
    }

    setErrors(newErrors);
  };

  const renderProfileImage = () => {
    if (!profileData.imgUrl || imageError) {
      // Hiển thị avatar mặc định (có thể là chữ cái đầu của tên)
      const initial = fullname ? fullname.charAt(0).toUpperCase() : "?";
      return (
        <div className="w-full h-full bg-purple-300 flex items-center justify-center text-white text-4xl font-bold">
          {initial}
        </div>
      );
    }

    return (
      <img
        src={profileData.imgUrl}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-blue-950">
      <main className="flex flex-grow p-4 md:p-8 mt-[80px]">
        {/*do header fixed cứng nên này tôi phải đẩy nó xuống 80px nếu không nó bị header bị che  */}
        <div className="w-1/4 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200">
              {renderProfileImage()}
            </div>
            <h2 className="text-xl font-bold mt-4">{fullname} </h2>
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
              <span>Hồ sơ của tôi</span>
            </button>

            {/*Nút lịch sư khám bệnh ở đây sẽ thể hiện các lịch hẹn khám sắp tới */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "calendar" ? "bg-purple-200" : "bg-gray-100"
              }`}
              onClick={() => handleNavigate("calendar")}
            >
              <FaRegCalendarCheck className="text-purple-500 text-2xl" />
              <span>Lịch sử lịch hẹn</span>
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-center">
                      Đăng xuất?
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                      Bạn có chắc chắn muốn đăng xuất?
                    </p>

                    {/* Nút hành động */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition w-1/2 mr-2"
                      >
                        Hủy
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
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*Ngăn cách các nút và thông tin hiênhj bên phải */}
        <div className="w-3/4 p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {selectedSection === "personal" && <Outlet />}

          {selectedSection === "calendar" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Lịch hẹn khám
              </h2>
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountInformation;
