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
  <Space direction="vertical">
    {showDay && (
      <div className='px-4 flex items-center justify-start'>
        <Space wrap style={{ padding: "20px" }}>
          {days.map((day) => (
            <Button
              key={day}
              type="default"
              onClick={() => {
                onSelectDay(day);
                onSelectTime && onSelectTime(null);
              }}
              style={{
                border: selectedDay === day ? "2px solid #8A2BE2" : "1px solid #d9d9d9",
                color: selectedDay === day ? "#8A2BE2" : "black",
                margin: '0 5px',
              }}
            >
              {day}
            </Button>
          ))}
        </Space>
      </div>
    )}
    {showTime && (
      <div className='px-4 flex items-center justify-start'>
        <Space wrap style={{ paddingLeft: "40px" }}>
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
              .map((timeObj) => (
                <Button
                  key={timeObj.showtimeId}
                  type="default"
                  onClick={() => onSelectTime(parentVersion, timeObj.time)}
                  style={{
                    border: selectedTime === timeObj.time ? "2px solid #8A2BE2" : "1px solid #d9d9d9",
                    color: selectedTime === timeObj.time ? "#8A2BE2" : "black",
                    margin: '0 5px',
                  }}
                >
                  {timeObj.time}
                </Button>
              ))
          )}
        </Space>
      </div>
    )}
  </Space>
);

export default ShowtimeButton;
