import React, { useEffect, useState } from "react";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getUserIdFromStorage = () => {
    const rawUser = localStorage?.getItem("user") || null;
    const rawUserId = localStorage?.getItem("userId") || null;

    if (rawUserId) return rawUserId;
    if (!rawUser) return null;

    try {
      const parsed = JSON.parse(rawUser);
      return parsed?._id || parsed?.id || null;
    } catch {
      return rawUser;
    }
  };

  const userId = getUserIdFromStorage();

  useEffect(() => {
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:3000/booking/user/${userId}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        const raw = data?.bookings ?? data ?? [];

        const normalized = raw.map((b) => {
          const seatsArr = (b.seatList ?? [])
            .map((s) => {
              if (!s) return "";
              if (typeof s.seatId === "object") {
                return s.seatId?.seatCode || s.seatId?.name || "";
              }
              return "";
            })
            .filter((seat) => seat);

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
        setError("Không thể tải lịch sử đặt vé");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-900 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 text-center border border-gray-700">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Lịch sử đặt vé</h2>
            <p className="text-gray-400 mb-6">Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.</p>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold">
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-300">Đang tải lịch sử đặt vé...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 text-center border border-gray-700">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Có lỗi xảy ra</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Lịch sử đặt vé
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Xem lại tất cả các giao dịch đặt vé của bạn
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-xl p-10 text-center border border-gray-700">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Chưa có đơn hàng nào</h3>
            <p className="text-gray-400 mb-6">Bạn chưa có giao dịch đặt vé nào. Hãy đặt vé xem phim ngay!</p>
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold">
              Đặt vé ngay
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-800 rounded-t-lg border border-gray-700 border-b-0">
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-300 text-sm">
                <div className="col-span-3">MÃ ĐẶT VÉ</div>
                <div className="col-span-3">PHIM</div>
                <div className="col-span-2">GHẾ</div>
                <div className="col-span-2">TỔNG TIỀN</div>
                <div className="col-span-2">NGÀY ĐẶT</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-gray-800 border border-gray-700 border-t-0">
              {currentOrders.map((order, index) => (
                <div
                  key={order._id}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-750 transition-colors duration-200 ${
                    index !== currentOrders.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  {/* Order ID */}
                  <div className="col-span-3 flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{order._id}</p>
                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded-full mt-1">
                          Đã xác nhận
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Movie Title */}
                  <div className="col-span-3 flex items-center">
                    <div>
                      <p className="text-white font-medium">{order.movieTitle || "—"}</p>
                      <p className="text-gray-400 text-sm">Phim điện ảnh</p>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-white font-medium">
                        {order.seats && order.seats.length > 0 ? order.seats.join(", ") : "(Không rõ)"}
                      </p>
                      <p className="text-gray-400 text-sm">{order.seats?.length || 0} ghế</p>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-yellow-400 font-bold text-lg">
                        {order.totalPrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div className="col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {new Date(order.bookingDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.bookingDate).toLocaleTimeString("vi-VN", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 group">
                        <svg className="w-4 h-4 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 group">
                        <svg className="w-4 h-4 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer with Pagination */}
            <div className="bg-gray-800 rounded-b-lg border border-gray-700 border-t-0 p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, orders.length)} của {orders.length} kết quả
                </div>
                
{totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      ←
                    </button>
                    
                    {/* Smart Pagination Logic */}
                    {(() => {
                      const delta = 2; // Number of pages to show around current page
                      const range = [];
                      const rangeWithDots = [];
                      
                      for (let i = Math.max(2, currentPage - delta); 
                           i <= Math.min(totalPages - 1, currentPage + delta); 
                           i++) {
                        range.push(i);
                      }
                      
                      if (currentPage - delta > 2) {
                        rangeWithDots.push(1, '...');
                      } else {
                        rangeWithDots.push(1);
                      }
                      
                      rangeWithDots.push(...range);
                      
                      if (currentPage + delta < totalPages - 1) {
                        rangeWithDots.push('...', totalPages);
                      } else if (totalPages > 1) {
                        rangeWithDots.push(totalPages);
                      }
                      
                      return rangeWithDots.map((page, index) => (
                        page === '...' ? (
                          <span key={`dots-${index}`} className="px-2 py-1 text-gray-400 text-xs">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 min-w-[24px] ${
                              currentPage === page
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ));
                    })()}
                    
                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;