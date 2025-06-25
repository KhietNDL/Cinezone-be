import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { IoTime, IoCloseSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";

const HeaderStats = ({ employees }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Total Employees</p>
          <div className="p-2 bg-sky-100 rounded-full">
            <MdPeopleAlt size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">{employees.length}</div>
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">On Leave</p>
          <div className="p-2 bg-rose-50 rounded-full">
            <IoTime size={20} className="text-red-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">2500</div>
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">New Hires</p>
          <div className="p-2 bg-sky-100 rounded-full">
            <IoMdPersonAdd size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">300</div>
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Resigned</p>
          <div className="p-2 bg-rose-50 rounded-full">
            <IoCloseSharp size={20} className="text-red-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">100</div>
      </div>
    </div>
  );
};

export default HeaderStats;
