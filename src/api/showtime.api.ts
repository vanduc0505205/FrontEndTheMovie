import { IShowtime } from '@/interface/showtime';
import axiosInstance from '@/lib/authService';

export const getShowtimes = async (): Promise<IShowtime[]> => {
  const { data } = await axiosInstance.get('/showtime');
  return data.data;
};

export const createShowtime = async (payload: Partial<IShowtime>) => {
  const { data } = await axiosInstance.post('/showtime', payload);
  return data.data;
};

export const updateShowtime = async (id: string, payload: Partial<IShowtime>) => {
  const { data } = await axiosInstance.put(`/showtime/${id}`, payload);
  return data.data;
};
export const deleteShowtime = async (id: string) => {
  const { data } = await axiosInstance.delete(`/showtime/${id}`);
  return data.data;
};
export const getShowtimeById = async (id: string): Promise<IShowtime> => {
  const { data } = await axiosInstance.get(`/showtime/${id}`);
  return data.data;
};
