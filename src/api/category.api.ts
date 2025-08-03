// services/category.service.ts
import axios from 'axios';
import { ICategory } from '@/types/category';

export const getCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get('http://localhost:3000/category');
  return res.data.list;
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
