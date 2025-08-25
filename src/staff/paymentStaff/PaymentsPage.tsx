import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import { getAllPayments } from "@/api/booking.api";
 

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      const raw = res.data?.payments ?? res.data ?? [];

      const normalized = raw.map((p: any) => ({
        ...p,
        key: p._id || p.id,
        customer: p.customerName || p.customer || "—",
        amount: p.amount ?? 0,
        method: p.method || p.paymentMethod || "—",
        date: p.createdAt || p.date,
        status: p.status || "—",
      }));

      setPayments(normalized);
    } catch (err) {
      console.error("Lỗi tải danh sách thanh toán:", err);
      message.error("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    { title: "Mã thanh toán", dataIndex: "key", key: "key" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) =>
        val?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    { title: "Phương thức", dataIndex: "method", key: "method" },
    {
      title: "Ngày thanh toán",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (date ? new Date(date).toLocaleString("vi-VN") : "—"),
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
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
      <h2>Quản lý thanh toán</h2>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={payments}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default PaymentsPage;
