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
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
      <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-lg bg-white shadow-sm">
        <IoSearchOutline size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
          placeholder="Search by name or email"
        />
      </div>
      {!showEditModal && (
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center text-indigo-600 hover:bg-gray-50 p-2 rounded-lg active:bg-gray-100 bg-white shadow-sm w-full sm:w-auto text-sm sm:text-base"
        >
          <GoPlus size={18} className="mr-1 sm:mr-2" />
          Add User
        </button>
      )}
    </div>
  );
};

export default SearchAndAdd;
