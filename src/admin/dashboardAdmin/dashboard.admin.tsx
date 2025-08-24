import React, { useEffect, useMemo, useState } from "react";
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
  Tag,
  Space,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAllBookings } from "@/api/booking.api";

const { RangePicker } = DatePicker;

interface RawSeatItem {
  seatId?: { seatCode?: string; name?: string } | string | null;
}

interface RawShowtime {
  title?: string;
  cinemaName?: string;
  cinema?: string;
  movieId?: { title?: string };
}

interface RawBooking {
  _id: string;
  seatList?: (RawSeatItem | null)[];
  showtimeId?: RawShowtime | string | null;
  movieTitle?: string;
  totalPrice?: number;
  totalAmount?: number;
  createdAt?: string;
  status?: string;
  userId?: string;
}

interface OrderRow {
  cinema: any;
  _id: string;
  key: string;
  userId?: string;
  movieTitle: string;
  cinemaName: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  status?: string;
}

interface MovieRevenue { title: string; revenue: number }
interface MovieSeats { title: string; seats: number }
interface HourRevenue { hour: string; revenue: number }
interface StatusCount { status: string; count: number }
interface TopUser { id: string; revenue: number }


const VND = (n: number = 0) => Number(n || 0).toLocaleString("vi-VN");
const formatDate = (d?: string) => (d ? dayjs(d).format("YYYY-MM-DD HH:mm") : "—");

const STATUS_COLORS: Record<string, string> = {
  paid: "green",
  unpaid: "orange",
  cancelled: "red",
  pending: "blue",
};

const CHART_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#a28bff",
  "#ff9f7f",
  "#b6e3ff",
];


