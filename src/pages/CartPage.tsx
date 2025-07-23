import React, { useState } from 'react';
import { Table, InputNumber, Button, Popconfirm, Typography } from 'antd';

const { Title } = Typography;

const initialCart = [
  {
    key: '1',
    name: 'Sản phẩm A',
    price: 100000,
    quantity: 1,
  },
  {
    key: '2',
    name: 'Sản phẩm B',
    price: 200000,
    quantity: 2,
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (key: string, value: number) => {
    const updatedCart = cart.map((item) =>
      item.key === key ? { ...item, quantity: value } : item
    );
    setCart(updatedCart);
  };

  const removeItem = (key: string) => {
    setCart(cart.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (_: any, record: any) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.key, value || 1)}
        />
      ),
    },
    {
      title: 'Tổng',
      render: (_: any, record: any) =>
        `${(record.price * record.quantity).toLocaleString()}đ`,
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa sản phẩm?"
          onConfirm={() => removeItem(record.key)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Giỏ hàng</Title>
      <Table
        columns={columns}
        dataSource={cart}
        pagination={false}
        footer={() => (
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            Tổng cộng: {total.toLocaleString()}đ
          </div>
        )}
      />
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button type="primary" href="/checkout">
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
