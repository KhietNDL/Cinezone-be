import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateAccount } from "../../../services/API";
import { useAuth } from "../../../context/AuthContext";

const EditAccount = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState({
    id: "", // Thêm id vào state
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
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (user) {
      console.log("User Information", user);
      const profileInfo = {
        id: user.UserId,
        fullName: user.FullName,
        dateOfBirth: user.DateOfBirth,
        phoneNumber: user.PhoneNumber,
        sex: user.Sex,
        email: user.Email,
        cccd: user.cccd || "",
        address: user.Address || user.address || "",
        avatar_url: user.avatar_url || user.Avatar_url || "",
        password: "",
      };

      console.log("Profile Info:", profileInfo);

      setProfileData(profileInfo);
      setEditData(profileInfo);
      if (profileInfo.avatar_url) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image.png",
            status: "done",
            url: profileInfo.avatar_url,
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

    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1];

      if (lastFile.status === "done" && lastFile.response) {
        if (lastFile.response.url) {
          setEditData((prev) => ({
            ...prev,
            avatar_url: lastFile.response.url,
          }));
        }
      } else if (lastFile.status === "done" && lastFile.url) {
        setEditData((prev) => ({
          ...prev,
          avatar_url: lastFile.url,
        }));
      } else if (lastFile.originFileObj) {
        getBase64(lastFile.originFileObj).then((base64Url) => {
          setEditData((prev) => ({
            ...prev,
            avatar_url: base64Url,
          }));
        });
      }
    } else {
      setEditData((prev) => ({
        ...prev,
        avatar_url: "",
      }));
    }
  };

  // eslint-disable-next-line no-unused-vars
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
    setEditData({ ...profileData });

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

      // Validate required fields
      if (!editData.id) {
        toast.error("User ID is missing. Please try logging in again.");
        return;
      }
      const updateData = {
        ...editData,
        ...(editData.password && editData.password.trim() !== ""
          ? { password: editData.password }
          : {}),
      };

      console.log("Data being sent to API:", updateData);

      const response = await updateAccount(updateData);

      console.log("API Response:", response);

      if (response && response.isSuccess) {
        setProfileData({ ...editData });
        toast.success(
          response.message || "Profile information has been updated"
        );
        setIsEditing(false);
      } else {
        const errorMessage =
          response?.errorMessage ||
          response?.message ||
          "Unable to update profile information";
        toast.error(errorMessage);
        console.error("API Error:", response);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Error Response:", error.response.data);
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        console.error("Network Error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
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

  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result;

        setEditData((prev) => ({
          ...prev,
          avatar_url: base64Url,
        }));

        onSuccess({ url: base64Url }, file);
      };
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-purple-200">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <div>
              <h3 className="text-xl font-semibold text-purple-700">
                Loading Information
              </h3>
              <p className="text-purple-500">Please wait a moment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-purple-200 text-center">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">
            User information not found
          </h3>
          <p className="text-purple-500">Please log in again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen min-h-[500px]  bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50">
      <div className="w-full ">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-purple-300/30">
                  {renderProfileImage()}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profileData.fullName || "User"}
                </h1>
                <p className="text-purple-100 text-lg">
                  {profileData.email || "Email not updated"}
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
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white h-full rounded-b-2xl ">
          {!isEditing ? (
            /* Display information */
            <div className="p-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
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
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Full Name:
                      </span>
                      <span className="text-gray-700">
                        {profileData.fullName || "Not updated"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Date of Birth:
                      </span>
                      <span className="text-gray-700">
                        {profileData.dateOfBirth
                          ? new Date(
                              profileData.dateOfBirth
                            ).toLocaleDateString("en-US")
                          : "Not updated"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 w-32">
                        Gender:
                      </span>
                      <span className="text-gray-700">
                        {profileData.sex === 1
                          ? "Female"
                          : profileData.sex === 2
                          ? "Male"
                          : profileData.sex === 3
                          ? "Other"
                          : "Not updated"}
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
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 w-32">
                        Email:
                      </span>
                      <span className="text-gray-700">
                        {profileData.email || "Not updated"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 w-32">
                        Phone Number:
                      </span>
                      <span className="text-gray-700">
                        {profileData.phoneNumber || "Not updated"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="p-8 overscroll-y-auto h-full">
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
                  Edit Profile Information
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter full name"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter email address"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter phone number"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Date of Birth
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
                        Gender
                      </label>
                      <select
                        name="sex"
                        value={editData.sex}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        disabled={updateLoading}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={editData.password}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter new password (leave blank to keep current)"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        CCCD (ID Number)
                      </label>
                      <input
                        type="text"
                        name="cccd"
                        value={editData.cccd}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter ID number"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm resize-none"
                        placeholder="Enter address"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Profile Picture
                      </label>
                      <div>
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
                                Upload Image
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
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-purple-200">
                  <button
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                  >
                    Cancel
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
                        Saving...
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
                        Save Changes
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
