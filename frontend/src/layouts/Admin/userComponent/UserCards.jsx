import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const UserCards = ({ users, handleEditUser, handleDeleteUser, formatDate }) => {
  return (
    <div className="block sm:hidden space-y-4">
      {users.map((user) => (
        <article
          key={user.UserId}
          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          onClick={() => handleEditUser(user)}
        >
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt={user.FullName || "Avatar"}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {user.FullName?.length > 20 ? (
                  <span title={user.FullName}>
                    {user.FullName.slice(0, 20) + "..."}
                  </span>
                ) : (
                  user.FullName || "N/A"
                )}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user.Email?.length > 20 ? (
                  <span title={user.Email}>
                    {user.Email.slice(0, 20) + "..."}
                  </span>
                ) : (
                  user.Email || "N/A"
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs grid grid-cols-2 gap-x-2 gap-y-4 text-gray-700">
            <p>
              <strong>DOB:</strong> {formatDate(user.DateOfBirth)}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                ? "Male"
                : user.Sex === 2 || user.Sex === "2" || user.Sex === "Female"
                ? "Female"
                : "Other"}
            </p>
            <p>
              <strong>Phone:</strong> {user.PhoneNumber || "N/A"}
            </p>
          </div>
          <div className="flex justify-center space-x-2 sm:space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
              className="text-blue-500 hover:text-blue-700"
              aria-label={`Edit ${user.FullName || "user"}`}
            >
              <FaRegEdit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user);
              }}
              className="text-red-400 hover:text-red-600"
              aria-label={`Delete ${user.FullName || "user"}`}
            >
              <RiDeleteBin5Line size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default UserCards;
