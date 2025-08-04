import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { MdOutlineMeetingRoom } from "react-icons/md";

const ShowtimeSelector = ({
  showtimes,
  dateIndex,
  selectedDate,
  timeOptions,
  selectedShowtimeId,
  selectedRoom,
  setDateIndex,
  dispatch,
}) => {
  // Validate date
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const safeCreateDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  };

  // Lọc showtimes để bỏ ngày quá khứ
  const validShowtimes = (showtimes || []).filter((d) => {
    if (!d || !d.Day) return false;
    const dayObj = safeCreateDate(d.Day);
    if (!dayObj) return false;

    const today = new Date();
    const dateToCheck = new Date(
      dayObj.getFullYear(),
      dayObj.getMonth(),
      dayObj.getDate()
    );
    const todayForComparison = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return dateToCheck >= todayForComparison;
  });

  // Scroll
  const handleChangeDate = (direction) => {
    if (!validShowtimes || validShowtimes.length === 0) return;
    const newDateIndex = dateIndex + direction;

    if (newDateIndex >= 0 && newDateIndex <= validShowtimes.length - 3) {
      setDateIndex(newDateIndex);
    }
  };

  const canGoLeft = dateIndex > 0;
  const canGoRight = dateIndex < validShowtimes.length - 3;
  const visibleDates = validShowtimes.slice(dateIndex, dateIndex + 3);

  // Early return nếu không có dữ liệu
  if (!validShowtimes || validShowtimes.length === 0) {
    return (
      <div className="mb-6 md:mb-8">
        <div className="text-center text-white/60">
          <p>No upcoming showtime data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 md:mb-8">
      <div className="space-y-6 md:space-y-0 md:flex md:items-center md:gap-4 lg:gap-8 text-sm text-white/80">
        {/* Date Selector */}
        <div className="flex-1">
          <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">
            Date
          </label>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                canGoLeft
                  ? "text-purple-400 hover:text-purple-300 hover:bg-white/10"
                  : "text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => handleChangeDate(-1)}
              disabled={!canGoLeft}
            >
              <FaChevronLeft />
            </button>
            <div className="flex gap-2 md:gap-3 overflow-x-auto flex-1 scrollbar-hide justify-center">
              {visibleDates.map((d, idx) => {
                const dayObj = safeCreateDate(d.Day);
                if (!dayObj) {
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center w-16 md:w-20 h-12 md:h-16 rounded-2xl md:rounded-4xl text-xs md:text-sm bg-gray-600/20 text-gray-500"
                    >
                      <span>Invalid Date</span>
                    </div>
                  );
                }

                const isSelected = d.Day === selectedDate;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center w-16 md:w-20 h-12 md:h-16 rounded-2xl md:rounded-4xl text-xs md:text-sm transition-all duration-200
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600/30 via-purple-500/100 to-purple-600/30 text-white shadow-lg cursor-pointer"
                          : "bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                      }`}
                    onClick={() =>
                      dispatch({
                        type: "booking/setSelectedDate",
                        payload: d.Day,
                      })
                    }
                  >
                    <span className="text-[8px] md:text-[10px] font-medium opacity-90">
                      {dayObj
                        .toLocaleDateString("en-US", { month: "short" })
                        .toUpperCase()}
                    </span>
                    <span className="text-sm md:text-base font-bold">
                      {dayObj.getDate().toString().padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] opacity-90 hidden md:block">
                      {dayObj
                        .toLocaleDateString("en-US", { weekday: "short" })
                        .toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                canGoRight
                  ? "text-purple-400 hover:text-purple-300 hover:bg-white/10"
                  : "text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => handleChangeDate(+1)}
              disabled={!canGoRight}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Time Selector */}
        <div className="w-full md:w-64 lg:w-80">
          <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">
            Time
          </label>
          <div className="relative">
            <select
              value={selectedShowtimeId || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const matched = timeOptions
                  .flatMap((ver) =>
                    ver.showtimes.map((s) => ({ ...s, version: ver.version }))
                  )
                  .find((s) => s.showtimeId === selectedId);
                if (matched) {
                  dispatch({
                    type: "booking/setSelectedTime",
                    payload: matched.time,
                  });
                  dispatch({
                    type: "booking/setSelectedRoom",
                    payload: `Room ${matched.roomName} — ${matched.version}`,
                  });
                  dispatch({
                    type: "booking/setSelectedShowtimeId",
                    payload: matched.showtimeId,
                  });
                } else {
                  dispatch({ type: "booking/setSelectedTime", payload: "" });
                  dispatch({ type: "booking/setSelectedRoom", payload: "" });
                  dispatch({
                    type: "booking/setSelectedShowtimeId",
                    payload: null,
                  });
                }
              }}
              className="appearance-none w-full py-3 pl-4 pr-10 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-purple-600/30 via-purple-500/100 to-purple-600/30 border border-purple-500/30 hover:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition duration-200 rounded-2xl md:rounded-4xl shadow-md"
            >
              <option value="" disabled>
                Choose Time
              </option>
              {timeOptions.flatMap((ver) =>
                ver.showtimes.map((s) => (
                  <option
                    key={s.showtimeId}
                    value={s.showtimeId}
                    className="text-gray-900 bg-white"
                  >
                    {s.time} - ({ver.version})
                  </option>
                ))
              )}
            </select>
            <FaChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-300 pointer-events-none text-sm" />
          </div>
        </div>

        {/* Room Info */}
        <div className="w-full md:w-48 lg:w-64">
          <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">
            Room
          </label>
          <div className="bg-white/10 rounded-2xl md:rounded-4xl p-3 border border-white/20 h-12 flex items-center">
            <div className="flex items-center gap-2 text-white text-xs md:text-sm font-medium">
              <MdOutlineMeetingRoom className="text-purple-400 text-lg flex-shrink-0" />
              <span className="truncate">{selectedRoom || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeSelector;
