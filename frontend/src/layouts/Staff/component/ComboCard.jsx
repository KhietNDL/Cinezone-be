import { Card, Button } from 'antd';

const ComboCard = ({ combo, onAdd }) => (
  <Card
    hoverable
    style={{ width: 180 }}
    cover={<img alt={combo.name} src={combo.image} />}
  >
    <Card.Meta title={combo.name} description={`$${combo.price}`} />
    <Button block type="primary" onClick={() => onAdd(combo)}>Add</Button>
  </Card>
);

export default ComboCard;
