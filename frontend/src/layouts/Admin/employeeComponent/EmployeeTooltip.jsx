import React from "react";
import {
  IoClose,
  IoCalendarOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoCardOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";
import UserAvatar from "../userComponent/UserAvatar";

const EmployeeTooltip = ({ employee, onClose }) => {
  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  return (
    <div className="absolute inset-0 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <UserAvatar
                avatarUrl={employee.avatar_url}
                fullName={employee.FullName}
                size="md"
                showHover={true}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee.FullName}
              </h2>

              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Active Employee
              </span>
            </div>
          </div>
          <div
            role="button"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <IoClose size={24} className="text-gray-600" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
              <IoCalendarOutline size={18} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-purple-800 block uppercase tracking-wide">
                Date of Birth
              </span>
              <span className="text-sm text-purple-700 font-semibold">
                {formatDate(employee.DateOfBirth) || "Not provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full mr-3">
              <IoPersonOutline size={18} className="text-pink-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-pink-800 block uppercase tracking-wide">
                Gender
              </span>
              <span className="text-sm text-pink-800 font-semibold">
                {employee.Sex === 1
                  ? "Male"
                  : employee.Sex === 2
                  ? "Female"
                  : "Other"}
              </span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
              <IoMailOutline size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-blue-800 block uppercase tracking-wide">
                Email Address
              </span>
              <span className="text-sm text-blue-700 font-semibold truncate">
                {employee.Email || "Not provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
              <IoCallOutline size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-green-800 block uppercase tracking-wide">
                Phone Number
              </span>
              <span className="text-sm text-green-700 font-semibold">
                {employee.PhoneNumber || "Not provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-3">
              <IoCardOutline size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-orange-800 block uppercase tracking-wide">
                ID Card
              </span>
              <span className="text-sm text-orange-700 font-semibold">
                {employee.CCCD || "Not provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
              <IoTimeOutline size={18} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-indigo-800 block uppercase tracking-wide">
                Register Date
              </span>
              <span className="text-sm text-indigo-800 font-semibold">
                {formatDate(employee.CreatedAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-3 mt-1">
              <IoLocationOutline size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-700 block uppercase tracking-wide mb-1">
                Address
              </span>
              <p className="text-sm text-gray-800 leading-relaxed">
                {employee.Address || "Address not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTooltip;
