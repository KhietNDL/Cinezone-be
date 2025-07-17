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
}) => (
  <Space direction="vertical" className="w-full">
    {showDay && (
      <div className="px-4 flex items-center justify-start">
        <Space wrap className="py-2 w-full">
          {days.map((day) => (
            <Button
              key={day}
              type={selectedDay === day ? "primary" : "default"}
              onClick={() => {
                onSelectDay(day);
                onSelectTime && onSelectTime(null);
              }}
            >
              {day}
            </Button>
          ))}
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

export default ShowtimeButton;