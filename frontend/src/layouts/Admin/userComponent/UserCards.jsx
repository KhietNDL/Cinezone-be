import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUnlock } from "react-icons/fa";
import UserAvatar from "./UserAvatar";

const UserCards = ({
  users,
  handleEditUser,
  handleDeleteUser,
  handleUnbanUser,
  formatDate,
  unbanLoading,
}) => {
  return (
    <div className="block sm:hidden space-y-4 sm:space-y-6">
      {users.map((user) => (
        <article
          key={user.UserId}
          className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-indigo-50/30 group"
          onClick={() => handleEditUser(user)}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar
                avatarUrl={user.avatar_url}
                fullName={user.FullName}
                size="xl"
                showHover={true}
                className="ring-2 ring-gray-100 group-hover:ring-purple-200"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                {user.FullName?.length > 20 ? (
                  <span title={user.FullName}>
                    {user.FullName.slice(0, 20) + "..."}
                  </span>
                ) : (
                  user.FullName || "N/A"
                )}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-1 group-hover:text-gray-600 transition-colors duration-300">
                {user.Email?.length > 25 ? (
                  <span title={user.Email}>
                    {user.Email.slice(0, 25) + "..."}
                  </span>
                ) : (
                  user.Email || "N/A"
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-gray-50 to-purple-50/50 p-3 rounded-xl border border-gray-100">
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs text-gray-700">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">
                  Date of Birth
                </span>
                <span className="font-semibold">
                  {formatDate(user.DateOfBirth)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">Gender</span>
                <span className="font-semibold">
                  {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                    ? "Male"
                    : user.Sex === 2 ||
                      user.Sex === "2" ||
                      user.Sex === "Female"
                    ? "Female"
                    : "Other"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">Phone</span>
                <span className="font-semibold">
                  {user.PhoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    user.IsDeleted === 0 || user.IsDeleted === false
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                  }`}
                >
                  {user.IsDeleted === 0 || user.IsDeleted === false
                    ? "Active"
                    : "Expired"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
              className="flex items-center justify-center w-10 h-10 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
              title="Edit User"
              aria-label={`Edit ${user.FullName || "user"}`}
            >
              <FaRegEdit size={16} />
            </button>

            {/* Chỉ hiển thị nút delete nếu user chưa bị xóa */}
            {user.IsDeleted === 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user);
                }}
                className="flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                title="Delete User"
                aria-label={`Delete ${user.FullName || "user"}`}
              >
                <RiDeleteBin5Line size={16} />
              </button>
            )}

            {/* Chỉ hiển thị nút unblock nếu user đã bị xóa */}
            {user.IsDeleted === 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnbanUser(user.UserId);
                }}
                disabled={unbanLoading}
                className="flex items-center justify-center w-10 h-10 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Unban User"
                aria-label={`Unban ${user.FullName || "user"}`}
              >
                <FaUnlock size={16} />
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default UserCards;
