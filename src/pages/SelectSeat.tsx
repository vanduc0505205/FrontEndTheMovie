import React, { useState } from "react";

type SeatStatus = "available" | "booked" | "maintenance";
type SeatType = "NORMAL" | "VIP";

interface Seat {
  seatCode: string;
  row: number;
  column: number;
  type: SeatType;
  status: SeatStatus;
}

const priceMap = {
  NORMAL: 70000,
  VIP: 150000,
};

// Tạo dữ liệu ghế giả 10 hàng x 12 cột
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const columns = 12;

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= columns; c++) {
      const seatCode = `${String.fromCharCode(64 + r)}${c}`;
      // Giả lập ghế VIP hàng 1 và 2
      const type: SeatType = r <= 2 ? "VIP" : "NORMAL";

      // Giả lập trạng thái xen kẽ booked, maintenance, available
      let status: SeatStatus = "available";
      if ((r + c) % 7 === 0) status = "booked";
      else if ((r + c) % 11 === 0) status = "maintenance";

      seats.push({ seatCode, row: r, column: c, type, status });
    }
  }
  return seats;
};

export default function SeatSelectionDemo() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const seatsSample = generateSeats();

  const toggleSeat = (seatCode: string, status: SeatStatus) => {
    if (status !== "available") return;
    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((code) => code !== seatCode)
        : [...prev, seatCode]
    );
  };

  const totalPrice = selectedSeats.reduce((acc, code) => {
    const seat = seatsSample.find((s) => s.seatCode === code);
    if (!seat) return acc;
    return acc + priceMap[seat.type];
  }, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Phim: Spider-Man: No Way Home</h2>
        <p className="text-gray-600">
          Rạp: CGV Vincom Center - Suất: 19:00 - 22/07/2025
        </p>
      </div>

      {/* Screen */}
      <div className="mb-6 text-center font-semibold text-gray-700 tracking-widest">
        MÀN HÌNH
      </div>
      <div className="mx-auto mb-8 h-6 w-4/5 rounded bg-gray-300 shadow-inner"></div>

      {/* Seat grid */}
      <div
        className="grid gap-2 justify-center mb-8"
        style={{ gridTemplateColumns: `repeat(12, 40px)` }}
      >
        {seatsSample.map(({ seatCode, type, status }) => {
          const isSelected = selectedSeats.includes(seatCode);
          let bgColor = "bg-gray-300 cursor-pointer";
          if (status === "booked") bgColor = "bg-red-500 cursor-not-allowed";
          else if (status === "maintenance") bgColor = "bg-gray-700 cursor-not-allowed";
          else if (isSelected) bgColor = "bg-green-500";
          else if (type === "VIP") bgColor = "bg-yellow-400";

          return (
            <button
              key={seatCode}
              className={`${bgColor} rounded-md w-10 h-10 flex items-center justify-center
              font-semibold text-xs select-none
              ${status !== "available" ? "opacity-70" : "hover:outline hover:outline-2 hover:outline-green-600"}
              `}
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

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm mb-8">
        <LegendBox color="bg-gray-300" label="Ghế thường" />
        <LegendBox color="bg-yellow-400" label="Ghế VIP" />
        <LegendBox color="bg-red-500" label="Ghế đã đặt" />
        <LegendBox color="bg-gray-700" label="Ghế bảo trì" />
        <LegendBox color="bg-green-500" label="Ghế đang chọn" />
      </div>

      {/* Summary & Action */}
      <div className="flex justify-between items-center">
        <div>
          Ghế đã chọn: <b>{selectedSeats.length}</b> &nbsp;|&nbsp; Tổng tiền:{" "}
          <b>{totalPrice.toLocaleString()} VNĐ</b>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            alert(`Bạn đã chọn ${selectedSeats.length} ghế, tổng tiền ${totalPrice.toLocaleString()} VNĐ`)
          }
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
