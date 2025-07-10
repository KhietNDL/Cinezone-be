import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { IoTime, IoCloseSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";

const HeaderStats = ({ totalEmployees }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
      <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Total Employees</p>
          <div className="p-1 sm:p-2 bg-sky-100 rounded-lg flex items-center justify-center">
            <MdPeopleAlt size={20} className="text-blue-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">{totalEmployees}</p>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">On Leave</p>
          <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
            <IoTime size={20} className="text-red-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">2500</p>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">New Hires</p>
          <div className="p-1 sm:p-2 bg-sky-100 rounded-lg flex items-center justify-center">
            <IoMdPersonAdd size={20} className="text-blue-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">300</p>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Resigned</p>
          <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
            <IoCloseSharp size={20} className="text-red-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">100</p>
      </div>
    </div>
  );
};

export default HeaderStats;
