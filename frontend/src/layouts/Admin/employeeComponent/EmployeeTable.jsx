import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit, FaUnlock } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";
import UserAvatar from "../userComponent/UserAvatar";

const EmployeeTable = ({
  employees,
  handleEdit,
  handleDelete,
  handleUnban,
  handleRowClick,
  formatDate,
  sortBy,
  sortOrder,
  handleSort,
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
                className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
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
                className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
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
              <th
                className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors duration-200"
                onClick={() => handleSort("CreatedAt")}
              >
                Joined
                <span className="ml-1 inline-block align-middle">
                  {sortBy === "CreatedAt" ? (
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
              <th className="py-3 px-3 sm:px-4 w-[120px] shrink-0 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.UserId}
                onClick={(e) => handleRowClick(emp, e)}
                className="border-b cursor-pointer border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-xs sm:text-sm transition-all duration-200 group"
              >
                <td className="py-3 px-3 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                  <UserAvatar
                    avatarUrl={emp.avatar_url}
                    fullName={emp.FullName}
                    size="md"
                    showHover={true}
                  />
                </td>
                <td className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                  <span className="block font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                    {emp.FullName?.length > 20 ? (
                      <span title={emp.FullName}>
                        {emp.FullName.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      emp.FullName || "N/A"
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell text-gray-600">
                  {formatDate(emp.DateOfBirth)}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center text-gray-600">
                  {emp.Sex === 1 ? "Male" : emp.Sex === 2 ? "Female" : "Other"}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 text-center hidden md:table-cell">
                  <span className="block text-center text-gray-600">
                    {emp.Email?.length > 20 ? (
                      <span title={emp.Email}>
                        {emp.Email.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      emp.Email || "N/A"
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center text-gray-600">
                  {emp.PhoneNumber || "N/A"}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell text-gray-600">
                  {formatDate(emp.CreatedAt)}
                </td>
                <td className="py-3 px-3 sm:px-4 w-[120px] shrink-0 text-center">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="View Employee"
                      aria-label={`View ${emp.FullName || "employee"}`}
                    >
                      <IoEyeOutline size={14} />
                    </button>

                    {/* Show unban button if employee is deleted/banned */}
                    {emp.isDeleted === 1 || emp.isDeleted === true ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnban(emp);
                        }}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                        title="Unban Employee"
                        aria-label={`Unban ${emp.FullName || "employee"}`}
                      >
                        <FaUnlock size={14} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(emp);
                          }}
                          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Edit Employee"
                          aria-label={`Edit ${emp.FullName || "employee"}`}
                        >
                          <FaRegEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp);
                          }}
                          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Delete Employee"
                          aria-label={`Delete ${emp.FullName || "employee"}`}
                        >
                          <RiDeleteBin5Line size={14} />
                        </button>
                      </>
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

export default EmployeeTable;
