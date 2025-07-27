import axios from 'axios';
import { ISeat } from "@/types/seat";

// 🔁 Lấy danh sách ghế theo roomId
export const getSeatsByRoom = async (roomId: string): Promise<ISeat[]> => {
  const { data } = await axios.get(`http://localhost:3000/seat/room/${roomId}`);
  return data as ISeat[];
};

// ➕ Tạo nhiều ghế
export const bulkCreateSeats = async (payload: {
  roomId: string;
  rows: number;
  columns: number;
  vipSeats?: string[];
  vipRows?: string[];
}): Promise<ISeat[]> => {
  const { data } = await axios.post("http://localhost:3000/seat/bulk", payload);
  return data;
};

// ✏️ Cập nhật ghế
export const updateSeat = async (
  id: string,
  updates: Partial<ISeat>
): Promise<ISeat> => {
  const { data } = await axios.put(`http://localhost:3000/seat/${id}`, updates);
  return data;
};

// ❌ Xoá 1 ghế
export const deleteSeat = async (id: string): Promise<{ message: string }> => {
  const { data } = await axios.delete(`http://localhost:3000/seat/${id}`);
  return data;
};

// 🧹 Xoá toàn bộ ghế trong 1 phòng
export const resetSeatsByRoom = async (
  roomId: string
): Promise<{ message: string }> => {
  const { data } = await axios.delete(`http://localhost:3000/seat/reset/${roomId}`);
  return data;
};
