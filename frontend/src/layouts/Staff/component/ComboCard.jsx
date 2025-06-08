import { Card } from 'antd';

const ComboCard = ({ combo, onAdd, selected }) => (
  <Card
    hoverable
    style={{
      width: 250,
      margin: '0 12px 16px',
      boxShadow: selected
        ? '0 8px 16px gray'
        : '0 2px 8px #eee',
      transition: 'box-shadow 0.2s',
      cursor: 'pointer',
      border: '1px solid lightgray'
    }}
    cover={
      <img
        alt={combo.name}
        src={combo.image}
        style={{ height: 170, objectFit: 'cover', padding: 8, borderRadius: '10px 10px 0 0' }}
      />
    }
    onClick={() => onAdd(combo)}
    bodyStyle={{ padding: 16, textAlign: 'center' }}
  >
    <Card.Meta
      title={
        <div
          className="font-semibold text-base"
          style={{
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'clip',
            width: '100%',
            display: 'block',
            minHeight: 44,
            lineHeight: '22px'
          }}
          title={combo.name}
        >
          {combo.name}
        </div>
      }
      description={
        <div style={{ fontWeight: 500, color: 'green', marginTop: 8, fontSize: 20 }}>${combo.price}</div>
      }
    />
  </Card>
);

export default ComboCard;