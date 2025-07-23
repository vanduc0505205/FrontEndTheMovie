import { Button, Card, Col, Form, Input, Radio, Row, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultData = [
  {
    key: 1,
    name: "Sản phẩm 1",
    price: 700000,
    quantity: 1,
  },
  {
    key: 2,
    name: "Sản phẩm 2",
    price: 200000,
    quantity: 2,
  },
  {
    key: 3,
    name: "Sản phẩm 3",
    price: 300000,
    quantity: 3,
  },
];

import styles from './CheckoutPage.module.css';

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<string>("VNPAY");
  const [data, setData] = useState(defaultData);
  const nav = useNavigate();

  // Tăng giảm số lượng sản phẩm
  const handleChangeQuantity = (key: number, delta: number) => {
    setData(prev => prev.map(item => {
      if (item.key === key) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 140,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => <span className="checkout-price">{price.toLocaleString()}</span>
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (_: any, record: any) => (
        <div className="checkout-quantity-group">
          <button type="button" className="checkout-qty-btn" onClick={() => handleChangeQuantity(record.key, -1)}>-</button>
          <span className="checkout-qty-value">{record.quantity}</span>
          <button type="button" className="checkout-qty-btn" onClick={() => handleChangeQuantity(record.key, 1)}>+</button>
        </div>
      )
    },
    {
      title: "Thành tiền",
      key: "totalPrice",
      width: 120,
      render: (_: any, record: any) => <span className="checkout-total">{(record.price * record.quantity).toLocaleString()}</span>
    }
  ];

  // xử lý call api thanh toán
  const handlePayment = async () => {
    // tổng tiền
    const total = data.reduce((init, item) => {
      return (init += item.price * item.quantity);
    }, 0);

    // xử lý thanh toán bằng vnpay
    try {
      // VNPAY

      if (paymentMethod == "VNPAY") {
        const { data } = await axios.get(
          `http://localhost:3000/create_payment?amount=${total}`
        );

        window.location.href = data.paymentUrl;
      } else if (paymentMethod == "ZALOPAY") {
        const { data } = await axios.post(
          `http://localhost:3000/create_zalopay_order?amount=${total}`
        );
        window.location.href = data.order_url;
      }
      // ZALOPAY
    } catch (error) {}
  };

  return (
    <div className={styles['checkout-container']}>
      <h1 className={styles['checkout-title']}>Thanh toán</h1>
      <div className={styles['checkout-row']}>
        <div className={styles['checkout-form']}>
          {/* Thông tin nhận */}
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="Họ và tên" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Sô điện thoại" name="phone">
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </div>

        <div className={styles['checkout-summary']}>
          {/* Thông tin sản phẩm */}
          <Card title="Thông tin sản phẩm">
            <Table
  pagination={false}
  dataSource={data}
  columns={columns}
  style={{ width: '100%' }}
  scroll={{ x: 500 }}
/>
            <h3 style={{ color: 'orangered' }}>
  Tổng tiền: {data.reduce((init, item) => init + item.price * item.quantity, 0).toLocaleString()}
</h3>

            <Radio.Group
              defaultValue={"VNPAY"}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <Radio value={"VNPAY"}>VNPAY</Radio>
              <Radio value={"ZALOPAY"}>ZALOPAY</Radio>
              <Radio value={"COD"}>Ship COD</Radio>
            </Radio.Group>

            <Button
              onClick={handlePayment}
              style={{ marginTop: 20 }}
              color="primary"
              variant="solid"
            >
              Thanh toán
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Checkout;