import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { updateAccount } from "../../../services/API";
import { useAuth } from "../../../context/AuthContext";

const EditAccount = () => {
  const { user, isLoading: authLoading, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    sex: "",
    email: "",
    cccd: "",
    address: "",
    avatar: "",
  });
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    sex: "",
    email: "",
    cccd: "",
    address: "",
    avatar: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      const profileInfo = {
        id: user.userId,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
        sex: user.sex,
        email: user.email,
        cccd: user.cccd,
        address: user.address,
        avatar: user.avatar_url,
      };
      setProfileData(profileInfo);
      setEditData(profileInfo);
      setCurrentAvatarUrl(profileInfo.avatar || "");
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setNewAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
    setNewAvatarFile(null);
    setCurrentAvatarUrl(profileData.avatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      if (!editData.id) {
        toast.error("User ID is missing. Please try logging in again.");
        return;
      }
      const requiredFields = ["fullName", "email"];
      const missingFields = requiredFields.filter(
        (field) => !editData[field]?.trim()
      );
      if (missingFields.length > 0) {
        toast.error(
          `Please fill in required fields: ${missingFields.join(", ")}`
        );
        return;
      }
      const formData = new FormData();
      formData.append("fullName", editData.fullName.trim());
      const dateOfBirth = editData.dateOfBirth || profileData.dateOfBirth;
      if (dateOfBirth) {
        const formattedDate = new Date(dateOfBirth).toISOString().split("T")[0];
        formData.append("dateOfBirth", formattedDate);
      }
      formData.append("phoneNumber", editData.phoneNumber.trim());
      formData.append("sex", editData.sex || profileData.sex || "");
      formData.append("email", (editData.email || "").trim());
      formData.append("cccd", (editData.cccd || "").trim());
      formData.append("address", (editData.address || "").trim());
      if (newAvatarFile) {
        formData.append("avatar", newAvatarFile);
      } else if (profileData.avatar && currentAvatarUrl) {
        formData.append("avatar", profileData.avatar);
      }
      const response = await updateAccount(editData.id, formData);
      if (
        response &&
        (response.success === true ||
          response.message?.toLowerCase().includes("success") ||
          response.status === "success")
      ) {
        const updatedData = {
          ...profileData,
          ...editData,
          avatar_url: response.user?.avatar_url,
        };
        setProfileData(updatedData);
        setUser((prev) => ({
          ...prev,
          ...updatedData,
          userId: prev.userId,
        }));
        if (response.user?.avatar_url) {
          const newAvatarUrl = response.user?.avatar_url;
          setCurrentAvatarUrl(newAvatarUrl);
        }
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setNewAvatarFile(null);
        setImageError(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderProfileImage = () => {
    if (!currentAvatarUrl || imageError) {
      const initial = profileData.fullName
        ? profileData.fullName.charAt(0).toUpperCase()
        : "?";
      return (
        <div className="w-full h-full bg-purple-400 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
          {initial}
        </div>
      );
    }

    return (
      <img
        src={currentAvatarUrl}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-200 max-w-md w-full">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-600 border-t-transparent"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-purple-700">
                Loading Information
              </h3>
              <p className="text-sm sm:text-base text-purple-500">
                Please wait a moment....
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-200 text-center max-w-md w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-purple-700 mb-2">
            User information not found
          </h3>
          <p className="text-sm sm:text-base text-purple-500">
            Please log in again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50">
      <div className="w-full h-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 text-center sm:text-left">
              <div className="relative mb-4 sm:mb-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-purple-300/30">
                  {renderProfileImage()}
                </div>
                {/* <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 sm:border-3 border-white"></div> */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-gray-50 text-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-200 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    title="Change avatar"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                  {profileData.fullName}
                </h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg break-all sm:break-normal">
                  {profileData.email}
                </p>
              </div>
            </div>

            {!isEditing && (
              <div
                role="button"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                onClick={handleEditProfile}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Content area */}
        <div className="bg-white h-full rounded-b-2xl overflow-hidden">
          {!isEditing ? (
            <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 h-full">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
                  <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
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
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Full Name:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base break-words">
                        {profileData.fullName || "Not updated"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Address:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base break-words">
                        {profileData.address || "Not updated"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Date of Birth:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {profileData.dateOfBirth
                          ? new Date(
                              profileData.dateOfBirth
                            ).toLocaleDateString("en-US")
                          : "Not updated"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-purple-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Gender:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">
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
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-indigo-100">
                  <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
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
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Email:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base break-all sm:break-words">
                        {profileData.email || "Not updated"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        Phone Number:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {profileData.phoneNumber || "Not updated"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-indigo-700 flex-shrink-0 mr-0 sm:mr-2 mb-1 sm:mb-0 text-sm sm:text-base">
                        CCCD:
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {profileData.cccd || "Not updated"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-full">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-purple-200">
                <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-6 sm:mb-8 flex items-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 mr-1 sm:mr-2"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base"
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
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base"
                        placeholder="Enter email"
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
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base"
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
                        value={
                          editData.dateOfBirth
                            ? editData.dateOfBirth.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base"
                        disabled={updateLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Sex
                      </label>
                      <div className="relative">
                        <select
                          name="sex"
                          value={editData.sex}
                          onChange={handleInputChange}
                          className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base appearance-none"
                          disabled={updateLoading}
                        >
                          <option value="">Select gender</option>
                          <option value="2">Male</option>
                          <option value="1">Female</option>
                          <option value="3">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-700">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-2">
                        Citizen identification
                      </label>
                      <input
                        type="text"
                        name="cccd"
                        value={editData.cccd}
                        onChange={handleInputChange}
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm outline-none text-sm sm:text-base"
                        placeholder="Enter citizen identification"
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
                        className="w-full p-3 sm:p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm resize-none outline-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                        placeholder="Enter address"
                        disabled={updateLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-purple-200">
                  <button
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md outline-none text-sm sm:text-base order-2 sm:order-1"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`w-full sm:w-auto mb-3 md:mb-0 px-6 sm:px-8 py-3 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center outline-none text-sm sm:text-base order-1 sm:order-2 ${
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
                          className="animate-spin -ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                        <span className="text-sm sm:text-base">Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                        <span className="text-sm sm:text-base">
                          Save Changes
                        </span>
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
