import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/api/movie.api";
import { Spin, message, Input, Button, notification } from "antd";
import { bookTicket } from "@/api/booking.api";
import { createPayment } from "@/api/payment.api";
import { applyDiscount } from "@/api/discount.api";
import { comboApi } from "@/api/combo.api";
import type { ICombo } from "@/interface/combo";

export default function Checkout() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const bookingData = location.state;
  const { id: movieId } = useParams();

  const [combos, setCombos] = useState<ICombo[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Record<string, number>>({});

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

  const { showtimeId, seatList, totalPrice, movie } = bookingData;

  const [discountCode, setDiscountCode] = useState<string>("");
  const [applying, setApplying] = useState<boolean>(false);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await comboApi.getAvailableCombo();
        if (mounted) setCombos(list || []);
      } catch (e) {
        console.warn("Không thể tải danh sách combo:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const baseTotal = seatList.reduce((sum: number, seat: any) => sum + seat.price, 0);

  const comboTotal = Object.entries(selectedCombos).reduce((sum, [comboId, qty]) => {
    const combo = combos.find(c => c._id === comboId);
    if (!combo || !combo.isAvailable) return sum;
    return sum + (combo.price || 0) * (qty || 0);
  }, 0);

  const finalSeatTotal = discountedTotal != null ? discountedTotal : baseTotal;
  const finalPayable = Math.max(0, finalSeatTotal + comboTotal);

  const onApplyDiscount = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      message.warning("Vui lòng nhập mã giảm giá");
      return;
    }
    setApplying(true);
    try {
      const res = await applyDiscount({ code, total: baseTotal });
      setAppliedCode(code);
      const amt = res.discountAmount || 0;
      setDiscountAmount(amt);
      const final =
        (res as any).finalPrice ??
        (res as any).discountedTotal ??
        Math.max(0, baseTotal - amt);
      setDiscountedTotal(final);
      message.success("Áp dụng mã giảm giá thành công");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Mã giảm giá không hợp lệ";
      message.error(msg);
      setAppliedCode("");
      setDiscountAmount(0);
      setDiscountedTotal(null);
    } finally {
      setApplying(false);
    }
  };

  const clearDiscount = () => {
    setAppliedCode("");
    setDiscountAmount(0);
    setDiscountedTotal(null);
    setDiscountCode("");
  };

  const handlePayment = async (method: "vnpay" | "cash") => {
    setIsLoading(true);
    try {
      if (!showtimeId || !seatList?.length) {
        throw new Error("Thiếu thông tin đặt vé. Vui lòng thử lại.");
      }

      const total = seatList.reduce((sum: number, seat: any) => sum + seat.price, 0);
      const totalToPay = Math.max(0, (discountedTotal != null ? discountedTotal : total) + comboTotal);

      const comboList = Object.entries(selectedCombos)
        .filter(([_, qty]) => qty > 0)
        .map(([comboId, qty]) => ({ comboId, quantity: qty }));

      const bookingPayload = {
        showtimeId,
        seatList: seatList.map((seat: any) => ({
          seatId: seat.seatId,
          seatType: seat.seatType,
          price: seat.price
        })),
        totalPrice: totalToPay,
        ...(comboList.length ? { comboList } : {}),
        ...(appliedCode
          ? {
              discountCode: appliedCode,
              discountAmount: discountAmount,
            }
          : {}),
        paymentMethod: method === "vnpay" ? "VNPAY" : "COD"
      };

      const res = await bookTicket(bookingPayload);

      if (method === "vnpay" && res.data.booking?._id) {
        try {
          const vnpayRes = await createPayment({ bookingId: res.data.booking._id });

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
                  Vui lòng đến quầy vé thanh toán trước 20 phút khi đến xem
                  phim.
                </p>
              </div>
            </div>
          ),
          duration: 8,
        });

        setTimeout(() => {
          navigate("/lichsudatve");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);

      if (error?.response?.status === 403) {
        const msg = error?.response?.data?.message || "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để mở khóa.";
        message.error({
          content: (
            <div>
              <div className="font-bold">{msg}</div>
            </div>
          ),
          duration: 6,
        });
        navigate("/");
        setIsLoading(false);
        return;
      }

      if (error?.response?.status === 409) {
        const data = error.response.data || {};
        const code = data.code as string | undefined;

        if (code === 'ROOM_IN_MAINTENANCE') {
          notification.warning({
            message: 'Phòng đang bảo trì',
            description: data.message || 'Phòng chiếu đang bảo trì, không thể đặt vé vào lúc này. Vui lòng chọn suất chiếu/phòng khác.',
            placement: 'topRight',
          });
          navigate(-1);
          setIsLoading(false);
          return;
        }

        if (code === 'SEAT_IN_MAINTENANCE') {
          const seatCodes: string[] = Array.isArray(data.seatCodes) ? data.seatCodes : [];
          notification.warning({
            message: 'Ghế đang bảo trì',
            description: (
              <div>
                <div>{data.message || 'Một hoặc nhiều ghế bạn chọn đang bảo trì.'}</div>
                {seatCodes.length > 0 && (
                  <div className="mt-1 text-xs">Ghế: <strong>{seatCodes.join(', ')}</strong></div>
                )}
              </div>
            ) as any,
            placement: 'topRight',
          });
          navigate(-1);
          setIsLoading(false);
          return;
        }

        const codes: string[] | undefined = data.takenSeatCodes;
        const ids: string[] | undefined = data.takenSeatIds;
        const list: string[] = Array.isArray(codes) && codes.length ? codes : Array.isArray(ids) ? ids : [];

        message.warning({
          content: (
            <div>
              <div className="font-bold">Một số ghế đã bị người khác giữ/đặt trước đó</div>
              {list.length > 0 ? (
                <div className="mt-2 text-sm text-gray-700">
                  Ghế xung đột: <span className="font-semibold">{list.join(", ")}</span>
                </div>
              ) : null}
              <div className="mt-1 text-xs text-gray-500">Vui lòng quay lại và chọn ghế khác.</div>
            </div>
          ),
          duration: 6,
        });

        navigate(-1);
        setIsLoading(false);
        return;
      }

      let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";
      let errorDetails = "";

      if (error.response) {
        console.error("Chi tiết lỗi từ server:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        errorMessage =
          error.response.data?.message ||
          `Lỗi từ server (${error.response.status})`;

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
        console.error("Không nhận được phản hồi từ server:", error.request);
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra:";
        errorDetails =
          "1. Đảm bảo backend đang chạy\n2. Kiểm tra kết nối mạng\n3. Thử lại sau ít phút";
      } else {
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        errorMessage = `Lỗi: ${error.message}`;
      }

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

                {/* Total Price + Discount */}
                <div className="flex justify-between items-start gap-6 pt-4 border-t border-white/20">
                  <span className="text-xl font-semibold text-white">
                    Tổng tiền:
                  </span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ghế */}
                    <div className="text-right">
                      {appliedCode && discountedTotal != null ? (
                        <div className="space-y-1">
                          <div className="text-gray-300 line-through">
                            {baseTotal.toLocaleString()} VNĐ
                          </div>
                          <div className="text-green-400 text-sm">
                            Giảm (-{discountAmount.toLocaleString()} VNĐ) bằng mã {appliedCode}
                          </div>
                          <div className="text-2xl font-bold text-amber-400">
                            {discountedTotal.toLocaleString()} VNĐ
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {seatList.length} ghế đã chọn
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-2xl font-bold text-amber-400">
                            {baseTotal.toLocaleString()} VNĐ
                          </span>
                          <p className="text-sm text-gray-400 mt-1">
                            {seatList.length} ghế đã chọn
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Combo */}
                    <div className="text-right">
                      <div className="space-y-1">
                        <div className="text-gray-300">Combo: {comboTotal.toLocaleString()} VNĐ</div>
                        <div className="text-3xl font-bold text-emerald-400">
                          Tổng thanh toán: {finalPayable.toLocaleString()} VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Code Input */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Nhập mã giảm giá (VD: SALE20)"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={applying}
                      allowClear
                    />
                  </div>
                  {!appliedCode ? (
                    <Button type="primary" loading={applying} onClick={onApplyDiscount}>
                      Áp dụng
                    </Button>
                  ) : (
                    <Button danger onClick={clearDiscount} disabled={applying}>
                      Bỏ mã
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Combo Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 3.25 2.41 5.94 5.5 6.41V22l3.5-3.5 3.5 3.5v-6.59C16.59 14.94 19 12.25 19 9c0-3.87-3.13-7-7-7z"/>
                </svg>
                Chọn Combo (tùy chọn)
              </h2>
              <div className="bg-black/20 rounded-xl border border-white/10 p-6">
                {combos.length === 0 ? (
                  <div className="text-gray-400">Hiện chưa có combo nào đang bán.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {combos.map((c) => {
                      const qty = selectedCombos[c._id] || 0;
                      return (
                        <div key={c._id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex-1">
                            <div className="text-white font-semibold">{c.name}</div>
                            <div className="text-amber-400 font-bold">{c.price.toLocaleString()} VNĐ</div>
                            {c.description ? (
                              <div className="text-gray-400 text-sm mt-1 line-clamp-2">{c.description}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20"
                              onClick={() => setSelectedCombos(prev => ({ ...prev, [c._id]: Math.max(0, (prev[c._id] || 0) - 1) }))}
                            >
                              -
                            </button>
                            <div className="min-w-10 text-center text-white font-semibold">{qty}</div>
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                              onClick={() => setSelectedCombos(prev => ({ ...prev, [c._id]: (prev[c._id] || 0) + 1 }))}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
