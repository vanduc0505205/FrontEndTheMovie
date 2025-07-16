import { Cinema } from '@/types';
import axios from 'axios'

// Sau khi đầy đủ api của cinema thì chuyển về folder types

export const getCinemas = async (
  page = 1,
  limit = 5
): Promise<{ data: Cinema[]; pagination: { page: number; limit: number; total: number } }> => {
  const { data } = await axios.get(`http://localhost:3000/cinema?page=${page}&limit=${limit}`);
  return data;
};
export const getCinemaById = async (id: string): Promise<Cinema> => {
  const { data } = await axios.get(`http://localhost:3000/cinema/${id}`);
  return data.data;
};

export const createCinema = async (cinema: Omit<Cinema, '_id'>): Promise<Cinema> => {
  const { data } = await axios.post(`http://localhost:3000/cinema`, cinema);
  return data;
};

export const updateCinema = async (id: string, cinema: Partial<Cinema>): Promise<Cinema> => {
  const { data } = await axios.put(`http://localhost:3000/cinema/${id}`, cinema);
  return data;
};

export const deleteCinema = async (id: string): Promise<string> => {
  const { data } = await axios.delete(`http://localhost:3000/cinema/${id}`);
  return data.message;
};