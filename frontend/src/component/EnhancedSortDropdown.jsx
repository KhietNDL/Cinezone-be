import React, { useState } from "react";
import {
  FaChevronDown,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const EnhancedSortDropdown = ({ sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    {
      value: "desc",
      label: "Newest First",
      icon: <FaSortAmountDown className="text-[#6a57f5]" size={14} />,
      description: "Most recent movies first",
    },
    {
      value: "asc",
      label: "Oldest First",
      icon: <FaSortAmountUp className="text-[#6a57f5]" size={14} />,
      description: "Oldest movies first",
    },
  ];

  const selectedOption = sortOptions.find(
    (option) => option.value === sortOrder
  );

  const handleOptionClick = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Custom Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 hover:border-[#6a57f5] focus:border-[#6a57f5] focus:outline-none transition-all duration-300 min-w-[200px] group"
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedOption?.icon}
          <span className="font-medium">{selectedOption?.label}</span>
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 group-hover:text-[#6a57f5] ${
            isOpen ? "rotate-180" : ""
          }`}
          size={12}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 ${
                  sortOrder === option.value
                    ? "bg-slate-700 border-l-4 border-[#6a57f5]"
                    : ""
                }`}
              >
                {option.icon}
                <div className="flex-1">
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-gray-400 text-xs">
                    {option.description}
                  </div>
                </div>
                {sortOrder === option.value && (
                  <div className="w-2 h-2 bg-[#6a57f5] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default EnhancedSortDropdown;
