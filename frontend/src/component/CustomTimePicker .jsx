import React, { useState } from "react";

const CustomTimePicker = ({ times, setTimes }) => {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(null);

  // Popular time slots
  const popularTimes = [
    { time: "09:00:00", label: "Morning Show", period: "AM" },
    { time: "12:00:00", label: "Lunch Time", period: "PM" },
    { time: "15:00:00", label: "Afternoon", period: "PM" },
    { time: "18:00:00", label: "Evening", period: "PM" },
    { time: "21:00:00", label: "Night Show", period: "PM" },
    { time: "23:30:00", label: "Late Night", period: "PM" },
  ];

  // Generate time options (every 15 minutes)
  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`;
        const displayTime = formatTime12Hour(timeStr);
        timeOptions.push({ value: timeStr, display: displayTime });
      }
    }
    return timeOptions;
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${period}`;
  };

  const addTimeSlot = () => {
    setTimes([...times, ""]);
  };

  const removeTimeSlot = (index) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index, time) => {
    const newTimes = [...times];
    newTimes[index] = time;
    setTimes(newTimes);
  };

  const openTimeModal = (index) => {
    setCurrentSlotIndex(index);
    setShowTimeModal(true);
  };

  const selectTime = (time) => {
    updateTimeSlot(currentSlotIndex, time);
    setShowTimeModal(false);
  };

  const getTimeSlotDisplay = (time) => {
    if (!time) return "Select time";
    return formatTime12Hour(time);
  };

  return (
    <div className="group">
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Show Times
      </label>

      <div className="space-y-4">
        {/* Time Slots */}
        {times.map((time, index) => (
          <div key={index} className="relative">
            <div className="flex items-center space-x-3">
              {/* Time Display */}
              <div
                onClick={() => openTimeModal(index)}
                className={`flex-1 px-6 py-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  time
                    ? "border-purple-200 bg-purple-50/50 hover:bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                } focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-500`}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <div
                        className={`text-lg font-medium ${
                          time ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {getTimeSlotDisplay(time)}
                      </div>
                      {popularTimes.some((pt) => pt.time === time) && (
                        <div className="text-xs text-purple-600 font-medium">
                          Popular Time
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {time && (
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        Slot {index + 1}
                      </div>
                    )}
                    <svg
                      className="w-4 h-4 text-gray-400"
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
              </div>

              {/* Remove Button */}
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Time Slot Button */}
        <button
          type="button"
          onClick={addTimeSlot}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-2 border-dashed border-purple-300 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 hover:border-purple-400"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Another Time Slot</span>
        </button>
      </div>

      {/* Time Selection Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Select Show Time</h3>
                <button
                  onClick={() => setShowTimeModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Popular Times */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Popular Show Times
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {popularTimes.map((popularTime) => (
                    <button
                      key={popularTime.time}
                      onClick={() => selectTime(popularTime.time)}
                      className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200 text-left group"
                    >
                      <div className="font-semibold text-purple-700 text-lg">
                        {formatTime12Hour(popularTime.time)}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">
                        {popularTime.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Time Grid */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  All Available Times
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {generateTimeOptions().map((timeOption) => (
                    <button
                      key={timeOption.value}
                      onClick={() => selectTime(timeOption.value)}
                      className="p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                    >
                      {timeOption.display}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
