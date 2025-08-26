
import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Select, QRCode } from "antd";
import { getAllBookings, getUserBookings, updateBookingStatus } from "@/api/booking.api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BookingAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState<any>(null);

const handleViewDetail = (order) => {
  const status = (order.status || "").toLowerCase();
  if (status === "paid" || status === "đã đặt") {
    setSelectedOrder(order);
    setIsModalOpen(true);
  } else {
    alert("Vé này chưa được xác nhận,không thể xuất vé")
  }
};



  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      const raw = res.data?.bookings ?? res.data ?? [];

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
      console.error("Lỗi lấy lịch sử đặt vé:", err);
      message.error("Không thể tải lịch sử đặt vé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

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
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => handleUpdateStatus(record._id, value)}
          disabled={status === "paid" || status === "cancelled"}
        >
          <Select.Option value="paid">Đã thanh toán</Select.Option>
          <Select.Option value="unpaid">Chưa thanh toán</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>

        </Select>
      ),
    },
   {
  title: "Hành động",
  key: "action",
  render: (_, record) => (
    <Button type="link" onClick={() => handleViewDetail(record)}>
      👁 Xem vé
    </Button>
  ),
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
      {isModalOpen && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    {/* Thân vé */}
    <div
      className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl relative"
      id="ticket-detail"
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Vé vào AlphaCinema
      </h2>
      <p className="text-gray-300 mb-2">Phim: {selectedOrder.movieTitle}</p>
      <p className="text-gray-300 mb-2">
        Ghế: {selectedOrder.seats?.join(", ")}
      </p>
      <p className="text-gray-300 mb-2">
        Tổng tiền:{" "}
        {selectedOrder.totalPrice?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </p>

      {/* QR Code */}
      <div className="flex justify-center my-4">
        <QRCode value={selectedOrder._id} size={160} fgColor="#ef4444" />
      </div>
    </div>

    {/* Nút bấm nằm ngoài vé */}
    <div className="absolute bottom-6 flex justify-between gap-4">
      <button
        onClick={async () => {
          const element = document.getElementById("ticket-detail");
          if (!element) return;

          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#1f2937", // giữ nền tối
          });

          const imgData = canvas.toDataURL("image/png");

          const imgWidth = canvas.width;
          const imgHeight = canvas.height;

          const pxToMm = (px: number) => (px * 25.4) / 96;
          const pdfWidth = pxToMm(imgWidth);
          const pdfHeight = pxToMm(imgHeight);

          const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`ticket_${selectedOrder._id}.pdf`);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Xuất vé PDF
      </button>

      <button
        onClick={() => setIsModalOpen(false)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Đóng
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default BookingAdmin;
