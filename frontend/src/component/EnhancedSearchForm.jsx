import React, { useState } from "react";
import { FaSearch, FaTimes, FaFilm, FaMagic } from "react-icons/fa";

const EnhancedSearchForm = ({ searchTerm, onSearchChange, onSubmit }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? "transform scale-105" : ""
        }`}
      >
        {/* Search Input Container */}
        <div
          className={`relative flex-1 transition-all duration-300 ${
            isFocused ? "shadow-lg shadow-[#6a57f5]/20" : ""
          }`}
        >
          {/* Animated border effect */}
          <div
            className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isFocused
                ? "bg-gradient-to-r from-[#6a57f5]/20 via-[#6a57f5]/10 to-[#6a57f5]/20"
                : "bg-slate-800"
            }`}
          >
            <div className="absolute inset-[1px] rounded-lg bg-slate-800"></div>
          </div>

          {/* Input field */}
          <div className="relative flex items-center">
            <FaSearch
              className={`absolute left-4 transition-all duration-300 ${
                isFocused ? "text-[#6a57f5] scale-110" : "text-gray-400"
              }`}
              size={16}
            />

            <input
              type="text"
              placeholder="Search movies, actors, genres..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                isFocused ? "placeholder-gray-300" : ""
              }`}
              autoComplete="off"
            />

            {/* Clear button */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-slate-700 rounded-full"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Animated underline */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#6a57f5] to-[#8b5cf6] transition-all duration-300 ${
              isFocused ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          ></div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className={`ml-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group ${
            searchTerm.trim()
              ? "bg-[#6a57f5] text-white hover:bg-[#5543c6] hover:shadow-lg hover:shadow-[#6a57f5]/25"
              : "bg-slate-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!searchTerm.trim()}
        >
          {/* Button background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6a57f5] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex items-center gap-2">
            <FaSearch
              className="transition-transform duration-200 group-hover:scale-110"
              size={14}
            />
            <span>Search</span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default EnhancedSearchForm;
