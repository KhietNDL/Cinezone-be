import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUnlock } from "react-icons/fa";
import UserAvatar from "./UserAvatar";

const UserTable = ({
  users,
  handleEditUser,
  handleDeleteUser,
  handleUnbanUser,
  sortBy,
  sortOrder,
  handleSort,
  formatDate,
  unbanLoading,
}) => {
  return (
    <div className="hidden sm:block">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-slate-600 text-xs sm:text-sm border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
              <th className="py-3 px-3 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center font-semibold">
                Avatar
              </th>
              <th
                className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 cursor-pointer select-none font-semibold hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("FullName")}
              >
                Full Name
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "FullName" ? (
                    sortOrder === "asc" ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 14l4-4H6l4 4z" />
                      </svg>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline opacity-30"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  )}
                </span>
              </th>
              <th
                className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("DateOfBirth")}
              >
                DOB
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "DateOfBirth" ? (
                    sortOrder === "asc" ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 14l4-4H6l4 4z" />
                      </svg>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline opacity-30"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  )}
                </span>
              </th>
              <th
                className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("Sex")}
              >
                Gender
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "Sex" ? (
                    sortOrder === "asc" ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 14l4-4H6l4 4z" />
                      </svg>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline opacity-30"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  )}
                </span>
              </th>
              <th
                className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 cursor-pointer select-none hidden md:table-cell text-center font-semibold hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("Email")}
              >
                Email
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "Email" ? (
                    sortOrder === "asc" ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 14l4-4H6l4 4z" />
                      </svg>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline opacity-30"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  )}
                </span>
              </th>
              <th
                className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("PhoneNumber")}
              >
                Phone
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "PhoneNumber" ? (
                    sortOrder === "asc" ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline text-purple-600"
                      >
                        <path d="M10 14l4-4H6l4 4z" />
                      </svg>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline opacity-30"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  )}
                </span>
              </th>
              <th className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center font-semibold">
                Status
              </th>
              <th className="py-3 px-3 sm:px-4 w-[120px] shrink-0 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.UserId}
                onClick={() => handleEditUser(user)}
                className="border-b cursor-pointer border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-xs sm:text-sm transition-all duration-200 group"
              >
                <td className="py-3 px-3 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                  <UserAvatar
                    avatarUrl={user.avatar_url}
                    fullName={user.FullName}
                    size="md"
                    showHover={true}
                  />
                </td>
                <td className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                  <span className="block font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                    {user.FullName?.length > 20 ? (
                      <span title={user.FullName}>
                        {user.FullName.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      user.FullName || "N/A"
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell text-gray-600">
                  {formatDate(user.DateOfBirth)}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell text-gray-600">
                  {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                    ? "Male"
                    : user.Sex === 2 ||
                      user.Sex === "2" ||
                      user.Sex === "Female"
                    ? "Female"
                    : "Other"}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 text-center hidden md:table-cell">
                  <span className="block text-center text-gray-600">
                    {user.Email?.length > 20 ? (
                      <span title={user.Email}>
                        {user.Email.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      user.Email || "N/A"
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center text-gray-600">
                  {user.PhoneNumber || "N/A"}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      user.IsDeleted === 0 || user.IsDeleted === false
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                        : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {user.IsDeleted === 0 || user.IsDeleted === false
                      ? "Active"
                      : "Expired"}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 w-[120px] shrink-0 text-center">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Edit User"
                      aria-label={`Edit ${user.FullName || "user"}`}
                    >
                      <FaRegEdit size={14} />
                    </button>

                    {/* Chỉ hiển thị nút delete nếu user chưa bị xóa */}
                    {user.IsDeleted === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user);
                        }}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                        title="Delete User"
                        aria-label={`Delete ${user.FullName || "user"}`}
                      >
                        <RiDeleteBin5Line size={14} />
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
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        title="Unban User"
                        aria-label={`Unban ${user.FullName || "user"}`}
                      >
                        <FaUnlock size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
