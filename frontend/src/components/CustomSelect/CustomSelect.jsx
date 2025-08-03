import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  dropdownClassName = "",
  optionClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { value: option } });
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
           bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full
          text-sm font-medium text-gray-700 
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
          transition-all duration-200 hover:border-gray-300 shadow-sm cursor-pointer
          flex items-center justify-between
          ${isOpen ? "ring-2 ring-purple-500 border-purple-500" : ""}
        `}
      >
        <span className="truncate">{selectedOption || placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1 
            bg-white border border-gray-200 rounded-xl shadow-lg z-50
            max-h-60 overflow-y-auto
            ${dropdownClassName}
          `}
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={`
                w-full text-left px-4 py-3 text-sm font-medium
                transition-all duration-200
                hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50
                hover:text-purple-700
                ${
                  selectedOption === option
                    ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-semibold"
                    : "text-gray-700"
                }
                ${index === 0 ? "rounded-t-xl" : ""}
                ${index === options.length - 1 ? "rounded-b-xl" : ""}
                focus:outline-none focus:bg-purple-50
                ${optionClassName}
              `}
            >
              <div role="button" className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOption === option && (
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
