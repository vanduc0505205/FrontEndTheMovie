import axios from 'axios';
import { ISeat } from "@/types/seat";

export const getSeatsByRoom = async (roomId: string): Promise<ISeat[]> => {
  const { data } = await axios.get(`http://localhost:3000/seat/room/${roomId}`);
  return data as ISeat[];
};

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

export const updateSeat = async (
  id: string,
  updates: Partial<ISeat>
): Promise<ISeat> => {
  const { data } = await axios.put(`http://localhost:3000/seat/${id}`, updates);
  return data;
};

export const deleteSeat = async (id: string): Promise<{ message: string }> => {
  const { data } = await axios.delete(`http://localhost:3000/seat/${id}`);
  return data;
};

export const resetSeatsByRoom = async (
  roomId: string
): Promise<{ message: string }> => {
  const { data } = await axios.delete(`http://localhost:3000/seat/reset/${roomId}`);
  return data;
};
