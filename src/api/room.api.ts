import { IRoom } from '@/interface/room';
import axiosInstance from '@/lib/authService';

export const getRooms = async (): Promise<IRoom[]> => {
  const { data } = await axiosInstance.get('/room');
  return data;
};

export const createRoom = async (payload: Partial<IRoom>) => {
  const { data } = await axiosInstance.post('/room', payload);
  return data;
};

export const getRoomById = async (id: string): Promise<IRoom> => {
  const { data } = await axiosInstance.get(`/room/${id}`);
  return data;
};

export const updateRoom = async (id: string, payload: Partial<IRoom>) => {
  const { data } = await axiosInstance.put(`/room/${id}`, payload);
  return data;
};

export const deleteRoom = async (id: string) => {
  const { data } = await axiosInstance.delete(`/room/${id}`);
  return data;
};
