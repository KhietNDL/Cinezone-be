import { Button, Space, Badge, Tooltip } from "antd";
import { FaCalendarAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { MdEventAvailable, MdAccessTime } from "react-icons/md";

const ShowtimeButton = ({
  selectedDay,
  onSelectDay,
  days = [],
  selectedTime,
  onSelectTime,
  times = [],
  showDay,
  showTime,
  parentVersion,
}) => {
  const parseDateFromDDMMYYYY = (str) => {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper function to format date display
  const formatDateDisplay = (dateStr) => {
    const dateObj = parseDateFromDDMMYYYY(dateStr);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = dayNames[dateObj.getDay()];
    const monthName = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();

    const isToday = dateObj.getTime() === today.getTime();
    const isTomorrow =
      dateObj.getTime() === today.getTime() + 24 * 60 * 60 * 1000;

    if (isToday)
      return { label: "Today", subLabel: `${dayName}, ${monthName} ${day}` };
    if (isTomorrow)
      return { label: "Tomorrow", subLabel: `${dayName}, ${monthName} ${day}` };

    return { label: `${dayName}`, subLabel: `${monthName} ${day}` };
  };

  return (
    <div className="w-full space-y-6">
      {showDay && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {days
            .filter((day) => {
              const dayStr = typeof day === "string" ? day : day?.date || "";
              const dateObj = parseDateFromDDMMYYYY(dayStr);
              dateObj.setHours(0, 0, 0, 0);
              return dateObj >= today;
            })
            .map((day) => {
              const dayStr = typeof day === "string" ? day : day?.date || "";
              const dateObj = parseDateFromDDMMYYYY(dayStr);
              dateObj.setHours(0, 0, 0, 0);
              const isPast = dateObj < today;
              const isSelected = selectedDay === dayStr;
              const { label, subLabel } = formatDateDisplay(dayStr);

              return (
                <Tooltip key={dayStr} title={`${subLabel} - ${dayStr}`}>
                  <button
                    disabled={isPast}
                    onClick={() => {
                      if (isPast) return;
                      onSelectDay(dayStr);
                      onSelectTime && onSelectTime(null);
                    }}
                    className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 text-center min-h-[80px] flex flex-col justify-center
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white border-purple-400 shadow-lg transform scale-105"
                            : isPast
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                            : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md hover:scale-102"
                        }
                      `}
                  >
                    <div className="font-bold text-sm">{label}</div>
                    <div
                      className={`text-xs mt-1 ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {subLabel}
                    </div>
                    {isSelected && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-white bg-purple-600 rounded-full p-1 text-lg shadow-lg" />
                    )}
                  </button>
                </Tooltip>
              );
            })}
        </div>
      )}

      {showTime && (
        <div className="space-y-4">
          {times.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MdEventAvailable className="text-4xl mx-auto mb-2 text-gray-300" />
              <p className="text-lg font-medium">No showtimes available</p>
              <p className="text-sm">Please select a different date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {times
                .slice()
                .sort((a, b) => {
                  const [ha, ma] = a.time.split(":").map(Number);
                  const [hb, mb] = b.time.split(":").map(Number);
                  return ha * 60 + ma - (hb * 60 + mb);
                })
                .map((timeObj, index) => {
                  const isSelected = selectedTime === timeObj.time;
                  const isPeak = index % 3 === 0; // Example: every 3rd slot is peak time

                  return (
                    <Tooltip
                      key={timeObj.showtimeId}
                      title={`${timeObj.time} - ${
                        parentVersion || "Standard"
                      } version`}
                    >
                      <button
                        onClick={() =>
                          onSelectTime(parentVersion, timeObj.time)
                        }
                        className={`
                            relative p-4 rounded-xl border-2 transition-all duration-300 text-center min-h-[100px] flex flex-col justify-center
                            ${
                              isSelected
                                ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white border-purple-400 shadow-lg transform scale-105"
                                : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md hover:scale-102"
                            }
                          `}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FaClock
                            className={`text-lg ${
                              isSelected ? "text-white" : "text-purple-400"
                            }`}
                          />
                          <span className="font-bold text-xl">
                            {timeObj.time}
                          </span>
                        </div>

                        {isPeak && (
                          <div
                            className={`text-xs mb-1 font-medium ${
                              isSelected ? "text-white" : "text-purple-400"
                            }`}
                          >
                            Peak Time
                          </div>
                        )}

                        {timeObj.roomName && (
                          <div
                            className={`text-xs ${
                              isSelected ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {timeObj.roomName}
                          </div>
                        )}

                        {isSelected && (
                          <FaCheckCircle className="absolute -top-2 -right-2 text-white bg-purple-600 rounded-full p-1 text-lg shadow-lg" />
                        )}
                      </button>
                    </Tooltip>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowtimeButton;
