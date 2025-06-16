import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoWeb.png";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { MdAccountCircle } from "react-icons/md";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="p-2 fixed md:px-5  bg-black/40 text-white flex items-center justify-between select-none w-[100%] top-0 left-0 z-50 ">
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
      <div className="md:flex items-center text-[17px] font-bold space-x-8 hidden ">
        <div role="button" className="hover:underline shadow-2xl">
          Movies
        </div>

        <Link
          to="/promotions"
          className="hover:underline shadow-2xl block text-center py-2 px-4 cursor-pointer"
          role="button"
        >
          Promotions
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div
            role="button"
            className="p-2.5 border-solid border-[1px] border-[#6a57f5] rounded-full shadow-[#6a57f5] shadow-md hover:bg-[#6957f538]"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FaSearch size={20} className="text-white" />
          </div>
          <div
            className={`absolute top-0 z-[-1] w-[250px] bg-black border border-[#6a57f5] rounded-4xl shadow-[#6a57f5] shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
              isSearchOpen ? "translate-x-0 " : "translate-x-full hidden"
            }`}
            style={{ right: 0, transformOrigin: "right" }}
          >
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full p-2 px-4  pr-12 outline-none "
            />
          </div>
        </div>

        {user ? (
          <div className="flex items-center space-x-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
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
              {user.FullName || "User"}
            </span>
          </div>
        ) : (
          <div
            role="button"
            onClick={() => {
              navigate("/login");
            }}
            className="bg-transparent border-2 rounded-4xl p-2 px-6 border-[#6a57f5] shadow-[#6a57f5] hover:bg-[#6957f538] shadow-md font-bold active:scale-[1.1] transition-all duration-100"
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
