import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  message,
  Spin,
  Button,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getUserBookings } from "@/api/booking.api";

const { RangePicker } = DatePicker;

const DashboardAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lọc trạng thái và ngày
  const [filterStatus, setFilterStatus] = useState(null); // null = tất cả
  const [filterDateRange, setFilterDateRange] = useState([null, null]);

  // Lấy userId từ localStorage (giống trang quản lý đơn hàng)
  const getUserIdFromStorage = () => {
    const rawUser = localStorage.getItem("user");
    const rawUserId = localStorage.getItem("userId");

    if (rawUserId) return rawUserId;
    if (!rawUser) return null;

    try {
      const parsed = JSON.parse(rawUser);
      return parsed?._id || parsed?.id || null;
    } catch {
      return rawUser;
    }
  };
  const userId = getUserIdFromStorage();

  // Fetch đơn hàng user
  const fetchOrders = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getUserBookings(userId);
      const raw = res.data?.bookings ?? res.data ?? [];
      // Chuẩn hóa dữ liệu giống trang quản lý đơn hàng
      const normalized = raw.map((b) => {
        const seatsArr = (b.seatList ?? [])
          .map((s) => {
            if (!s) return "";
            if (typeof s.seatId === "object") {
              return s.seatId?.seatCode || s.seatId?.name || "";
            }
            return "";
          })
          .filter(Boolean);
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
          seats: seatsArr.length > 0 ? seatsArr : ["(Không rõ)"],
          totalPrice: b.totalPrice ?? b.totalAmount ?? 0,
          bookingDate: b.createdAt,
        };
      });
      setOrders(normalized);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu đơn hàng:", err);
      message.error("Không thể tải dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [userId]);

  // --------- Tính toán dữ liệu thống kê -----------

  // Lọc dữ liệu đơn hàng theo filter
  const filteredOrders = orders.filter((order) => {
    // Lọc theo trạng thái
    if (filterStatus && order.status !== filterStatus) return false;

    // Lọc theo ngày
    if (filterDateRange[0] && filterDateRange[1]) {
      const orderDate = dayjs(order.bookingDate);
      if (
        orderDate.isBefore(filterDateRange[0], "day") ||
        orderDate.isAfter(filterDateRange[1], "day")
      ) {
        return false;
      }
    }
    return true;
  });

  // Tổng doanh thu chỉ tính đơn paid
  const totalRevenue = filteredOrders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // Số người dùng (unique userId trong orders)
  // Nếu đơn hàng có userId (nếu không bạn có thể tùy chỉnh)
  const uniqueUserIds = new Set(filteredOrders.map((o) => o.userId || userId));
  const totalUsers = uniqueUserIds.size;

  // Doanh thu theo ngày (nhóm theo ngày)
  const revenueByDayMap = {};
  filteredOrders.forEach((o) => {
    if (o.status !== "paid") return; // chỉ tính đơn thanh toán
    const dateKey = dayjs(o.bookingDate).format("MM/DD");
    revenueByDayMap[dateKey] = (revenueByDayMap[dateKey] || 0) + o.totalPrice;
  });
  const revenueByDay = Object.entries(revenueByDayMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => dayjs(a.date, "MM/DD").isBefore(dayjs(b.date, "MM/DD")) ? -1 : 1);

  // Doanh thu theo phim (nhóm theo movieTitle)
  const revenueByMovieMap = {};
  filteredOrders.forEach((o) => {
    if (o.status !== "paid") return;
    const movie = o.movieTitle || "Không rõ";
    revenueByMovieMap[movie] = (revenueByMovieMap[movie] || 0) + o.totalPrice;
  });
  const revenueByMovie = Object.entries(revenueByMovieMap).map(([title, revenue]) => ({
    title,
    revenue,
  }));

  // --------- Cột bảng doanh thu phim -----------
  const columns = [
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (val) => val.toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số người dùng đặt vé"
              value={totalUsers}
              prefix={<UserOutlined />}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={filteredOrders.length}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc trạng thái và ngày */}
      <Row gutter={[16, 16]} style={{ marginTop: 20, marginBottom: 20 }}>
        <Col span={8}>
          <Select
            allowClear
            placeholder="Chọn trạng thái"
            style={{ width: "100%" }}
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
          >
            <Select.Option value="paid">Đã thanh toán</Select.Option>
            <Select.Option value="unpaid">Chưa thanh toán</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
            <Select.Option value="pending">Đang xử lý</Select.Option>
          </Select>
        </Col>
        <Col span={16}>
          <RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setFilterDateRange(dates || [null, null])}
            allowEmpty={[true, true]}
          />
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo ngày */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="📈 Doanh thu theo ngày">
            {revenueByDay.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={revenueByDay}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1890ff"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo phim */}

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="📊 Doanh thu theo phim (VNĐ)">
            {revenueByMovie.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueByMovie}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>


      {/* Bảng chi tiết doanh thu từng phim */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="📋 Chi tiết doanh thu theo phim">
            <Table
              dataSource={revenueByMovie}
              rowKey="title"
              pagination={false}
              columns={columns}
              locale={{ emptyText: "Không có dữ liệu" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
