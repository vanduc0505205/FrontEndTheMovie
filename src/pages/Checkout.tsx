import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie.api";
import { Spin, message } from "antd";
import { bookTicket, createVnPayPayment } from "@/api/booking.api";

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
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Lỗi: Không có dữ liệu đặt vé
          </h2>
          <p className="text-gray-600 mb-6">
            Có vẻ như thông tin đặt vé của bạn không được tải đúng. Vui lòng thử
            lại hoặc quay về trang chính.
          </p>
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
    setIsLoading(true);
    try {
      // Validate dữ liệu
      if (!userId || !showtimeId || !seatList?.length) {
        throw new Error("Thiếu thông tin đặt vé. Vui lòng thử lại.");
      }

      // Tính lại tổng tiền từ seatList (giá đã đồng bộ)
      const total = seatList.reduce((sum: number, seat: any) => sum + seat.price, 0);

      const bookingPayload = {
        userId,
        showtimeId,
        seatList: seatList.map((seat: any) => ({
          seatId: seat.seatId,
          seatType: seat.seatType,
          price: seat.price
        })),
        totalPrice: total,
        paymentMethod: method === "vnpay" ? "VNPAY" : "COD"
      };

      // Gọi API đặt vé mới
      const res = await bookTicket(bookingPayload);

      // Xử lý thanh toán VNPay
      if (method === "vnpay" && res.data.booking?._id) {
        try {
          // Gọi API tạo URL thanh toán VNPay
          const vnpayRes = await createVnPayPayment(total);

          if (vnpayRes.data?.paymentUrl) {
            window.location.href = vnpayRes.data.paymentUrl;
            return;
          } else {
            throw new Error("Không nhận được URL thanh toán từ VNPay");
          }
        } catch (vnpayError: any) {
          console.error("Lỗi khi tạo URL thanh toán VNPay:", vnpayError);
          throw new Error("Lỗi khi kết nối với cổng thanh toán VNPay");
        }
      } else {
        // Xử lý thanh toán tiền mặt
        message.success({
          content: (
            <div>
              <div className="font-bold text-lg mb-2">Đặt vé thành công!</div>
              <div className="text-gray-700">
                <p>
                  Mã đơn hàng:{" "}
                  <span className="font-medium">{res.data.booking?._id}</span>
                </p>
                <p>
                  Tổng tiền:{" "}
                  <span className="font-medium">
                    {res.data.booking?.totalPrice?.toLocaleString()} VNĐ
                  </span>
                </p>
                <p className="mt-2">
                  Vui lòng đến quầy vé thanh toán trước 15 phút khi đến xem
                  phim.
                </p>
              </div>
            </div>
          ),
          duration: 8,
        });

        // Chuyển hướng về trang lịch sử đặt vé sau 3 giây
        setTimeout(() => {
          navigate("/lichsudatve");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);

      let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";
      let errorDetails = "";

      if (error.response) {
        // Lỗi từ server
        console.error("Chi tiết lỗi từ server:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          `Lỗi từ server (${error.response.status})`;

        // Thêm thông tin chi tiết lỗi nếu có
        if (error.response.data?.error) {
          errorDetails = `Chi tiết: ${JSON.stringify(
            error.response.data.error,
            null,
            2
          )}`;
        } else if (error.response.data) {
          errorDetails = `Phản hồi: ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`;
        }
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error("Không nhận được phản hồi từ server:", error.request);
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra:";
        errorDetails =
          "1. Đảm bảo backend đang chạy\n2. Kiểm tra kết nối mạng\n3. Thử lại sau ít phút";
      } else {
        // Lỗi khi thiết lập request
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        errorMessage = `Lỗi: ${error.message}`;
      }

      // Hiển thị thông báo lỗi chi tiết
      message.error({
        content: (
          <div>
            <div className="font-bold">{errorMessage}</div>
            {errorDetails && (
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {errorDetails}
              </pre>
            )}
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen overflow-hidden pt-20">

      <div className="relative z-10 flex items-center justify-center py-8 px-4 min-h-screen">
        <div className="max-w-4xl w-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <h1 className="text-3xl font-bold">XÁC NHẬN THANH TOÁN</h1>
              </div>
              <p className="text-red-100 text-lg">
                Vui lòng kiểm tra kỹ thông tin đặt vé
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Movie Information */}
            {movies && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                  </svg>
                  Thông tin phim
                </h2>
                <div className="bg-black/20 rounded-xl border border-white/10 p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-72 lg:h-64 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 group">
                      {movies.poster ? (
                        <img
                          src={movies.poster}
                          alt={movies.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {movies.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                            <span className="text-white font-medium">Thời lượng:</span>
                            <span>{movies.duration} phút</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                            </svg>
                            <span className="text-white font-medium">Đạo diễn:</span>
                            <span>{movies.director || "Đang cập nhật"}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
                            </svg>
                            <span className="text-white font-medium">Độ tuổi:</span>
                            <span className="bg-amber-500 text-black px-2 py-1 rounded text-xs font-bold">
                              {movies.ageRating || "P"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22,10V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.89 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10M13,17.5H11V16H13V17.5M13,14.5H11V9H13V14.5Z" />
                </svg>
                Thông tin đặt vé
              </h2>
              <div className="bg-black/20 rounded-xl border border-white/10 p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L14.5,7.29C14.5,7.29 14.51,5.26 16.5,5.26C18.22,5.26 18.95,6.6 18.95,7.13C18.85,7.49 18.76,7.87 18.73,8.09C18.8,8.05 18.89,8.03 18.95,8H20M8.91,7.26C9.88,7.26 10.73,8.39 10.73,9.25C10.73,10.11 9.88,11.24 8.91,11.24C7.95,11.24 7.1,10.11 7.1,9.25C7.1,8.39 7.95,7.26 8.91,7.26M8.91,8.75C8.57,8.75 8.29,9.08 8.29,9.25C8.29,9.42 8.57,9.75 8.91,9.75C9.26,9.75 9.54,9.42 9.54,9.25C9.54,9.08 9.26,8.75 8.91,8.75Z" />
                    </svg>
                    Ghế đã chọn:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {seatList.map(
                      (seat: {
                        seatId: string;
                        seatCode: string;
                        seatType: string;
                      }) => (
                        <div
                          key={seat.seatId}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${seat.seatType === "VIP"
                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-300 shadow-md"
                            : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 border-gray-300 shadow-md"
                            }`}
                        >
                          <span className="flex items-center gap-1">
                            {seat.seatCode}
                            <span className="text-xs opacity-75">({seat.seatType})</span>
                            {seat.seatType === "VIP" && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5,16L3,5H1V3H4L6,14L7,18H20V16H8L5,16M19,7V9H17V11H15V9H13V7H15V5H17V7H19Z" />
                              </svg>
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <span className="text-xl font-semibold text-white">
                    Tổng tiền:
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-amber-400">
                      {totalPrice?.toLocaleString()} VNĐ
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {seatList.length} ghế đã chọn
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,8H4V6C4,4.89 4.89,4 6,4H18A2,2 0 0,1 20,6V8M20,18A2,2 0 0,1 18,20H6C4.89,20 4,19.1 4,18V10H20V18Z" />
                </svg>
                Chọn phương thức thanh toán
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* VNPay Button */}
                <button
                  onClick={() => handlePayment("vnpay")}
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                >
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Đang chuyển hướng...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20,8H4V6C4,4.89 4.89,4 6,4H18A2,2 0 0,1 20,6V8M20,18A2,2 0 0,1 18,20H6C4.89,20 4,19.1 4,18V10H20V18Z" />
                        </svg>
                        <span>Thanh toán VNPay</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Nhanh chóng</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Cash Button */}
                <button
                  onClick={() => handlePayment("cash")}
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25"
                >
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3,6H21V8H21A2,2 0 0,1 19,10V14A2,2 0 0,1 21,16H21V18H3V16H3A2,2 0 0,1 5,14V10A2,2 0 0,1 3,8V6M12,16A3,3 0 0,0 15,13A3,3 0 0,0 12,10A3,3 0 0,0 9,13A3,3 0 0,0 12,16Z" />
                        </svg>
                        <span>Thanh toán tiền mặt</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Tại quầy</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                  </svg>
                  Quay lại chọn ghế
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/30 border-t border-white/10 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1.5L14.76 8.06L22 9.18L16.88 14.12L18.36 21.5L12 17.82L5.64 21.5L7.12 14.12L2 9.18L9.24 8.06L12 1.5Z" />
              </svg>
              <p className="text-gray-300 text-sm font-medium">
                Vui lòng kiểm tra kỹ thông tin trước khi thanh toán
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              Mọi thắc mắc vui lòng liên hệ hotline:{" "}
              <span className="text-red-400 font-semibold">1900 1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
