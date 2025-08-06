import React, { useState } from "react";

const CustomDatePicker = ({ value, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  const [isOpen, setIsOpen] = useState(false);

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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

  // Create calendar grid
  const calendarDays = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isNextMonth: false,
      date: new Date(currentYear, currentMonthIndex - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isNextMonth: false,
      date: new Date(currentYear, currentMonthIndex, day),
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isNextMonth: true,
      date: new Date(currentYear, currentMonthIndex + 1, day),
    });
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectDate = (dateObj) => {
    const minDateObj = minDate ? new Date(minDate) : new Date();
    minDateObj.setHours(0, 0, 0, 0);

    if (dateObj.date < minDateObj) return;
    // Use local timezone to avoid date shifting
    const formattedDate = formatDateToString(dateObj.date);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return value && date.toDateString() === new Date(value).toDateString();
  };

  const isPastDate = (date) => {
    const minDateObj = minDate ? new Date(minDate) : new Date();
    minDateObj.setHours(0, 0, 0, 0);
    return date < minDateObj;
  };

  return (
    <div className="group relative">
      <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-purple-600"
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
        Show Date
      </label>

      {/* Date Input Display */}
      <div
        className="relative w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-200 text-lg hover:border-gray-300 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-gray-400"
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
              className={value ? "text-gray-800 font-medium" : "text-gray-500"}
            >
              {value
                ? formatDisplayDate(value)
                : "Select a date for the showtime"}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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
      </div>

      {/* Custom Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
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
              <h3 className="text-xl font-bold">
                {months[currentMonthIndex]} {currentYear}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
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
          </div>

          {/* Calendar Body */}
          <div className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dateObj, index) => {
                const isCurrentMonth = dateObj.isCurrentMonth;
                const isDateToday = isToday(dateObj.date);
                const isDateSelected = isSelected(dateObj.date);
                const isPast = isPastDate(dateObj.date);

                return (
                  <button
                    key={index}
                    onClick={() => selectDate(dateObj)}
                    disabled={isPast}
                    className={`
                      relative w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isCurrentMonth
                          ? isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                          : "text-gray-400 hover:bg-gray-50"
                      }
                      ${
                        isDateToday && isCurrentMonth
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                          : ""
                      }
                      ${
                        isDateSelected
                          ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg transform scale-105"
                          : ""
                      }
                    `}
                  >
                    {dateObj.day}
                    {isDateToday && isCurrentMonth && !isDateSelected && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const nextWeek = new Date(today);
                  nextWeek.setDate(today.getDate() + 7);
                  onChange(formatDateToString(nextWeek));
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                Next Week
              </button>
              <button
                onClick={() => {
                  const twoWeeks = new Date(today);
                  twoWeeks.setDate(today.getDate() + 14);
                  onChange(formatDateToString(twoWeeks));
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                2 Weeks
              </button>
              <button
                onClick={() => {
                  const nextMonth = new Date(today);
                  nextMonth.setMonth(today.getMonth() + 1);
                  onChange(formatDateToString(nextMonth));
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
              >
                Next Month
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              📅 Showtimes must be scheduled at least 7 days in advance
            </div>
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

export default CustomDatePicker;
