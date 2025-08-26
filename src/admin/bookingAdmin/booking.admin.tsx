
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
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    id="full-ticket"
  >
    <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-3xl relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
      >
        ✕
      </button>

      {/* ✅ Thêm id cho nội dung vé */}
      <div id="ticket-content" className="flex flex-col md:flex-row gap-6">
        {/* Poster + QR */}
        <div className="md:w-1/3 flex flex-col items-center bg-gray-800 rounded-lg p-4">
          <img
            src={selectedOrder.showtimeId?.movieId?.poster || "/default-poster.jpg"}
            alt={selectedOrder.showtimeId?.movieId?.title || "Poster"}
            className="w-full h-64 object-cover rounded-lg"
          />
          <QRCode
            value={selectedOrder._id}
            size={140}
            fgColor="#ef4444"
            className="mb-2"
          />
          <p className="text-white text-sm font-semibold">
            Mã vé: {selectedOrder._id}
          </p>
        </div>

        {/* Thông tin vé */}
        <div className="md:w-2/3 text-gray-300">
          <h2 className="text-2xl font-bold text-white mb-4">
            {selectedOrder.movieTitle}
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Ngày chiếu:</span>{" "}
              {new Date(selectedOrder.showtimeId?.startTime).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-semibold">Giờ chiếu:</span>{" "}
              {new Date(selectedOrder.showtimeId?.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(selectedOrder.showtimeId?.endTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Rạp:</strong> ALPHA-CINEMA
            </p>
            <p>
              <span className="font-semibold">Địa chỉ:</span> số 13, phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
            </p>
            <p>
              <span className="font-semibold">Phòng chiếu:</span>{" "}
              {selectedOrder.showtimeId?.roomId?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Ghế:</span> {selectedOrder.seats.join(", ")}
            </p>
            {selectedOrder.foodCombos && selectedOrder.foodCombos.length > 0 && (
              <p>
                <span className="font-semibold">Combo:</span>{" "}
                {selectedOrder.foodCombos.join(", ")}
              </p>
            )}
            <p>
              <span className="font-semibold">Phương thức thanh toán:</span>{" "}
              {selectedOrder.paymentMethod || "Chưa rõ"}
            </p>
          </div>

          <div className="mt-4 border-t border-gray-700 pt-4 text-sm space-y-1">
            <p>
              <strong>Giá vé:</strong>{" "}
              {(selectedOrder.ticketPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p>
              <strong>Giá combo:</strong>{" "}
              {(selectedOrder.comboPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p>
              <strong>Giảm giá:</strong>{" "}
              -{(selectedOrder.discountAmount || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p>
              <strong>Tổng cộng:</strong>{" "}
              {(selectedOrder.totalPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>

            <p className="text-lg font-bold text-yellow-400">
              Tổng cộng:{" "}
              {selectedOrder.totalPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Nút Xuất PDF + Đóng */}
      <div className="mt-6 flex justify-between gap-4">
        <button
         onClick={async () => {
  const element = document.getElementById("ticket-content");
  if (!element) {
    console.error("Không tìm thấy nội dung vé để xuất PDF");
    return;
  }

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#111827", 
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a6");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

      
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const x = (pageWidth - newWidth) / 2;
        const y = (pageHeight - newHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, newWidth, newHeight);
        pdf.save(`ticket_${selectedOrder._id}.pdf`);
      }}

          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          In vé
        </button>

        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default BookingAdmin;
