import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  label,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-300 cursor-pointer flex items-center justify-between min-h-[42px] sm:min-h-[48px] bg-white shadow-sm ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
        } ${isOpen ? "ring-2 ring-purple-500 border-purple-500" : ""}`}
      >
        <div className="flex items-center flex-1">
          <span
            className={`truncate font-medium ${
              selectedOption ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
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
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 backdrop-blur-sm overflow-hidden">
          {options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 flex items-center ${
                  option.value === value
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                } ${index === 0 ? "rounded-t-xl" : ""} ${
                  index === options.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                {option.value === value && (
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <span className="truncate">{option.label}</span>
              </div>
            ))
          ) : (
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
