import React from "react";
import DatePicker from "./DatePicker";
import UserAvatar from "./UserAvatar";

const UserFormModal = ({
  showAddModal,
  showEditModal,
  setShowAddModal,
  setShowEditModal,
  fullName,
  setFullName,
  dateOfBirth,
  setDateOfBirth,
  sex,
  setSex,
  email,
  setEmail,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  cccd,
  setCCCD,
  avatarUrl,
  setAvatarUrl,
  setAvatarFile,
  resetForm,
  addLoading,
  handleAddUser,
  handleUpdateUser,
}) => {
  if (!showAddModal && !showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {showEditModal ? "Edit User" : "Add New User"}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">
                {showEditModal
                  ? "Update the details below to edit the user"
                  : "Fill in the details below to add a user"}
              </p>
            </div>
            <button
              onClick={() => {
                if (showAddModal) setShowAddModal(false);
                if (showEditModal) setShowEditModal(false);
                resetForm();
              }}
              className="p-2 hover:bg-purple-700 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
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
                </div>
                User Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div>
                  <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(value) => setDateOfBirth(value)}
                    placeholder="Select date of birth"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 sm:gap-4 mt-2">
                    <label className="flex items-center text-xs sm:text-sm cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name="Sex"
                        value="1"
                        checked={sex === "1"}
                        onChange={(e) => setSex(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      Male
                    </label>
                    <label className="flex items-center text-xs sm:text-sm cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name="Sex"
                        value="2"
                        checked={sex === "2"}
                        onChange={(e) => setSex(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Identity Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cccd}
                    onChange={(e) => setCCCD(e.target.value)}
                    placeholder="Enter identity card number"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Password
                    {showEditModal ? "" : " "}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      showEditModal
                        ? "Enter new password (leave blank to keep current)"
                        : "Enter password"
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 w-full">
                    Avatar
                  </label>
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-xl border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden mb-3 hover:border-purple-400 transition-colors duration-200">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="object-cover w-full h-full rounded-lg"
                          onError={(e) =>
                            (e.target.src = "/default-avatar.png")
                          }
                        />
                      ) : (
                        <UserAvatar
                          avatarUrl={null}
                          fullName={fullName}
                          size="lg"
                          showHover={false}
                          className="border-0 shadow-none"
                        />
                      )}
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl("");
                            setAvatarFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                          title="Remove image"
                          aria-label="Remove avatar"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAvatarFile(file);
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setAvatarUrl(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 rounded-b-xl">
          <button
            onClick={() => {
              if (showAddModal) setShowAddModal(false);
              if (showEditModal) setShowEditModal(false);
              resetForm();
            }}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            disabled={addLoading}
            onClick={showEditModal ? handleUpdateUser : handleAddUser}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={showEditModal ? "Update user" : "Add user"}
          >
            {addLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                {showEditModal ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
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
                {showEditModal ? "Update User" : "Add User"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
