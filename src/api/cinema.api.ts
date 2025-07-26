
import { Cinema } from '@/interface/cinema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// lấy token từ localStorage (bạn lưu token lúc đăng nhập)
const getToken = () => localStorage.getItem('access_token');

// Cấu hình header Authorization
const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getCinemas = async (
  page = 1,
  limit = 5
): Promise<{ data: Cinema[]; pagination: { page: number; limit: number; total: number } }> => {
  const { data } = await axios.get(`${API_BASE_URL}/cinema?page=${page}&limit=${limit}`, axiosConfig());
  return data;
};

export const getCinemaById = async (id: string): Promise<Cinema> => {
  const { data } = await axios.get(`${API_BASE_URL}/cinema/${id}`, axiosConfig());
  return data.data;
};

export const createCinema = async (cinema: Omit<Cinema, '_id'>): Promise<Cinema> => {
  const { data } = await axios.post(`${API_BASE_URL}/cinema`, cinema, axiosConfig());
  return data;
};

export const updateCinema = async (id: string, cinema: Partial<Cinema>): Promise<Cinema> => {
  const { data } = await axios.put(`${API_BASE_URL}/cinema/${id}`, cinema, axiosConfig());
  return data;
};

export const deleteCinema = async (id: string): Promise<string> => {
  const { data } = await axios.delete(`${API_BASE_URL}/cinema/${id}`, axiosConfig());
  return data.message;
};
