import { Table, InputNumber, Button } from 'antd';
import React from 'react';
import '../../src/components/ComboTable.css'; // Assuming you have some styles for the table



const CartTable = ({ cart, onUpdateQty, onRemove }) => {
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (img) => <img src={img} alt="combo" width={50} />
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => onUpdateQty(record.key, value)}
        />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
      title: 'Total',
      render: (_, record) => `$${record.price * record.quantity}`
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger onClick={() => onRemove(record.key)}>Delete</Button>
      )
    }
  ];

  return <Table   className="custom-table"  rowKey="key" dataSource={cart} columns={columns} pagination={false} style={{backgroundColor: '#4F46E5', color: 'white'}} />;
};

export default CartTable;
