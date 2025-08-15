import { IRoom } from '@/types/room';
import axiosInstance from '@/lib/authService';

export const getRooms = async (): Promise<IRoom[]> => {
  const { data } = await axiosInstance.get('/room');
  return data;
};

// Tạo phòng
export const createRoom = async (payload: Partial<IRoom>) => {
  const { data } = await axiosInstance.post('/room', payload);
  return data;
};

export const getRoomById = async (id: string): Promise<IRoom> => {
  const { data } = await axiosInstance.get(`/room/${id}`);
  return data;
};

// Cập nhật phòng
export const updateRoom = async (id: string, payload: Partial<IRoom>) => {
  const { data } = await axiosInstance.put(`/room/${id}`, payload);
  return data;
};

// Xoá phòng
export const deleteRoom = async (id: string) => {
  const { data } = await axiosInstance.delete(`/room/${id}`);
  return data;
};
