import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

const priceMap = {
  NORMAL: 100000,
  VIP: 150000,
};

export default function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();

 
  const { roomId, userId, showtimeId, movie } = location.state || {};

  const actualRoomId = roomId || "688b9c84554800b4468c61ef"; 

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/seat/room/${actualRoomId}`);
        setSeats(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách ghế:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [actualRoomId]);

  const toggleSeat = (seatCode: string, status: SeatStatus) => {
    if (status !== "available") return;
    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((code) => code !== seatCode)
        : [...prev, seatCode]
    );
  };

  const totalPrice = selectedSeats.reduce((acc, code) => {
    const seat = seats.find((s) => s.seatCode === code);
    if (!seat) return acc;
    return acc + priceMap[seat.type];
  }, 0);

  if (loading) return <div className="text-center mt-10">Đang tải ghế...</div>;
  if (!seats.length) return <div className="text-center mt-10">Không có ghế</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-lg">
      <div className="mb-6 text-center font-semibold text-gray-700 tracking-widest">
        MÀN HÌNH
      </div>
      <div className="mx-auto mb-8 h-6 w-4/5 rounded bg-gray-300 shadow-inner"></div>

      <div
        className="grid gap-2 justify-center mb-8"
        style={{ gridTemplateColumns: `repeat(12, 40px)` }}
      >
        {seats.map(({ _id, seatCode, type, status }) => {
          const isSelected = selectedSeats.includes(seatCode);
          let bgColor = "bg-gray-300 cursor-pointer";
          if (status === "booked") bgColor = "bg-red-500 cursor-not-allowed";
          else if (status === "maintenance") bgColor = "bg-gray-700 cursor-not-allowed";
          else if (isSelected) bgColor = "bg-green-500";
          else if (type === "VIP") bgColor = "bg-yellow-400";

          return (
            <button
              key={_id}
              className={`${bgColor} rounded-md w-10 h-10 flex items-center justify-center font-semibold text-xs select-none ${
                status !== "available"
                  ? "opacity-70"
                  : "hover:outline hover:outline-2 hover:outline-green-600"
              }`}
              disabled={status !== "available"}
              onClick={() => toggleSeat(seatCode, status)}
              title={`${seatCode} - ${type} - ${
                status === "available"
                  ? "Có thể đặt"
                  : status === "booked"
                  ? "Đã đặt"
                  : "Bảo trì"
              }`}
            >
              {seatCode}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 text-sm mb-8">
        <LegendBox color="bg-gray-300" label="Ghế thường" />
        <LegendBox color="bg-yellow-400" label="Ghế VIP" />
        <LegendBox color="bg-red-500" label="Ghế đã đặt" />
        <LegendBox color="bg-gray-700" label="Ghế bảo trì" />
        <LegendBox color="bg-green-500" label="Ghế đang chọn" />
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          Ghế đã chọn: <b>{selectedSeats.length}</b> &nbsp;|&nbsp; Tổng tiền:{" "}
          <b>{totalPrice.toLocaleString()} VNĐ</b>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            const bookingInfo = {
              userId,
              showtimeId,
              roomId: actualRoomId,
             seatList: selectedSeats.map((code) => {
                const seat = seats.find((s) => s.seatCode === code);
                return {
                  seatId: seat?._id || "",
                  seatCode: seat?.seatCode || "", 
                  seatType: seat?.type || "NORMAL",
                };
              }),

              totalPrice,
              movie, // ✅ truyền đầy đủ movie để CheckoutPage hiển thị thông tin
            };

            navigate("/checkout", { state: bookingInfo });
          }}
        >
          Đặt vé
        </button>
      </div>
    </div>
  );
}

function LegendBox({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded border border-gray-400 ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}
