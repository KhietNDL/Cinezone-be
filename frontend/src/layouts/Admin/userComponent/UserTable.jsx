import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUnlock } from "react-icons/fa";

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
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
            <th className="py-2 px-2 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
              Avatar
            </th>
            <th
              className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 cursor-pointer select-none"
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
                      className="inline"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline"
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
            <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell">
              DOB
            </th>
            <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell">
              Gender
            </th>
            <th
              className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 cursor-pointer select-none hidden md:table-cell text-center"
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
                      className="inline"
                    >
                      <path d="M10 6l-4 4h8l-4-4z" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="inline"
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
            <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
              Phone
            </th>
            <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center">
              Status
            </th>
            <th className="py-2 px-2 sm:px-4 w-[120px] shrink-0 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.UserId}
              onClick={() => handleEditUser(user)}
              className="border-b cursor-pointer border-gray-200 hover:bg-gray-50 text-xs sm:text-sm transition-colors"
            >
              <td className="py-2 px-2 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                <img
                  src={user.avatar_url || "/default-avatar.png"}
                  alt={user.FullName || "Avatar"}
                  loading="lazy"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover mx-auto"
                />
              </td>
              <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                <span className="block">
                  {user.FullName?.length > 20 ? (
                    <span title={user.FullName}>
                      {user.FullName.slice(0, 20) + "..."}
                    </span>
                  ) : (
                    user.FullName || "N/A"
                  )}
                </span>
              </td>
              <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell">
                {formatDate(user.DateOfBirth)}
              </td>
              <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell">
                {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                  ? "Male"
                  : user.Sex === 2 || user.Sex === "2" || user.Sex === "Female"
                  ? "Female"
                  : "Other"}
              </td>
              <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 text-center hidden md:table-cell">
                <span className="block text-center">
                  {user.Email?.length > 20 ? (
                    <span title={user.Email}>
                      {user.Email.slice(0, 20) + "..."}
                    </span>
                  ) : (
                    user.Email || "N/A"
                  )}
                </span>
              </td>
              <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
                {user.PhoneNumber || "N/A"}
              </td>
              <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.IsDeleted === 0 || user.IsDeleted === false
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.IsDeleted === 0 || user.IsDeleted === false
                    ? "Active"
                    : "Expired"}
                </span>
              </td>
              <td className="py-2 px-2 sm:px-4 w-[120px] shrink-0 text-center">
                <div className="flex justify-center space-x-1 sm:space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1 sm:p-2"
                    title="Edit"
                    aria-label={`Edit ${user.FullName || "user"}`}
                  >
                    <FaRegEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user);
                    }}
                    className="text-red-400 hover:text-red-600 p-1 sm:p-2"
                    title="Delete"
                    aria-label={`Delete ${user.FullName || "user"}`}
                  >
                    <RiDeleteBin5Line size={16} />
                  </button>
                  {(user.IsDeleted === 1 || user.IsDeleted === true) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnbanUser(user.UserId);
                      }}
                      disabled={unbanLoading}
                      className="text-green-500 hover:text-green-700 p-1 sm:p-2 disabled:opacity-50"
                      title="Unban"
                      aria-label={`Unban ${user.FullName || "user"}`}
                    >
                      <FaUnlock size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
