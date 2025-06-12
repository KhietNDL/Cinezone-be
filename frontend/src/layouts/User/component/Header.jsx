import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoWeb.png";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };
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
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => navigate("/account")}
            />
            <span
              className="font-bold text-[16px] cursor-pointer hover:underline"
              onClick={() => navigate("/profile")}
            >
              {user.FullName || "User"}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-transparent border-2 rounded-4xl p-1 px-4 border-[#6a57f5] shadow-[#6a57f5] hover:bg-[#6957f538] shadow-md font-bold active:scale-[1.1] transition-90s duration-75"
            >
              Sign Out
            </button>
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
