import React, { useState, useRef, useEffect } from "react";

const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  label,
  required = false,
  minDate = null,
  maxDate = null,
  disabled = false,
  showQuickActions = true,
  showYearDropdown = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatInputDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Use local timezone to avoid date shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date) => {
    if (minDate) {
      const minDateTime = new Date(minDate).getTime();
      const dateTime = date.getTime();
      if (dateTime < minDateTime) return true;
    }

    if (maxDate) {
      const maxDateTime = new Date(maxDate).getTime();
      const dateTime = date.getTime();
      if (dateTime > maxDateTime) return true;
    }

    return false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        isSelected:
          selectedDate &&
          currentDate.toDateString() === new Date(selectedDate).toDateString(),
        isDisabled: isDateDisabled(currentDate),
      });
    }
    return days;
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date) || disabled) return;
    // Create a new date in local timezone to avoid timezone issues
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const formattedDate = formatInputDate(localDate);
    setSelectedDate(formattedDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (!isDateDisabled(today) && !disabled) {
      handleDateSelect(today);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Generate years from 50 years ago to current year only
    for (let i = currentYear - 50; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setIsYearDropdownOpen(false);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-300 flex items-center justify-between min-h-[42px] sm:min-h-[48px] bg-white shadow-sm ${
          disabled
            ? "cursor-not-allowed bg-gray-50 text-gray-400"
            : "cursor-pointer"
        }`}
      >
        <div className="flex items-center flex-1">
          <svg
            className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={`truncate font-medium ${
              selectedDate ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 backdrop-blur-sm">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 text-gray-600 hover:text-purple-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {months[currentMonth.getMonth()]}
              </h3>

              {/* Year Dropdown */}
              {showYearDropdown && (
                <div className="relative">
                  <button
                    onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                    className="text-sm font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200 px-2 py-1 rounded hover:bg-purple-50 flex items-center space-x-1"
                  >
                    <span>{currentMonth.getFullYear()}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isYearDropdownOpen ? "rotate-180" : ""
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

                  {isYearDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 max-h-40 overflow-y-auto min-w-[80px]">
                      {generateYearOptions().map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                            year === currentMonth.getFullYear()
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!showYearDropdown && (
                <h3 className="text-sm font-semibold text-gray-800">
                  {currentMonth.getFullYear()}
                </h3>
              )}

              <button
                onClick={goToToday}
                className={`text-xs px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md ${
                  isDateDisabled(new Date())
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isDateDisabled(new Date())}
              >
                Today
              </button>
            </div>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 text-gray-600 hover:text-purple-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day.date)}
                disabled={day.isDisabled}
                className={`
                  p-2.5 text-xs rounded-lg transition-all duration-200 font-medium
                  ${!day.isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                  ${
                    day.isDisabled
                      ? "text-gray-300 cursor-not-allowed opacity-50"
                      : "hover:bg-purple-100"
                  }
                  ${
                    day.isSelected
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md"
                      : ""
                  }
                  ${
                    day.isToday && !day.isSelected && !day.isDisabled
                      ? "bg-purple-100 text-purple-700 font-bold ring-1 ring-purple-200"
                      : ""
                  }
                  ${
                    day.isCurrentMonth &&
                    !day.isSelected &&
                    !day.isToday &&
                    !day.isDisabled
                      ? "hover:bg-purple-50"
                      : ""
                  }
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 mt-4 -mx-4 -mb-4 rounded-b-xl">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    onChange(formatDateToString(nextWeek));
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  Next Week
                </button>
                <button
                  onClick={() => {
                    const twoWeeks = new Date();
                    twoWeeks.setDate(twoWeeks.getDate() + 14);
                    onChange(formatDateToString(twoWeeks));
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  2 Weeks
                </button>
                <button
                  onClick={() => {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    onChange(formatDateToString(nextMonth));
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                >
                  Next Month
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
