import { DatePicker, Button, Space, Typography} from 'antd';
import dayjs from 'dayjs';

const showtimes = ['08:30 AM', '12:30 PM', '14:30 PM', '18:00 PM', '20:00 PM', '22:30 PM'];

const ShowtimeButton = ({ selectedTime, onSelectTime }) => (
  <Space direction="vertical">
    <DatePicker defaultValue={dayjs()} />
    <Typography.Title level={5} style={{ marginTop: 20 }}><i className="fa-solid fa-clock"></i> Time</Typography.Title>
    <Space wrap>
      {showtimes.map((time) => (
        <Button
          key={time}
          type={selectedTime === time ? 'primary' : 'default'}
          onClick={() => onSelectTime(time)}
        >
          {time}
        </Button>
      ))}
    </Space>
  </Space>
);

export default ShowtimeButton;
