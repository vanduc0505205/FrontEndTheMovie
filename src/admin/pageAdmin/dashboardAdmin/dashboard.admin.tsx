import React from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
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

// 📈 Dữ liệu doanh thu theo ngày (cho biểu đồ line)
const revenueByDay = [
  { date: "07/21", revenue: 120000 },
  { date: "07/22", revenue: 180000 },
  { date: "07/23", revenue: 150000 },
  { date: "07/24", revenue: 200000 },
  { date: "07/25", revenue: 175000 },
  { date: "07/26", revenue: 220000 },
  { date: "07/27", revenue: 198000 },
];

// 📊 Dữ liệu doanh thu theo phim (cho biểu đồ bar và bảng)
const revenueByMovie = [
  { title: "Avengers: Endgame", revenue: 520000 },
  { title: "The Batman", revenue: 340000 },
  { title: "Oppenheimer", revenue: 280000 },
  { title: "Inside Out 2", revenue: 190000 },
  { title: "Deadpool 3", revenue: 320000 },
];

const DashboardAdmin = () => {
  return (
    <div>
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={1_550_000}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số người dùng" value={4210} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo ngày */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="📈 Doanh thu theo ngày (7 ngày qua)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDay} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo phim */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="📊 Doanh thu theo phim (VNĐ)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMovie} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
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
              columns={[
                { title: "Tên phim", dataIndex: "title", key: "title" },
                {
                  title: "Doanh thu (VNĐ)",
                  dataIndex: "revenue",
                  key: "revenue",
                  render: (val) => val.toLocaleString(),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
