import React from "react";
import { BiSolidCameraMovie } from "react-icons/bi";
import { toast } from "react-toastify";
import CustomDatePicker from "../../../component/CustomDatePicker";
import CustomTimePicker from "../../../component/CustomTimePicker ";
import { createShowtime } from "../../../services/API";

const AddShowtimePopup = ({
  showAddShowtimePopup,
  selectedMovie,
  cinemaRooms,
  selectedRoomId,
  setSelectedRoomId,
  showtimeDate,
  setShowtimeDate,
  showtimeTimes,
  setShowtimeTimes,
  closeAddShowtimePopup,
  getMovieData,
  setLoading,
}) => {
  const handleAddShowtime = async () => {
    if (!selectedMovie) {
      toast.error("No movie selected");
      return;
    }
    if (!showtimeDate) {
      toast.error("Showtime date is required");
      return;
    }
    if (showtimeTimes.length === 0 || showtimeTimes.every((time) => !time)) {
      toast.error("At least one start time is required");
      return;
    }
    if (!selectedRoomId) {
      toast.error("Cinema room selection is required");
      return;
    }
    const selectedDate = new Date(showtimeDate);
    const currentDate = new Date();
    const minAllowedDate = new Date(currentDate);
    minAllowedDate.setDate(currentDate.getDate() + 7);
    if (selectedDate < minAllowedDate) {
      toast.error("Showtime date must be at least 7 days from today");
      return;
    }
    const times = showtimeTimes.filter((time) => time);
    if (times.length === 0) {
      toast.error("At least one valid start time is required");
      return;
    }
    const validateTimeFormat = (timeStr) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
      return timeRegex.test(timeStr);
    };
    const invalidTimes = times.filter((time) => !validateTimeFormat(time));
    if (invalidTimes.length > 0) {
      toast.error(
        `Invalid time format. Use hh:mm:ss. Invalid times: ${invalidTimes.join(
          ", "
        )}`
      );
      return;
    }
    const duration = parseInt(selectedMovie.RunningTime, 10) + 20;

    const versionId =
      selectedMovie.versions &&
      Array.isArray(selectedMovie.versions) &&
      selectedMovie.versions.length > 0
        ? selectedMovie.versions[0].VersionId
        : null;
    if (!versionId) {
      toast.error(
        `No valid VersionId found for this movie. Versions: ${
          selectedMovie.versions
            ? JSON.stringify(selectedMovie.versions)
            : "undefined or null"
        }`
      );
      return;
    }

    const showtimeData = {
      VersionId: versionId,
      CinemaRoomId: selectedRoomId,
      Day: showtimeDate,
      Times: times,
      Duration: duration,
    };
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await createShowtime(showtimeData);
      toast.success("Showtime added successfully!");
      getMovieData();
    } catch (error) {
      toast.error(`Failed to add showtime: ${error.message || "Server error"}`);
    } finally {
      setLoading(false);
      closeAddShowtimePopup();
    }
  };

  if (!showAddShowtimePopup || !selectedMovie) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 add-showtime-popup">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Add New Showtime</h2>
              <p className="text-purple-100 text-sm">
                Schedule a new movie session
              </p>
            </div>
            <button
              onClick={closeAddShowtimePopup}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 hover:rotate-90 group"
            >
              <svg
                className="w-6 h-6 group-hover:text-purple-100 transition-colors duration-200"
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

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Movie Info Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-4 flex items-center">
              <BiSolidCameraMovie size={20} className="mr-2 text-purple-600" />
              Movie Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-start md:items-center gap-2">
                  <span className="text-sm font-semibold text-purple-700">
                    English:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedMovie.NameOfEnglish}
                  </span>
                </div>
                <div className="flex items-start md:items-center gap-2">
                  <span className="text-sm font-semibold text-purple-700">
                    Vietnamese:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedMovie.NameOfVietnamese}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                  <svg
                    className="w-4 h-4 inline mr-1"
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
                  {selectedMovie.RunningTime} mins
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Date Selection */}
            <CustomDatePicker
              value={showtimeDate}
              onChange={setShowtimeDate}
              minDate={
                new Date(new Date().setDate(new Date().getDate() + 7))
                  .toISOString()
                  .split("T")[0]
              }
            />

            {/* Time Slots */}
            <CustomTimePicker
              times={showtimeTimes}
              setTimes={setShowtimeTimes}
            />

            {/* Duration Display */}
            <div className="group">
              <label className="flex text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 items-center">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Total Duration (Including Ads)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${
                    parseInt(selectedMovie.RunningTime, 10) + 20
                  } minutes`}
                  readOnly
                  className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-semibold text-lg cursor-not-allowed focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Cinema Room Selection */}
            <div className="group">
              <label className="flex text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 items-center">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Select Cinema Room
              </label>
              <div className="space-y-3">
                {cinemaRooms.map((room) => (
                  <div
                    key={room.CinemaRoomId}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer group/room hover:shadow-md ${
                      selectedRoomId === room.CinemaRoomId
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50"
                    }`}
                    onClick={() => setSelectedRoomId(room.CinemaRoomId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                            selectedRoomId === room.CinemaRoomId
                              ? "bg-gradient-to-r from-purple-200 to-purple-300"
                              : "bg-gradient-to-r from-purple-100 to-purple-200 group-hover/room:from-purple-200 group-hover/room:to-purple-300"
                          }`}
                        >
                          <svg
                            className="w-6 h-6 text-purple-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10l1 8H6l1-8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg group-hover/room:text-purple-700 transition-colors duration-200">
                            {room.Name} - ( {room.SeatQuantity} Seats )
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Room ID: {room.CinemaRoomId}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                          selectedRoomId === room.CinemaRoomId
                            ? "border-purple-500 bg-purple-500 shadow-sm"
                            : "border-gray-300 group-hover/room:border-purple-500"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            selectedRoomId === room.CinemaRoomId
                              ? "bg-white"
                              : "bg-purple-500 opacity-0 group-hover/room:opacity-100"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {cinemaRooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="font-semibold">No cinema rooms available</p>
                  <p className="text-sm">Please add cinema rooms first</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={closeAddShowtimePopup}
            className="px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAddShowtime}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5 inline mr-2"
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
            Add Showtime
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowtimePopup;
