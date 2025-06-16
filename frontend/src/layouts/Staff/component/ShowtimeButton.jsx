import { DatePicker, Button, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';



const ShowtimeButton = ({ selectedDay, onSelectDay, selectedTime, onSelectTime }) => {

const times = ['08:30 AM', '12:30 PM', '14:30 PM', '18:00 PM', '20:00 PM', '22:30 PM'];
const days = ['12/06/2025', '13/06/2025', '14/06/2025', '15/06/2025', '16/06/2025'];
  return (
    <Space direction="vertical">
      <h5 className='pl-15 mt-5'><i className="fa-solid fa-calendar-days "></i> Day</h5>
      <div className='px-4  flex items-center justify-start'>
        <Space wrap style={{ paddingLeft: "40px" }}>
          {days.map((day) => (
            <Button
              key={day}
              type={selectedDay === day ? 'primary' : 'default'}
              onClick={() => {
                onSelectDay(day);
                onSelectTime(null); // reset time khi đổi ngày
              }}
              style={{
                backgroundColor: selectedDay === day ? '#4F46E5' : '#fff',
                color: selectedDay === day ? 'white' : 'black',
                margin: '0 5px'
              }}
            >
              {day}
            </Button>
          ))}
        </Space>
      </div>
      {selectedDay && (
        <>
          <h5 className='pl-15'><i className="fa-solid fa-clock"></i> Time</h5>

          <div className='px-4 flex items-center justify-start'>
            <Space wrap style={{ paddingLeft: "40px" }}>
              {times.map((time) => (
                <Button
                  key={time}
                  type={selectedTime === time ? 'primary' : 'default'}
                  onClick={() => onSelectTime(time)}
                  style={{
                    backgroundColor: selectedTime === time ? '#4F46E5' : '#fff',
                    color: selectedTime === time ? 'white' : 'black',
                    margin: '0 5px'
                  }}
                >
                  {time}
                </Button>
              ))}
            </Space>
          </div>
        </>
      )}
    </Space>
  );
};

export default ShowtimeButton;
