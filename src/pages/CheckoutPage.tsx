import { Button, Card, Form, Input, Radio, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from './CheckoutPage.module.css';
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie.api";

function Checkout() {
  const location = useLocation();
  const nav = useNavigate();
  const [form] = Form.useForm();

  const bookingData = location.state;
  const { id: movieId } = useParams();
  const {
    data: movies,
    isLoading: isMovieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId!),
    enabled: !!movieId, // chỉ gọi khi có movieId
  });

  if (!bookingData) return <div>Không có dữ liệu thanh toán.</div>;

  const { seatList, totalPrice, movie } = bookingData;

  const priceMap = {
    NORMAL: 100000,
    VIP: 150000,
  };

  const [data, setData] = useState(
    seatList.map((seat: any, index: number) => ({
      key: index + 1,
      name: `Ghế ${seat.seatCode || seat.seatId}`,
      price: priceMap[seat.seatType || "NORMAL"],
      quantity: 1,
    }))
  );

  const [paymentMethod, setPaymentMethod] = useState<string>("VNPAY");

  const handleChangeQuantity = (key: number, delta: number) => {
    setData(prev =>
      prev.map(item =>
        item.key === key
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
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
      render: (price: number) => <span className="checkout-price">{price.toLocaleString()} VNĐ</span>,
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
      ),
    },
    {
      title: "Thành tiền",
      key: "totalPrice",
      width: 120,
      render: (_: any, record: any) => (
        <span className="checkout-total">{(record.price * record.quantity).toLocaleString()} VNĐ</span>
      ),
    },
  ];

  const handlePayment = async (values: any) => {

    const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      if (paymentMethod === "VNPAY") {
        const res = await axios.get(`http://localhost:3000/create_payment?amount=${total}`);
        window.location.href = res.data.paymentUrl;
      } else if (paymentMethod === "ZALOPAY") {
        const res = await axios.post(`http://localhost:3000/create_zalopay_order?amount=${total}`);
        window.location.href = res.data.order_url;
      } else {
        alert("Đặt hàng thành công với COD!");
        nav("/");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Thanh toán thất bại");
    }
  };

  return (
    <div className={styles['checkout-container']}>
      <h1 className={styles['checkout-title']}>Thanh toán</h1>
      <div className={styles['checkout-row']}>
        <div className={styles['checkout-form']}>
          <Form 
            layout="vertical" 
            form={form}
            onFinish={handlePayment}
          >
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input type="email" placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: /^\d{9,11}$/,
                  message: 'Số điện thoại phải có từ 9 đến 11 chữ số',
                },
              ]}
            >
              <Input type="tel" placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <TextArea rows={4} placeholder="Nhập địa chỉ nhận hàng" />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ width: '100%', marginTop: '16px' }}
              >
                Thanh toán
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className={styles['checkout-summary']}>
          {movies && (
            <Card
              title="Thông tin phim"
              style={{ marginBottom: 16 }}
              cover={
                <img
                  src={movies.poster || "https://via.placeholder.com/120x180?text=Poster"}
                  alt={movies.title}
                  style={{ width: 300, height: 'auto', objectFit: "cover", marginLeft: 75 }}
                />
              }
            >
              <h3>{movies.title}</h3>
              <p>Thời lượng: {movies.duration} phút</p>
              <p>Đạo diễn: {movies.director}</p>
              <p>Giới hạn tuổi: {movies.ageRating}</p>
            </Card>
          )}

          <Card title="Thông tin sản phẩm">
            <Table
              pagination={false}
              dataSource={data}
              columns={columns}
              style={{ width: '100%' }}
              scroll={{ x: 500 }}
            />

            <h3 style={{ color: 'orangered', marginTop: 16 }}>
              Tổng tiền: {data.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} VNĐ
            </h3>

            <Radio.Group
              defaultValue={"VNPAY"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <Radio value={"VNPAY"}>VNPAY</Radio>
              {/* <Radio value={"ZALOPAY"}>ZALOPAY</Radio> */}
              {/* <Radio value={"COD"}>Ship COD</Radio> */}
            </Radio.Group>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Checkout;