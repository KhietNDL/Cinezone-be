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
  const handleChangeDate = (direction) => {
    const currentIdx = showtimes.findIndex((d) => {
      const dDate = new Date(d.Day).toISOString().split("T")[0];
      const sDate = new Date(selectedDate).toISOString().split("T")[0];
      return dDate === sDate;
    });

    if (currentIdx === -1) return;

    const newIndex = currentIdx + direction;

    if (newIndex >= 0 && newIndex < showtimes.length) {
      dispatch({
        type: "booking/setSelectedDate",
        payload: showtimes[newIndex].Day,
      });
      if (direction === -1 && newIndex < dateIndex) {
        setDateIndex(Math.max(0, dateIndex - 1));
      } else if (direction === 1 && newIndex >= dateIndex + 3) {
        setDateIndex(Math.min(showtimes.length - 3, dateIndex + 1));
      } else if (newIndex < dateIndex) {
        setDateIndex(newIndex);
      } else if (newIndex >= dateIndex + 3) {
        setDateIndex(Math.max(0, newIndex - 2));
      }
    }
  };

  const visibleDates = showtimes.slice(dateIndex, dateIndex + 3);

  return (
    <div className="mb-6 md:mb-8">
      <div className="space-y-6 md:space-y-0 md:flex md:items-center md:gap-4 lg:gap-8 text-sm text-white/80">
        <div className="flex-1">
          <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">
            Date
          </label>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
              onClick={() => handleChangeDate(-1)}
              disabled={dateIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <div className="flex gap-2 md:gap-3 overflow-x-auto flex-1 scrollbar-hide justify-center">
              {visibleDates.map((d, idx) => {
                const isSelected = d.Day === selectedDate;
                const dayObj = new Date(d.Day);
                const today = new Date();
                
                
                const dateToCheck = new Date(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate());
                const todayForComparison = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                
                const isPastDate = dateToCheck < todayForComparison;
                
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center w-16 md:w-20 h-12 md:h-16 rounded-2xl md:rounded-4xl text-xs md:text-sm transition-all duration-200
                      ${
                        isPastDate
                          ? "bg-gray-600/40 text-gray-400   opacity-50"
                          : isSelected
                          ? "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg cursor-pointer"
                          : "bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!isPastDate) {
                        dispatch({
                          type: "booking/setSelectedDate",
                          payload: d.Day,
                        });
                      }
                    }}
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
              className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
              onClick={() => handleChangeDate(+1)}
              disabled={dateIndex >= showtimes.length }
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
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
              className="appearance-none w-full py-3 pl-4 pr-10 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-[#36355a] to-[#4e408e] border border-purple-500/30 hover:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition duration-200 rounded-2xl md:rounded-4xl shadow-md"
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