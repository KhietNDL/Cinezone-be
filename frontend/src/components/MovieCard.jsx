import { Card } from 'antd';

const MovieCard = ({ movie, onSelect, selected }) => (
  <Card
    hoverable
    style={{ width: 140, border: selected ? '2px solid #1890ff' : '1px solid #eee' }}
    cover={<img alt={movie.title} src={movie.posterUrl} />}
    onClick={() => onSelect(movie)}
  >
    <Card.Meta title={movie.title} description={movie.description} />
  </Card>
);

export default MovieCard;
