import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";

const EmployeeTable = ({
  employees,
  page,
  itemsPerPage,
  handleEdit,
  handleDelete,
  handleRowClick,
  formatDate,
  sortBy,
  sortOrder,
  handleSort,
}) => {
  return (
    <div className="bg-white min-h-[300px] max-h-[500px] p-2 sm:p-3 md:p-4 rounded-lg shadow-sm overflow-x-auto">
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
              {sortBy === "FullName" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={20} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={20} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown size={20} className="inline ml-1 text-gray-300" />
              )}
            </th>
            <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell">
              DOB
            </th>
            <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center">
              Gender
            </th>
            <th
              className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[150px] lg:w-[180px] shrink-0 hidden md:table-cell cursor-pointer select-none"
              onClick={() => handleSort("Email")}
            >
              Email
              {sortBy === "Email" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={20} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={20} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown size={20} className="inline ml-1 text-gray-300" />
              )}
            </th>
            <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
              Phone
            </th>
            <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell">
              Joined
            </th>
            <th className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {employees
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((emp) => (
              <tr
                key={emp.UserId}
                onClick={(e) => handleRowClick(emp, e)}
                className="border-b cursor-pointer border-gray-200 hover:bg-gray-50 text-xs sm:text-sm transition-colors"
              >
                <td className="py-2 px-2 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                  <img
                    src={emp.avatar_url || "/default-avatar.png"}
                    alt={emp.FullName || "Avatar"}
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full mx-auto"
                  />
                </td>
                <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                  <span className="block ">
                    {emp.FullName?.length > 20 ? (
                      <span title={emp.FullName}>
                        {emp.FullName.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      emp.FullName
                    )}
                  </span>
                </td>
                <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden lg:table-cell">
                  {formatDate(emp.DateOfBirth)}
                </td>
                <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center">
                  {emp.Sex === 1 ? "Male" : emp.Sex === 2 ? "Female" : "Other"}
                </td>
                <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 hidden md:table-cell">
                  <span className="block text-center md:w-[150px] lg:w-[180px]">
                    {emp.Email?.length > 20 ? (
                      <span title={emp.Email}>
                        {emp.Email.slice(0, 20) + "..."}
                      </span>
                    ) : (
                      <span className="md:w-[150px] lg:w-[180px]">
                        {emp.Email}
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
                  {emp.PhoneNumber}
                </td>
                <td className="py-2 hidden lg:table-cell px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center ">
                  {formatDate(emp.CreatedAt)}
                </td>
                <td className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="View"
                      aria-label={`View ${emp.FullName || "employee"}`}
                    >
                      <IoEyeOutline size={18} sm={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(emp);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                      aria-label={`Edit ${emp.FullName || "employee"}`}
                    >
                      <FaRegEdit size={18} sm={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(emp);
                      }}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                      aria-label={`Delete ${emp.FullName || "employee"}`}
                    >
                      <RiDeleteBin5Line size={18} sm={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
