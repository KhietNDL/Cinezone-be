import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import logo from "../../../assets/logoWeb.png";
=======
import logo from "../../../assets/logoWeb.svg";
>>>>>>> Develop
import { FaSearch } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
const Header = () => {
  const navigate = useNavigate();
  return (
<<<<<<< HEAD
    <div className="p-2 px-5 text-white flex items-center justify-between select-none w-[100%]">
=======
    <div className="p-2 fixed px-5 bg-black/40 text-white flex items-center justify-between select-none w-[100%]  top-0 left-0 z-50 ">
>>>>>>> Develop
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt=""
          loading="lazy"
          role="button"
          onClick={() => {
            navigate("/");
          }}
<<<<<<< HEAD
          className=" w-[140px] h-[70px] object-cover"
        />
      </div>
      <div className="flex items-center text-[17px] font-semibold space-x-4">
        <div role="button">Movies</div>
        <div role="button">Cinemas</div>
        <div role="button">Promotions</div>
        <div role="button">News</div>
        <div role="button">Membership</div>
      </div>
      <div className="flex items-center space-x-4">
        <div
          role="button"
          className="border-solid border-[1px] border-purple-500 rounded-[10px] p-2.5"
        >
          <FaSearch size={20} className="text-purple-600" />
        </div>
        <div
          role="button"
          className="border-solid flex items-center border-[1px] text-purple-600 border-purple-600 rounded-[10px] p-2"
        >
          <p>
            <IoLocationOutline size={20} className="mr-2" />
          </p>
          <p className="font-bold">Hồ Chí Minh</p>
        </div>
=======
          className=" w-[160px] h-[70px] object-cover "
        />
      </div>
      <div className="flex items-center text-[17px] font-bold space-x-4">
        <div role="button" className="hover:underline shadow-2xl">
          Movies
        </div>
        <div role="button" className="hover:underline shadow-2xl">
          Cinemas
        </div>
        <div role="button" className="hover:underline shadow-2xl">
          Promotions
        </div>
        <div role="button" className="hover:underline shadow-2xl">
          News
        </div>
        <div role="button" className="hover:underline shadow-2xl">
          Membership
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div role="button" className=" p-2.5">
          <FaSearch size={20} className="text-white" />
        </div>

>>>>>>> Develop
        <div
          role="button"
          onClick={() => {
            navigate("/login");
          }}
<<<<<<< HEAD
          className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-2 px-3 font-semibold  active:scale-[1.1] transition-90s duration-75"
=======
          className="bg-transparent border-2 rounded-4xl p-2 px-6 border-[#6a57f5] shadow-[#6a57f5]  shadow-md font-bold  active:scale-[1.1] transition-90s duration-75"
>>>>>>> Develop
        >
          Sign In
        </div>
      </div>
    </div>
  );
};

export default Header;
