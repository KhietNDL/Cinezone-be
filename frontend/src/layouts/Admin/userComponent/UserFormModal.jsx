import React from "react";

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-indigo-600 px-4 sm:px-6 py-3 sm:py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {showEditModal ? "Edit User" : "Add New User"}
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm mt-1">
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
              className="p-1 sm:p-2 hover:bg-indigo-700 rounded-full transition-colors"
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
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                  />
                </svg>
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 sm:gap-4 mt-2">
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="radio"
                        name="Sex"
                        value="1"
                        checked={sex === "1"}
                        onChange={(e) => setSex(e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="radio"
                        name="Sex"
                        value="2"
                        checked={sex === "2"}
                        onChange={(e) => setSex(e.target.value)}
                        className="mr-1 sm:mr-2"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 w-full">
                    Avatar
                  </label>
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-gray-300 bg-white flex items-center justify-center overflow-hidden mb-2">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="object-cover w-full h-full"
                          onError={(e) =>
                            (e.target.src = "/default-avatar.png")
                          }
                        />
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">
                          No Image
                        </span>
                      )}
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl("");
                            setAvatarFile(null);
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                          title="Remove image"
                          aria-label="Remove avatar"
                        >
                          <svg
                            className="w-3 sm:w-4 h-3 sm:h-4 text-red-500"
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
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition text-xs sm:text-sm"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={() => {
              if (showAddModal) setShowAddModal(false);
              if (showEditModal) setShowEditModal(false);
              resetForm();
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors text-xs sm:text-sm"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            disabled={addLoading}
            onClick={showEditModal ? handleUpdateUser : handleAddUser}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center text-xs sm:text-sm"
            aria-label={showEditModal ? "Update user" : "Add user"}
          >
            {addLoading ? (
              <>
                <svg
                  className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-white"
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
            ) : showEditModal ? (
              "Update"
            ) : (
              "Add User"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
