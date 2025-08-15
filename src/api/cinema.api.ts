import { ICinema } from '@/interface/cinema';
import axiosInstance from '@/lib/authService'; 

export const getCinemas = async (
  page = 1,
  limit = 5
): Promise<{ data: ICinema[]; pagination: { page: number; limit: number; total: number } }> => {
  const { data } = await axiosInstance.get(`/cinema?page=${page}&limit=${limit}`);
  return data;
};

export const getCinemaById = async (id: string): Promise<ICinema> => {
  const { data } = await axiosInstance.get(`/cinema/${id}`);
  return data.data;
};

export const createCinema = async (cinema: Omit<ICinema, '_id'>): Promise<ICinema> => {
  const { data } = await axiosInstance.post(`/cinema`, cinema);
  return data;
};

export const updateCinema = async (id: string, cinema: Partial<ICinema>): Promise<ICinema> => {
  const { data } = await axiosInstance.put(`/cinema/${id}`, cinema);
  return data;
};

export const deleteCinema = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.delete(`/cinema/${id}`);
  return data.message;
};