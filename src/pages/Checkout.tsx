import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie.api";
import { Spin, message } from "antd";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const bookingData = location.state;
  const { id: movieId } = useParams();
  
  const {
    data: movies,
    isLoading: isMovieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId!),
    enabled: !!movieId,
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
    if (method === "vnpay") {
      message.warning('Tính năng thanh toán VNPay đang được bảo trì. Vui lòng chọn phương thức thanh toán khác.');
      return;
    }

    setIsLoading(true);
    try {
      // Validate dữ liệu
      if (!userId || !showtimeId || !seatList?.length) {
        throw new Error("Thiếu thông tin đặt vé. Vui lòng thử lại.");
      }

      // Chuẩn bị dữ liệu gửi đi
      const bookingData = {
        userId,
        showtimeId,
        seatList: seatList.map(seat => ({
          seatId: seat.seatId,
          seatType: seat.seatType.toLowerCase(),
          seatCode: seat.seatCode
        })),
        paymentMethod: method,
      };

      console.log('Dữ liệu gửi đi:', JSON.stringify(bookingData, null, 2));

      // Gọi API đặt vé
      const res = await axios.post(
        "http://localhost:3000/booking/book",
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      console.log('Phản hồi từ server:', {
        status: res.status,
        data: res.data,
        headers: res.headers
      });

      // Xử lý kết quả đặt vé thành công
      message.success({
        content: (
          <div>
            <div className="font-bold text-lg mb-2">Đặt vé thành công!</div>
            <div className="text-gray-700">
              <p>Mã đơn hàng: <span className="font-medium">{res.data.booking?._id}</span></p>
              <p>Tổng tiền: <span className="font-medium">{res.data.booking?.totalPrice?.toLocaleString()} VNĐ</span></p>
              <p className="mt-2">Vui lòng đến quầy vé thanh toán trước 15 phút khi đến xem phim.</p>
            </div>
          </div>
        ),
        duration: 8,
      });
      
      // Chuyển hướng về trang lịch sử đặt vé sau 3 giây
      setTimeout(() => {
        navigate("/tickets");
      }, 3000);  
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);
      
      let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";
      let errorDetails = "";
      
      if (error.response) {
        // Lỗi từ server
        console.error('Chi tiết lỗi từ server:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        errorMessage = error.response.data?.message || `Lỗi từ server (${error.response.status})`;
        
        // Thêm thông tin chi tiết lỗi nếu có
        if (error.response.data?.error) {
          errorDetails = `Chi tiết: ${JSON.stringify(error.response.data.error, null, 2)}`;
        } else if (error.response.data) {
          errorDetails = `Phản hồi: ${JSON.stringify(error.response.data, null, 2)}`;
        }
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error('Không nhận được phản hồi từ server:', error.request);
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra:";
        errorDetails = "1. Đảm bảo backend đang chạy\n2. Kiểm tra kết nối mạng\n3. Thử lại sau ít phút";
      } else {
        // Lỗi khi thiết lập request
        console.error('Lỗi khi thiết lập yêu cầu:', error.message);
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      // Hiển thị thông báo lỗi chi tiết
      message.error({
        content: (
          <div>
            <div className="font-bold">{errorMessage}</div>
            {errorDetails && <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{errorDetails}</pre>}
          </div>
        ),
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isMovieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (movieError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Đã xảy ra lỗi khi tải thông tin phim</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center py-8 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">XÁC NHẬN THANH TOÁN</h1>
          <p className="text-blue-100 mt-2">Vui lòng kiểm tra kỹ thông tin đặt vé</p>
        </div>

        <div className="p-6">
          {movies && (
            <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="w-full md:w-48 h-64 md:h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {movies.poster ? (
                  <img
                    src={movies.poster}
                    alt={movies.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Không có poster
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{movies.title}</h2>
                <div className="space-y-1 text-gray-600">
                  <p>⏱ Thời lượng: {movies.duration} phút</p>
                  <p>🎬 Đạo diễn: {movies.director || "Đang cập nhật"}</p>
                  <p>🔞 Độ tuổi: {movies.ageRating || "P - Phim dành cho mọi lứa tuổi"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin đặt vé</h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Ghế đã chọn:</h4>
              <div className="flex flex-wrap gap-2">
                {seatList.map((seat: { seatId: string; seatCode: string; seatType: string }) => (
                  <div 
                    key={seat.seatId} 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      seat.seatType === "VIP" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {seat.seatCode} ({seat.seatType})
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-700">Tổng tiền:</span>
              <span className="text-2xl font-bold text-blue-600">
                {totalPrice?.toLocaleString()} VNĐ
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Quay lại
            </button>
            
            <div className="flex flex-col gap-4 mt-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-80 rounded-lg flex items-center justify-center z-10">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">Sắp ra mắt</span>
                </div>
                <button
                  disabled={true}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed opacity-70"
                >
                  <img src="https://sandbox.vnpayment.vn/merchant_website/assets/img/logo/logo-vnpay.svg" alt="VNPay" className="h-6 grayscale" />
                  Thanh toán VNPay (Đang bảo trì)
                </button>
              </div>

              <button
                onClick={() => handlePayment("cash")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Thanh toán tiền mặt
                  </>
                )}
              </button>
              
              <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-200">
                <p>Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</p>
                <p className="mt-1">Mọi thắc mắc vui lòng liên hệ hotline: 1900 1234</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</p>
          <p className="mt-1">Mọi thắc mắc vui lòng liên hệ hotline: 1900 1234</p>
        </div>
      </div>
    </div>
  );
}