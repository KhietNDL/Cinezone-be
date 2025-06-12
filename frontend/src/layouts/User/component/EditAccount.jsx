import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateAccount } from "../../../services/API";
import { useAuth } from "../../../context/AuthContext"; // Import useAuth

const EditAccount = () => {
  const { user, isLoading: authLoading } = useAuth(); // Lấy user từ AuthContext

  const [profileData, setProfileData] = useState({
    fullName: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
    sex: "",
    email: "",
    cccd: "",
    address: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
    sex: "",
    email: "",
    cccd: "",
    address: "",
    avatar_url: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Image upload state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  // Effect để set profile data từ user context
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
      setEditData(profileInfo);

      // Initialize fileList if avatar_url exists
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Update editData.avatar_url when a file is uploaded successfully
    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1];

      if (lastFile.status === "done" && lastFile.response) {
        // If the upload API returns an image URL
        if (lastFile.response.url) {
          setEditData((prev) => ({
            ...prev,
            avatar_url: lastFile.response.url,
          }));
        }
      } else if (lastFile.status === "done" && lastFile.url) {
        // If file already has URL (like when we initialize from existing profile)
        setEditData((prev) => ({
          ...prev,
          avatar_url: lastFile.url,
        }));
      } else if (lastFile.originFileObj) {
        // For local preview before upload completes
        getBase64(lastFile.originFileObj).then((base64Url) => {
          setEditData((prev) => ({
            ...prev,
            avatar_url: base64Url,
          }));
        });
      }
    } else {
      // No files, clear the avatar_url
      setEditData((prev) => ({
        ...prev,
        avatar_url: "",
      }));
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edit data and fileList to original values
    setEditData({ ...profileData });

    // Reset fileList to match the profile image
    if (profileData.avatar_url) {
      setFileList([
        {
          uid: "-1",
          name: "profile-image.png",
          status: "done",
          url: profileData.avatar_url,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);

      // Gọi API để cập nhật thông tin
      const response = await updateAccount(editData);

      if (response && response.isSuccess) {
        // Cập nhật state với dữ liệu mới
        setProfileData({ ...editData });
        toast.success(response.message || "Thông tin hồ sơ đã được cập nhật");
        setIsEditing(false);

        // TODO: Có thể cần cập nhật lại user trong AuthContext
        // Bạn có thể thêm method updateUser trong AuthContext
      } else {
        // Xử lý lỗi
        toast.error(
          response.errorMessage || "Không thể cập nhật thông tin hồ sơ"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast.error("Không thể cập nhật thông tin hồ sơ");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Render hình ảnh mặc định hoặc avatar người dùng
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

  // Custom request handler for Upload component
  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    try {
      // Here you would normally upload to your server
      // For now, we'll simulate a successful upload and use FileReader for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result;

        // Update the avatar_url in editData
        setEditData((prev) => ({
          ...prev,
          avatar_url: base64Url,
        }));

        // Call onSuccess to update the Upload component's internal state
        onSuccess({ url: base64Url }, file);
      };
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    }
  };

  // Hiển thị loading khi AuthContext đang loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-purple-200">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <div>
              <h3 className="text-xl font-semibold text-purple-700">
                Đang tải thông tin
              </h3>
              <p className="text-purple-500">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu chưa có user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-purple-200 text-center">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">
            Không tìm thấy thông tin người dùng
          </h3>
          <p className="text-purple-500">Vui lòng đăng nhập lại</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header với gradient đẹp */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-purple-300/30">
                  {renderProfileImage()}
                </div>
                {/* Indicator online */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profileData.fullName || "Người dùng"}
                </h1>
                <p className="text-purple-100 text-lg">
                  {profileData.email || "Chưa cập nhật email"}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={handleEditProfile}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
          {!isEditing ? (
            /* Hiển thị thông tin với thiết kế card đẹp */
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Thông tin cá nhân
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Họ tên:
                      </span>
                      <span className="text-gray-700">
                        {profileData.fullName || "Chưa được cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Ngày sinh:
                      </span>
                      <span className="text-gray-700">
                        {profileData.dateOfBirth || "Chưa được cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Giới tính:
                      </span>
                      <span className="text-gray-700">
                        {profileData.sex === 1
                          ? "Nữ"
                          : profileData.sex === 2
                          ? "Nam"
                          : profileData.sex === 3
                          ? "Khác"
                          : "Chưa được cập nhật"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 w-32">
                        Email:
                      </span>
                      <span className="text-gray-700">
                        {profileData.email || "Chưa được cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 w-32">
                        Điện thoại:
                      </span>
                      <span className="text-gray-700">
                        {profileData.phoneNumber || "Chưa được cập nhật"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form chỉnh sửa với thiết kế hiện đại */
            <div className="p-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-800 mb-8 flex items-center">
                  <svg
                    className="w-7 h-7 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh sửa thông tin
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Họ tên đầy đủ
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Nhập họ tên đầy đủ"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Nhập số điện thoại"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Giới tính
                      </label>
                      <select
                        name="sex"
                        value={editData.sex}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        disabled={updateLoading}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        CCCD
                      </label>
                      <input
                        type="text"
                        name="cccd"
                        value={editData.cccd}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Nhập số CCCD"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Địa chỉ
                      </label>
                      <textarea
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm resize-none"
                        placeholder="Nhập địa chỉ"
                        disabled={updateLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2">
                      Ảnh đại diện
                    </label>
                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        customRequest={customUploadRequest}
                        maxCount={1}
                        className="purple-upload w-full"
                      >
                        {fileList.length >= 1 ? null : (
                          <div className="text-center p-4">
                            <svg
                              className="w-12 h-12 mx-auto text-purple-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <p className="text-purple-600 font-medium">
                              Tải ảnh lên
                            </p>
                            <p className="text-purple-400 text-sm">
                              PNG, JPG tối đa 5MB
                            </p>
                          </div>
                        )}
                      </Upload>
                    </div>
                    {previewImage && (
                      <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                      />
                    )}
                  </div>
                </div>

                {/* Action buttons với hiệu ứng đẹp */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-purple-200">
                  <button
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className={`px-8 py-3 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center ${
                      updateLoading
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    }`}
                    onClick={handleSaveProfile}
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
