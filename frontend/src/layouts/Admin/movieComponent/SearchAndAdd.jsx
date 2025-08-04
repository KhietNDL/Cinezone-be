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
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 w-full">
      <div className="relative flex items-center w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearchOutline className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm bg-white shadow-sm hover:border-gray-400"
          placeholder="Search by movie name (ENG or VN)"
        />
      </div>
      {!showEditForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto text-sm"
        >
          <GoPlus size={18} className="mr-2" />
          Add Movie
        </button>
      )}
    </div>
  );
};

export default SearchAndAdd;
