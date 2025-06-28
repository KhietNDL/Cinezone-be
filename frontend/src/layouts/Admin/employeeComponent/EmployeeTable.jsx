import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const EmployeeTable = ({
  employees,
  page,
  itemsPerPage,
  handleEdit,
  handleDelete,
  handleRowClick,
  formatDate,
}) => {
  return (
    <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-slate-500 text-sm border-b border-gray-200">
            <th className="py-2 px-4">Avatar</th>
            <th className="py-2 px-4">Full Name</th>
            <th className="py-2 px-4 text-center">Date of Birth</th>
            <th className="py-2 px-4 text-center">Gender</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4 text-center">Phone</th>
            <th className="py-2 px-4 text-center">Register Date</th>
            <th className="py-2 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((emp) => (
              <tr
                key={emp.UserId}
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(emp, e);
                }}
                className="border-b border-gray-200 hover:bg-gray-50 text-sm"
              >
                <td className="py-2 px-4">
                  <img
                    src={emp.avatar_url || "/default-avatar.png"}
                    alt={emp.FullName}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-2 px-4">{emp.FullName}</td>
                <td className="py-2 px-4 text-center">
                  {formatDate(emp.DateOfBirth)}
                </td>
                <td className="py-2 px-4 text-center">
                  {emp.Sex === 1 ? "Male" : emp.Sex === 2 ? "Female" : "Other"}
                </td>
                <td className="py-2 px-4">{emp.Email}</td>
                <td className="py-2 px-4 text-center">{emp.PhoneNumber}</td>
                <td className="py-2 px-4 text-center">
                  {formatDate(emp.CreatedAt)}
                </td>
                <td className="py-2 px-4  ">
                  <div className="flex justify-center space-x-2">
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(emp);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaRegEdit size={20} />
                    </div>
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(emp);
                      }}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <RiDeleteBin5Line size={20} />
                    </div>
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
