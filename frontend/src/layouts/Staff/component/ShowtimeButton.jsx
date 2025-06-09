import { DatePicker, Button, Space, Typography} from 'antd';
import dayjs from 'dayjs';

const showtimes = ['08:30 AM', '12:30 PM', '14:30 PM', '18:00 PM', '20:00 PM', '22:30 PM'];

const ShowtimeButton = ({ selectedTime, onSelectTime }) => (
  <Space direction="vertical">
    <div className='p-4 flex items-center justify-start'>
      <DatePicker defaultValue={dayjs()} style={{marginLeft: "40px"}}/>
    </div>
    <h5 style={{ marginTop: 20 }}><i className="fa-solid fa-clock"></i> Time</h5>
    <div className='p-4 flex items-center justify-start'>
      <Space wrap style={{paddingLeft: "40px"}}>
      {showtimes.map((time) => (
        <Button
          key={time}
          type={selectedTime === time ? 'primary' : 'default'}
          onClick={() => onSelectTime(time)}
          style={{backgroundColor: selectedTime === time ? '#4F46E5' : '#fff', color: selectedTime === time ? 'white' : 'black', margin: '0 5px'}}
        >
          {time}
        </Button>
      ))}
    </Space>
    </div>
  </Space>
);

export default ShowtimeButton;
