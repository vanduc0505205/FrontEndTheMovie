// services/category.service.ts
import axios from 'axios';
import { Category } from '@/types/index';

const BASE_URL = 'http://localhost:3000/category';

export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get('http://localhost:3000/category');
  console.log("Dữ liệu trả về từ API:", res.data);
  return res.data; // Giả sử BE trả về { list: [...] }
};

export const createCategory = async (payload: {
  categoryName: string;
  description?: string;
}) => {
  return axios.post('http://localhost:3000/category', payload);
};

export const updateCategory = async (
  id: string,
  payload: { categoryName: string; description?: string }
) => {
  return axios.put(`http://localhost:3000/category/${id}`, payload);
};

export const deleteCategory = async (id: string) => {
  return axios.delete(`http://localhost:3000/category/${id}`);
};
