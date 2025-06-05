import React from "react";
import logo from "../../../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
const HeaderStaff = () => {
  const navigate = useNavigate();
  return (
    <div className="flex  w-full px-[20px] justify-between items-center bg-gradient-to-r from-[#6466F1] via-[#8B5CF6] to-[#4F46E5] text-white ">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/");
          }}
          className=" w-[140px] h-[70px] object-cover p-0"
        />
      </div>
      {/* <div className="flex justify-start w-[60%]">
        <p className="font-bold text-[28px]">Dashboard</p>
      </div> */}
      <div className="flex items-center justify-end space-x-8">
        <BsBell size={20} />
        <div className="flex items-center space-x-2">
          <div className="border-[1px] border-solid border-amber-500 rounded-full w-[40px] h-[40px]">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="avatar"
              loading="lazy"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <p className="font-bold text-[18px] ">Tôi là ai</p>
            <p className="text-[15px] text-slate-400">Staff</p>
          </div>
          <div className="ml-3">
            <IoIosArrowDown size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStaff;
