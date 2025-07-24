import { IRoom } from '@/types/room';
import axios from 'axios'

export const getRooms = async (): Promise<IRoom[]> => {
  const { data } = await axios.get('http://localhost:3000/room')
  return data;
}

// Tạo phòng
export const createRoom = async (payload: Partial<IRoom>) => {
  const { data } = await axios.post('http://localhost:3000/room', payload);
  return data;
};

export const getRoomById = async (id: string): Promise<IRoom> => {
  const { data } = await axios.get(`http://localhost:3000/room/${id}`);
  return data;
};

// Cập nhật phòng
export const updateRoom = async (id: string, payload: Partial<IRoom>) => {
  const { data } = await axios.put(`http://localhost:3000/room/${id}`, payload);
  return data;
};

// Xoá phòng
export const deleteRoom = async (id: string) => {
  const { data } = await axios.delete(`http://localhost:3000/room/${id}`);
  return data;
};
