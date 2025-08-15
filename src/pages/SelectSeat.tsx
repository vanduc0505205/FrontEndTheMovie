import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Monitor, Users, Clock, Ticket, Crown } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";

type SeatStatus = "available" | "booked" | "maintenance";
type SeatType = "NORMAL" | "VIP";

interface Seat {
  _id: string;
  seatCode: string;
  row: string;
  column: number;
  type: SeatType;
  status: SeatStatus; 
}
export default function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: movieId } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("roomId");
  const showtimeId = searchParams.get("showtimeId");
  const userId = searchParams.get("userId");

  const { movie, showtime } = location.state || {};
  const actualRoomId = roomId || showtime?.roomId._id;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSeats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/seat/room/${actualRoomId}?showtimeId=${showtimeId}`
      );
      setSeats(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách ghế:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchSeats();
}, [actualRoomId, showtimeId]);


  const toggleSeat = (seatCode: string, status: SeatStatus) => {
    if (status !== "available") return;
    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((code) => code !== seatCode)
        : [...prev, seatCode]
    );
  };

  // Lấy giá từ showtime.defaultPrice
  const defaultPrice = showtime?.defaultPrice || 100000;
  const getSeatPrice = (type: string) => type === "VIP" ? defaultPrice * 1.5 : defaultPrice;
  const totalPrice = selectedSeats.reduce((acc, code) => {
    const seat = seats.find((s) => s.seatCode === code);
    if (!seat) return acc;
    return acc + getSeatPrice(seat?.type || "NORMAL");
  }, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (!seats.length) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center text-red-400">
          <Users className="mx-auto mb-4" size={48} />
          <p className="text-xl">Không có thông tin ghế</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen overflow-hidden">

      <div className="relative z-10 px-4 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 py-20">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-all duration-300 mb-6"
            >
              <ArrowLeft className="text-red-400" size={18} />
              <span className="text-gray-200">Quay lại chọn suất</span>
            </button>

            {/* Movie Info Bar */}
            {movie && showtime && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {movie.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-red-400" />
                          <span>
                            {dayjs(showtime.startTime).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor size={14} className="text-red-400" />
                          <span>
                            Phòng {showtime.roomId?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-10">
            <div className="p-8">
              {/* Screen */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-semibold text-lg">
                    <Monitor size={20} />
                    MÀN HÌNH
                  </div>
                </div>
                <div className="mx-auto h-3 w-4/5 max-w-md rounded-full bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 shadow-lg"></div>
                <div className="mx-auto h-1 w-3/5 max-w-sm rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2"></div>
              </div>

              {/* Seats Grid - Grouped by Rows */}
              <div className="mb-8">
                {(() => {
                  // Group seats by row
                  const seatsByRow = seats.reduce((acc, seat) => {
                    if (!acc[seat.row]) {
                      acc[seat.row] = [];
                    }
                    acc[seat.row].push(seat);
                    return acc;
                  }, {} as Record<string, Seat[]>);

                  // Sort rows alphabetically
                  const sortedRows = Object.keys(seatsByRow).sort();

                  return (
                    <div className="space-y-3">
                      {sortedRows.map((rowLetter) => {
                        // Sort seats in row by column
                        const rowSeats = seatsByRow[rowLetter].sort(
                          (a, b) => a.column - b.column
                        );

                        return (
                          <div
                            key={rowLetter}
                            className="flex items-center justify-center gap-2"
                          >
                            {/* Row Label */}
                            <div className="w-8 h-10 flex items-center justify-center text-red-400 font-bold text-lg mr-2">
                              {rowLetter}
                            </div>

                            {/* Seats in this row */}
                            <div className="flex gap-2">
                             {rowSeats.map(({ _id, seatCode, type, status }) => {
                              const seatStatus = status.toLowerCase() as SeatStatus;
                              const isSelected = selectedSeats.includes(seatCode);
                              let seatClasses =
                                "relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 transform";

                              if (seatStatus === "booked") {
                                seatClasses +=
                                  " bg-red-500/80 text-white cursor-not-allowed border border-red-400";
                              } else if (seatStatus === "maintenance") {
                                seatClasses +=
                                  " bg-gray-600/80 text-gray-300 cursor-not-allowed border border-gray-500";
                              } else if (isSelected) {
                                seatClasses +=
                                  " bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-110 border border-green-400";
                              } else if (type === "VIP") {
                                seatClasses +=
                                  " bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 hover:scale-105 cursor-pointer border border-amber-300 shadow-md";
                              } else {
                                seatClasses +=
                                  " bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-200 hover:to-gray-300 hover:scale-105 cursor-pointer border border-gray-300 shadow-md";
                              }

                              return (
                                <div key={_id} className="relative">
                                  <button
                                    className={seatClasses}
                                    disabled={seatStatus !== "available"}
                                    onClick={() => toggleSeat(seatCode, seatStatus)}
                                    title={`${seatCode} - ${type} - ${
                                      seatStatus === "available"
                                        ? "Có thể đặt"
                                        : seatStatus === "booked"
                                        ? "Đã đặt"
                                        : "Bảo trì"
                                    }`}
                                  >
                                    {seatCode}
                                    {type === "VIP" && (
                                      <Crown
                                        size={8}
                                        className="absolute -top-1 -right-1 text-yellow-600"
                                      />
                                    )}
                                  </button>
                                </div>
                              );
                            })}

                            </div>

                            {/* Row Label (Right side) */}
                            <div className="w-8 h-10 flex items-center justify-center text-red-400 font-bold text-lg ml-2">
                              {rowLetter}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 text-sm mb-8 p-4 bg-black/20 rounded-xl border border-white/10">
                <LegendBox
                  color="bg-gradient-to-r from-gray-300 to-gray-400"
                  textColor="text-gray-800"
                  label="Ghế thường"
                />
                <LegendBox
                  color="bg-gradient-to-r from-amber-400 to-amber-500"
                  textColor="text-black"
                  label="Ghế VIP"
                  icon={<Crown size={12} />}
                />
                <LegendBox
                  color="bg-red-500/80"
                  textColor="text-white"
                  label="Đã đặt"
                />
                <LegendBox
                  color="bg-gray-600/80"
                  textColor="text-gray-300"
                  label="Bảo trì"
                />
                <LegendBox
                  color="bg-gradient-to-r from-green-500 to-green-600"
                  textColor="text-white"
                  label="Đang chọn"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-black/30 rounded-xl border border-white/20 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white">
                      <Ticket className="text-red-400" size={18} />
                      <span className="font-medium">Thông tin đặt vé:</span>
                    </div>
                    <div className="text-gray-300 space-y-1">
                      <p>
                        Ghế đã chọn:{" "}
                        <span className="text-green-400 font-semibold">
                          {selectedSeats.length > 0
                            ? selectedSeats.join(", ")
                            : "Chưa chọn ghế"}
                        </span>
                      </p>
                      <p>
                        Tổng tiền:{" "}
                        <span className="text-amber-400 font-bold text-lg">
                          {totalPrice.toLocaleString()} VNĐ
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={selectedSeats.length === 0}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 shadow-lg hover:shadow-red-500/25"
                    onClick={() => {
                      const bookingInfo = {
                        userId,
                        showtimeId,
                        roomId: actualRoomId,
                        seatList: selectedSeats.map((code) => {
                          const seat = seats.find((s) => s.seatCode === code);
                          const seatType = seat?.type || "NORMAL";
                          const price = getSeatPrice(seatType);
                          return {
                            seatId: seat?._id || "",
                            seatCode: seat?.seatCode || "",
                            seatType,
                            price
                          };
                        }),
                        totalPrice,
                        movie,
                        showtime
                      };

                      navigate(`/phim/${movieId}/checkout`, {
                        state: bookingInfo,
                      });
                    }}
                  >
                    {selectedSeats.length === 0
                      ? "Chọn ghế để tiếp tục"
                      : "Đặt vé ngay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendBox({
  color,
  textColor = "text-white",
  label,
  icon,
}: {
  color: string;
  textColor?: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative w-6 h-6 rounded border border-white/30 ${color} flex items-center justify-center ${textColor} text-xs font-bold`}
      >
        {icon || "A1"}
      </div>
      <span className="text-gray-300">{label}</span>
    </div>
  );
}
