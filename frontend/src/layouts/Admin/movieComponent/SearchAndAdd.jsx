import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

const SearchAndAdd = ({
  searchMovie,
  setSearchMovie,
  setShowAddForm,
  showEditForm,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
      <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-xl bg-white shadow-sm">
        <IoSearchOutline size={20} />
        <input
          type="text"
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
          className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
          placeholder="Search by movie name (ENG or VN)"
        />
      </div>
      {!showEditForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm w-full sm:w-auto text-sm sm:text-base"
        >
          <GoPlus size={18} className="mr-1 sm:mr-2" />
          Add Movie
        </button>
      )}
    </div>
  );
};

export default SearchAndAdd;
