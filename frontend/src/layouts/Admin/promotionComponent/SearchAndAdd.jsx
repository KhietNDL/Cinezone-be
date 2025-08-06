import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

const SearchAndAdd = ({
  searchTerm,
  setSearchTerm,
  isEdit,
  setShowFormPopup,
  resetForm,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex items-center w-full md:w-[350px]">
        <div className="absolute left-3 z-10">
          <IoSearchOutline className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
          placeholder="Search by promotion code..."
        />
      </div>

      {/* Add Promotion Button */}
      {!isEdit && (
        <button
          onClick={() => {
            resetForm();
            setShowFormPopup(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-[150px] whitespace-nowrap"
        >
          <GoPlus className="w-4 h-4" />
          Add Promotion
        </button>
      )}
    </div>
  );
};

export default SearchAndAdd;
