import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logoWeb.svg";
import { FaSearch } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 fixed px-5 bg-black/40 text-white flex items-center justify-between select-none w-[100%]  top-0 left-0 z-50 ">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt=""
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/");
          }}
          className=" w-[160px] h-[70px] object-cover "
        />
      </div>
      <div className="flex items-center text-[17px] font-bold space-x-8">
        <div role="button" className="hover:underline shadow-2xl">
          Movies
        </div>

        <div role="button" className="hover:underline shadow-2xl">
          Promotions
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div role="button" className=" p-2.5">
          <FaSearch size={20} className="text-white" />
        </div>

        <div
          role="button"
          onClick={() => {
            navigate("/login");
          }}
          className="bg-transparent border-2 rounded-4xl p-2 px-6 border-[#6a57f5] shadow-[#6a57f5]  shadow-md font-bold  active:scale-[1.1] transition-90s duration-75"
        >
          Sign In
        </div>
      </div>
    </div>
  );
};

export default Header;
