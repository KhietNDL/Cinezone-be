import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

const SearchAndAdd = ({ searchMovie, setSearchMovie, setShowAddForm }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="w-full">
        <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
          <div className="shrink-0">
            <IoSearchOutline size={20} />
          </div>
          <input
            type="text"
            value={searchMovie}
            onChange={(e) => setSearchMovie(e.target.value)}
            className="p-2 focus:outline-none w-full"
            placeholder="Search by name movie ENG or VN"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div
          role="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
        >
          <GoPlus size={20} className="mr-2" />
          Movie
        </div>
      </div>
    </div>
  );
};

export default SearchAndAdd;
