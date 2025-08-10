// src/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";


/**
 * OrderHistoryPage
 * - Gọi: GET http://localhost:3000/booking/user/:userId
 * - Kỳ vọng response: { bookings: [...] } hoặc [...] (mảng)
 * - Lưu ý: user có thể được lưu vào localStorage dưới key "user" (object) hoặc "userId" (string)
 */

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ localStorage - xử lý nhiều trường hợp (user object hoặc chỉ id)
  const getUserIdFromStorage = () => {
    const rawUser = localStorage.getItem("user");
    const rawUserId = localStorage.getItem("userId");

    if (rawUserId) return rawUserId;
    if (!rawUser) return null;

    try {
      const parsed = JSON.parse(rawUser);
      return parsed?._id || parsed?.id || null;
    } catch {
      // rawUser không phải JSON, có thể trực tiếp là id string
      return rawUser;
    }
  };

  const userId = getUserIdFromStorage();

  useEffect(() => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:3000/booking/user/${userId}`
        );

        // Hỗ trợ cả 2 kiểu response: { bookings: [...] } hoặc [...]
        const raw = res.data?.bookings ?? res.data ?? [];

        // Chuẩn hoá dữ liệu để hiển thị
        const normalized = raw.map((b) => {
          // Xử lý ghế: chỉ hiển thị seatCode hoặc name, bỏ qua ObjectId
          const seatsArr = (b.seatList ?? [])
            .map((s) => {
              if (!s) return "";
              if (typeof s.seatId === "object") {
                return s.seatId?.seatCode || s.seatId?.name || "";
              }
              // Nếu là string (ObjectId) thì bỏ qua
              return "";
            })
            .filter((seat) => seat); // bỏ ghế rỗng

          // Xử lý tên phim
          const movieTitle =
            (b.showtimeId &&
              typeof b.showtimeId === "object" &&
              b.showtimeId.movieId &&
              b.showtimeId.movieId.title) ||
            b.movieTitle ||
            (b.showtimeId &&
              typeof b.showtimeId === "object" &&
              b.showtimeId.title) ||
            "—";

          return {
            ...b,
            key: b._id,
            movieTitle,
            seats:
              seatsArr.length > 0 ? seatsArr : ["(Không rõ)"],
            totalPrice: b.totalPrice ?? b.totalAmount ?? 0,
            bookingDate: b.createdAt,
          };
        });

        setOrders(normalized);
      } catch (err) {
        console.error("Lỗi lấy lịch sử đặt vé:", err);
        message.error("Không thể tải lịch sử đặt vé");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Lịch sử đặt vé</h2>
        <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Mã đặt vé",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text) => text || "—",
    },
    {
      title: "Ghế",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        price?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử đặt vé</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default OrderHistoryPage;