const DashboardAdmin: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<any[]>([null, null]);
  const [filterMovie, setFilterMovie] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      const raw: RawBooking[] = (res.data?.bookings ?? res.data ?? []) as RawBooking[];

      const normalized: OrderRow[] = raw.map((b) => {
        const seatsArr = (b.seatList ?? [])
          .map((s) => {
            if (!s) return "";
            const seat: any = (s as RawSeatItem)?.seatId;
            if (seat && typeof seat === "object") {
              return seat?.seatCode || seat?.name || "";
            }
            return "";
          })
          .filter(Boolean) as string[];

        const st: any = b.showtimeId;

        const movieTitle =
          (st && typeof st === "object" && st.movieId && st.movieId.title) ||
          b.movieTitle ||
          (st && typeof st === "object" && st.title) ||
          "—";

        const cinemaName =
          (st && typeof st === "object" && (st.cinemaName || st.cinema)) ||
          (b as any).cinemaName ||
          "—";

        const userIdStr = ((): string | undefined => {
          const uid: any = (b as any).userId;
          if (!uid) return undefined;
          if (typeof uid === "string") return uid;
          if (typeof uid === "object") return uid._id || uid.id || undefined;
          return undefined;
        })();

        return {
          ...(b as any),
          key: b._id,
          userId: userIdStr,
          movieTitle,
          cinemaName,
          seats: seatsArr.length > 0 ? seatsArr : ["(Không rõ)"],
          totalPrice: Number(b.totalPrice ?? b.totalAmount ?? 0),
          bookingDate: b.createdAt || "",
        } as OrderRow;
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
    fetchOrders();
  }, []);

 
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filterStatus && order.status !== filterStatus) return false;

      if (filterMovie && order.movieTitle !== filterMovie) return false;

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
  }, [orders, filterStatus, filterDateRange, filterMovie]);

 
  const allMovies = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.movieTitle).filter(Boolean)));
  }, [orders]);

  
  const totalRevenue = useMemo(
    () =>
      filteredOrders
        .filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0),
    [filteredOrders]
  );

  const uniqueUserIds = useMemo(() => {
    return new Set(filteredOrders.map((o) => o.userId).filter(Boolean) as string[]);
  }, [filteredOrders]);

  const totalUsers = uniqueUserIds.size;

  const totalSeatsSold = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.seats?.length || 0), 0),
    [filteredOrders]
  );

  const averageOrderValue = useMemo(() => {
    return filteredOrders.length > 0
      ? Math.round(totalRevenue / filteredOrders.length)
      : 0;
  }, [filteredOrders.length, totalRevenue]);

  const paidOrdersCount = useMemo(
    () => filteredOrders.filter((o) => o.status === "paid").length,
    [filteredOrders]
  );

  const paidRate = filteredOrders.length
    ? ((paidOrdersCount / filteredOrders.length) * 100).toFixed(1)
    : "0";

 
  const revenueByDay: { date: string; revenue: number }[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      if (o.status !== "paid") return;
      const dateKey = dayjs(o.bookingDate).format("MM/DD");
      map[dateKey] = (map[dateKey] || 0) + (Number(o.totalPrice) || 0);
    });
    return Object.entries(map)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) =>
        dayjs(a.date, "MM/DD").isBefore(dayjs(b.date, "MM/DD")) ? -1 : 1
      );
  }, [filteredOrders]);

  const revenueByMovie: MovieRevenue[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      if (o.status !== "paid") return;
      const movie = o.movieTitle || "Không rõ";
      map[movie] = (map[movie] || 0) + (Number(o.totalPrice) || 0);
    });
    return Object.entries(map)
      .map(([title, revenue]) => ({ title, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const seatsByMovie: MovieSeats[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const movie = o.movieTitle || "Không rõ";
      map[movie] = (map[movie] || 0) + (o.seats?.length || 0);
    });
    return Object.entries(map)
      .map(([title, seats]) => ({ title, seats }))
      .sort((a, b) => b.seats - a.seats);
  }, [filteredOrders]);

  const revenueByHour: HourRevenue[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      if (o.status !== "paid") return;
      const h = dayjs(o.bookingDate).hour();
      const key = `${h}:00`;
      map[key] = (map[key] || 0) + (Number(o.totalPrice) || 0);
    });
    return Object.entries(map)
      .map(([hour, revenue]) => ({ hour, revenue }))
      .sort((a, b) => {
        const ha = parseInt(a.hour);
        const hb = parseInt(b.hour);
        return ha - hb;
      });
  }, [filteredOrders]);

  const statusBreakdown: StatusCount[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const st = o.status || "unknown";
      map[st] = (map[st] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [filteredOrders]);

  const topMovie: MovieRevenue | null = revenueByMovie[0] || null;

  
  const toCSV = (rows: any[], headers?: string[]) => {
    const csvRows: string[] = [];
    if (headers) csvRows.push(headers.join(","));
    rows.forEach((r) => {
      const vals = headers ? headers.map((h) => (r as any)[h]) : Object.values(r);
      csvRows.push(
        vals
          .map((v) => {
            const s = String(v ?? "");
            if (s.includes(",") || s.includes("\n") || s.includes("\"")) {
              return '"' + s.replace(/\"/g, '""') + '"';
            }
            return s;
          })
          .join(",")
      );
    });
    return csvRows.join("\n");
  };

 const download = (filename: string, text: string) => {
 
  const bom = "\uFEFF";
  const blob = new Blob([bom + text], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleExportRevenueByDay = () => {
  const csv = toCSV(revenueByDay, ["date", "revenue"]);
  download(`revenue_by_day_${Date.now()}.csv`, csv);
};

const handleExportRevenueByMovie = () => {
  const csv = toCSV(revenueByMovie, ["title", "revenue"]);
  download(`revenue_by_movie_${Date.now()}.csv`, csv);
};

const handleExportOrders = () => {
  const rows = filteredOrders.map((o) => ({
    id: o._id,
    createdAt: formatDate(o.bookingDate),
    movieTitle: o.movieTitle,
    seats: o.seats?.join(" "),
    totalPrice: o.totalPrice,
    status: o.status,
  }));
  const csv = toCSV(rows, [
    "id",
    "createdAt",
    "movieTitle",
    "seats",
    "totalPrice",
    "status",
  ]);
  download(`orders_${Date.now()}.csv`, csv);
};



  const revenueByMovieColumns: ColumnsType<MovieRevenue> = [
    { title: "Tên phim", dataIndex: "title", key: "title" },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (val: number) => VND(val),
      sorter: (a, b) => a.revenue - b.revenue,
      defaultSortOrder: "descend",
    },
  ];

  const topUsers: TopUser[] = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      if (o.status !== "paid") return;
      const uid = o.userId || "Unknown";
      map[uid] = (map[uid] || 0) + (Number(o.totalPrice) || 0);
    });
    return Object.entries(map)
      .map(([id, revenue]) => ({ id, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  const topUsersColumns: ColumnsType<TopUser> = [
    { title: "User ID", dataIndex: "id", key: "id" },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (val: number) => VND(val),
      sorter: (a, b) => a.revenue - b.revenue,
    },
  ];

  const recentOrdersColumns: ColumnsType<OrderRow> = [
    { title: "Mã đơn", dataIndex: "_id", key: "_id", width: 220 },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (v: string) => formatDate(v),
      sorter: (a, b) => dayjs(a.bookingDate).valueOf() - dayjs(b.bookingDate).valueOf(),
      defaultSortOrder: "descend",
    },
    { title: "Phim", dataIndex: "movieTitle", key: "movieTitle" },
    { title: "Rạp", dataIndex: "cinemaName", key: "cinemaName" },
    {
      title: "Số ghế",
      key: "seatsCount",
      render: (_, r) => r.seats?.length || 0,
      sorter: (a, b) => (a.seats?.length || 0) - (b.seats?.length || 0),
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v: number) => VND(v),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (st?: string) => <Tag color={STATUS_COLORS[st || ""] || "default"}>{st}</Tag>,
      filters: [
        { text: "Đã thanh toán", value: "paid" },
        { text: "Chưa thanh toán", value: "unpaid" },
        { text: "Đã hủy", value: "cancelled" },
       
      ],
      onFilter: (val: any, rec) => rec.status === val,
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
      {/* KPI Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Số người dùng đặt vé" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tổng số đơn hàng" value={filteredOrders.length} />
          </Card>
        </Col>
      </Row>

      {/* KPI Row 2 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tổng số vé bán ra" value={totalSeatsSold} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Giá trị TB/đơn" value={averageOrderValue} suffix="VNĐ" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tỉ lệ đơn đã thanh toán" value={`${paidRate}%`} />
          </Card>
        </Col>
      </Row>

    
      <Card style={{ marginTop: 20 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={6}>
            <Select
              allowClear
              placeholder="Chọn trạng thái"
              style={{ width: "100%" }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: "paid", label: "Đã thanh toán" },
                { value: "unpaid", label: "Chưa thanh toán" },
                { value: "cancelled", label: "Đã hủy" },
               
              ]}
            />
          </Col>
          <Col xs={24} md={10}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setFilterDateRange(dates || [null, null])}
              allowEmpty={[true, true]}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              allowClear
              placeholder="Lọc theo phim"
              style={{ width: "100%" }}
              value={filterMovie}
              onChange={(val) => setFilterMovie(val)}
              options={allMovies.map((m) => ({ value: m, label: m }))}
              showSearch
              optionFilterProp="label"
            />
          </Col>
          <Col xs={24} md={4}>
            <Space wrap>
              <Button onClick={handleExportOrders}>Xuất đơn hàng</Button>
              <Button onClick={handleExportRevenueByDay}>Xuất doanh thu ngày</Button>
              <Button onClick={handleExportRevenueByMovie}>Xuất doanh thu phim</Button>
            </Space>
          </Col>
        </Row>
      </Card>

     
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="📈 Doanh thu theo ngày">
            {revenueByDay.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={revenueByDay} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(v) => VND(Number(v))} />
                  <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="🧾 Tỉ trọng số đơn theo trạng thái">
            {statusBreakdown.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(e) => `${e.status}: ${e.count}`}
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

    
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="🎬 Doanh thu theo phim (VNĐ)">
            {revenueByMovie.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueByMovie} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip formatter={(v) => VND(Number(v))} />
                  <Bar dataKey="revenue" fill="#82ca9d" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="🍿 Số vé bán theo phim">
            {seatsByMovie.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={seatsByMovie} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="seats" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

   
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="🕒 Doanh thu theo giờ (VNĐ)">
            {revenueByHour.length === 0 ? (
              <p>Không có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByHour} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(v) => VND(Number(v))} />
                  <Bar dataKey="revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

     
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <span>📋 Chi tiết doanh thu theo phim</span>
                {topMovie && (
                  <Tag color="green">Top: {topMovie.title} • {VND(topMovie.revenue)} VNĐ</Tag>
                )}
              </Space>
            }
          >
            <Table
              size="middle"
              dataSource={revenueByMovie}
              rowKey={(r) => r.title}
              pagination={{ pageSize: 6 }}
              columns={revenueByMovieColumns}
              locale={{ emptyText: "Không có dữ liệu" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="🧑‍💼 Top khách hàng (theo doanh thu)">
            <Table
              size="middle"
              dataSource={topUsers}
              rowKey={(r) => r.id}
              pagination={false}
              columns={topUsersColumns}
              locale={{ emptyText: "Không có dữ liệu" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="🧾 Đơn hàng gần đây">
            <Table
              size="middle"
              dataSource={[...filteredOrders].sort((a, b) => dayjs(b.bookingDate).valueOf() - dayjs(a.bookingDate).valueOf())}
              rowKey={(r) => r._id}
              pagination={{ pageSize: 8 }}
              columns={recentOrdersColumns}
              locale={{ emptyText: "Không có dữ liệu" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
