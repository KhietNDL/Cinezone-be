import React from "react";
import logo from "../../../assets/logoWhite.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
const HeaderStaff = () => {
  const navigate = useNavigate();
  const { staff } = useAuth();


  return (
    <div className="flex  w-full px-[20px] justify-between items-center bg-gradient-to-r from-[#6466F1]
     via-[#8B5CF6] to-[#4F46E5] text-white ">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/staff");
          }}
          className=" w-[140px] h-[70px] object-cover p-0"
        />
      </div>

      <div className="flex items-center justify-end space-x-8">
       
        {staff ? (
          <div className="flex items-center space-x-2">
            {staff.avatar ? (
              <img
                src={staff.avatar}
                alt="Staff Avatar"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => navigate("/account")}
              />
            ) : (
              <MdAccountCircle
                size={42}
                className="cursor-pointer text-white"
                onClick={() => navigate("/account")}
              />
            )}
            <span
              className="font-bold text-[16px] cursor-pointer hover:underline"
              onClick={() => navigate("/account")}
            >
              {staff.FullName || "staff"}
            </span>
          </div>
        ) : (
          <div
            role="button"
            onClick={() => {
              navigate("/login");
            }}
            className="group flex items-center bg-transparent border-2 rounded-4xl border-white hover:bg-white
             hover:text-[#5B4BE9] font-bold active:scale-[1.1] transition-all duration-100 overflow-hidden">

            <div className="text-3xl flex items-center justify-end transform transition-transform duration-300 
            group-hover:-translate-x-2 group-hover:w-[40px] p-[1px]">
              <FaCircleUser />
            </div>
            <p className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] group-hover:w-[60px]
             font-semibold transition-all duration-300 whitespace-nowrap">
              Sign In
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderStaff;
