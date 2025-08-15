import { ISeat } from '@/interface/seat';
import axiosInstance from '@/lib/authService';


export const getSeatsByRoom = async (roomId: string): Promise<ISeat[]> => {
  const { data } = await axiosInstance.get(`/seat/room/${roomId}`);
  return data as ISeat[];
};

export const bulkCreateSeats = async (payload: {
  roomId: string;
  rows: number;
  columns: number;
  vipSeats?: string[];
  vipRows?: string[];
}): Promise<ISeat[]> => {
  const { data } = await axiosInstance.post("/seat/bulk", payload);
  return data;
};

export const updateSeat = async (
  id: string,
  updates: Partial<ISeat>
): Promise<ISeat> => {
  const { data } = await axiosInstance.put(`/seat/${id}`, updates);
  return data;
};

export const deleteSeat = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/seat/${id}`);
  return data;
};

export const resetSeatsByRoom = async (
  roomId: string
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/seat/reset/${roomId}`);
  return data;
};
