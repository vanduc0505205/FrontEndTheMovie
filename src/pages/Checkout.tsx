import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) return <div>Không có dữ liệu đặt vé.</div>;

  const { userId, showtimeId, seatList, totalPrice, movie } = bookingData;

  const handlePayment = async (method: "vnpay" | "cash") => {
    try {
      const res = await axios.post("http://localhost:3000/booking/book", {
        userId,
        showtimeId,
        seatList,
        paymentMethod: method,
      });

      if (res.data?.booking?._id && method === "vnpay") {
        const vnpayRes = await axios.post("http://localhost:3000/vnpay/create_payment_url", {
          amount: totalPrice,
          bookingId: res.data.booking._id,
        });
        window.location.href = vnpayRes.data.redirectUrl;
      } else {
        alert("✅ Đặt vé thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("❌ Thanh toán thất bại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Xác nhận thanh toán</h2>
      <button
        onClick={() => navigate(-1)} 
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Quay lại 
      </button>
      {movie && (
        <div className="flex items-start gap-4 mb-4">
          <img
            src={movie.poster || "https://via.placeholder.com/120x180?text=Poster"}
            alt={movie.title}
            className="w-28 h-40 object-cover rounded"
          />
          <div>
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p>⏱ Thời lượng: {movie.duration} phút</p>
            <p>🎬 Đạo diễn: {movie.director}</p>
            <p>🔞 Giới hạn tuổi: {movie.ageRating}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded mb-6">
        <p><strong>Ghế đã chọn:</strong> {seatList.map(s => s.seatCode || s.seatId).join(", ")}</p>
        <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VNĐ</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() =>
            navigate("/thanh-toan", {
              state: {
                userId,
                showtimeId,
                seatList,
                totalPrice,
                movie, // ✅ truyền sang tiếp
              },
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Thanh toán Online
        </button>

      
      </div>
    </div>
  );
}
