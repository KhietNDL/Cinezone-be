import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

const SearchAndAdd = ({
  searchTerm,
  setSearchTerm,
  showEditModal,
  setShowAddModal,
  resetForm,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 lg:gap-4 w-full">
      <div className="relative flex items-center w-full max-w-[400px]">
        <div className="absolute left-3 z-10">
          <IoSearchOutline size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
          placeholder="Search by name or email..."
        />
      </div>
      {!showEditModal && (
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-[120px]"
        >
          <GoPlus size={18} />
          Add User
        </button>
      )}
    </div>
  );
};

export default SearchAndAdd;
