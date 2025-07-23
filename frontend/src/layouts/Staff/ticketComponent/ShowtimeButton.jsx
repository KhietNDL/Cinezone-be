import { Button, Space } from 'antd';

const ShowtimeButton = ({
  selectedDay,
  onSelectDay,
  days = [],
  selectedTime,
  onSelectTime,
  times = [],
  showDay,
  showTime,
  parentVersion
}) => {
  // Lấy ngày hiện tại (yyyy-mm-dd)
//  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <Space direction="vertical" className="w-full">
      {showDay && (
        <div className="px-4 flex items-center justify-start">
          <Space wrap className="py-2 w-full">
            {days.map((day) => {
              const dayStr = typeof day === "string" ? day : (day?.date || "");

              const parseDateFromDDMMYYYY = (str) => {
                const [day, month, year] = str.split("/").map(Number);
                return new Date(year, month - 1, day);
              };

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const dateObj = parseDateFromDDMMYYYY(dayStr);
              dateObj.setHours(0, 0, 0, 0);

              const isPast = dateObj < today;

              return (
                <Button
                  key={dayStr}
                  type={selectedDay === dayStr ? "primary" : "default"}
                  disabled={isPast}
                  style={isPast ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  onClick={() => {
                    if (isPast) return;
                    onSelectDay(dayStr);
                    onSelectTime && onSelectTime(null);
                  }}
                >
                  {dayStr}
                </Button>
              );
            })}
          </Space>
        </div>
      )}

      {showTime && (
        <div className="px-4 flex items-center justify-start">
          <Space wrap className="pl-2 w-full">
            {times.length === 0 ? (
              <span>No showtimes</span>
            ) : (
              times
                .slice()
                .sort((a, b) => {
                  const [ha, ma] = a.time.split(':').map(Number);
                  const [hb, mb] = b.time.split(':').map(Number);
                  return ha * 60 + ma - (hb * 60 + mb);
                })
                .map((timeObj) => {
                  const isSelected = selectedTime === timeObj.time;

                  return (
                    <Button
                      key={timeObj.showtimeId}
                      type={isSelected ? "primary" : "default"}
                      onClick={() => onSelectTime(parentVersion, timeObj.time)}
                      style={isSelected ? { border: "2px solid white" } : {}}
                    >
                      {timeObj.time}
                    </Button>
                  );
                })
            )}
          </Space>
        </div>
      )}

    </Space>
  );
};

export default ShowtimeButton;