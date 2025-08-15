import { IShowtime } from '@/interface/showtime';
import axiosInstance from '@/lib/authService';

// Lấy tất cả suất chiếu
export const getShowtimes = async (): Promise<IShowtime[]> => {
  const { data } = await axiosInstance.get('/showtime');
  return data.data;
};

// Thêm suất chiếu mới
export const createShowtime = async (payload: Partial<IShowtime>) => {
  const { data } = await axiosInstance.post('/showtime', payload);
  return data.data;
};

// Cập nhật suất chiếu
export const updateShowtime = async (id: string, payload: Partial<IShowtime>) => {
  const { data } = await axiosInstance.put(`/showtime/${id}`, payload);
  return data.data;
};

// Xoá suất chiếu
export const deleteShowtime = async (id: string) => {
  const { data } = await axiosInstance.delete(`/showtime/${id}`);
  return data.data;
};

// Lấy 1 suất chiếu theo ID
export const getShowtimeById = async (id: string): Promise<IShowtime> => {
  const { data } = await axiosInstance.get(`/showtime/${id}`);
  return data.data;
};
