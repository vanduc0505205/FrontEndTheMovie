import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie.api";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi: Không có dữ liệu đặt vé</h2>
          <p className="text-gray-600 mb-6">Có vẻ như thông tin đặt vé của bạn không được tải đúng. Vui lòng thử lại hoặc quay về trang chính.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Về trang chính
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        navigate("/thanh-toan");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("❌ Thanh toán thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Xác nhận thanh toán</h2>

        {movies && (
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 bg-gray-50 p-6 rounded-lg">
            <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center">
              {movies.poster ? (
                <img
                  src={movies.poster}
                  alt={movies.title}
                  className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <span>Không có poster</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{movies.title}</h3>
              <p className="text-gray-600 mt-1">⏱ Thời lượng: {movies.duration} phút</p>
              <p className="text-gray-600">🎬 Đạo diễn: {movies.director || "Không có thông tin"}</p>
              <p className="text-gray-600">🔞 Giới hạn tuổi: {movies.ageRating || "Không xác định"}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-gray-700 font-semibold">Ghế đã chọn:</p>
          <ul className="mt-2 space-y-2">
            {seatList.map((seat: { seatId: string; seatCode: string; seatType: string }) => (
              <li key={seat.seatId} className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${seat.seatType === "VIP" ? "bg-yellow-400" : "bg-blue-400"
                    }`}
                ></span>
                <span>
                  {seat.seatCode} ({seat.seatType})
                </span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 mt-4 font-semibold">
            Tổng tiền: <span className="text-blue-600">{totalPrice.toLocaleString()} VNĐ</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
          >
            Quay lại
          </button>
          <div className="flex justify-between">
            <button
              onClick={() =>
                navigate(`/phim/${movieId}/thanh-toan`, {
                  state: {
                    userId,
                    showtimeId,
                    seatList,
                    totalPrice,
                    movie,
                  },
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Thanh toán Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}