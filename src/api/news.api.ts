import axiosInstance from '@/lib/authService';
import { INews } from '@/interface/news';

export interface IPaginated<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

export type NewsQueryParams = {
  page?: number;
  limit?: number;
  category?: INews['category'];
  q?: string;
  all?: 1 | true;
  isFeatured?: 1 | true;
  tag?: string | string[];
};

export const getAllNews = async (
  params?: NewsQueryParams
): Promise<IPaginated<INews>> => {
  const res = await axiosInstance.get("/news", { params });
  return res.data as IPaginated<INews>;
};

export const getAllNewsSimple = async (
  params?: Omit<NewsQueryParams, 'page' | 'limit'>
): Promise<INews[]> => {
  const res = await axiosInstance.get("/news", { params });
  const data = res.data as IPaginated<INews>;
  return data.list;
};

export const getNewsById = async (id: string, params?: { all?: 1 | true }): Promise<INews> => {
  const res = await axiosInstance.get(`/news/${id}`, { params });
  return res.data as INews;
};

export const createNews = async (news: Partial<INews>): Promise<INews> => {
  const res = await axiosInstance.post("/news", news);
  return res.data as INews;
};

export const updateNews = async (
  id: string,
  news: Partial<INews>
): Promise<INews> => {
  const res = await axiosInstance.put(`/news/${id}`, news);
  return res.data as INews;
};

export const deleteNews = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/news/${id}`);
};

export const searchNews = async (
  params: { q: string; page?: number; limit?: number; category?: INews['category'] }
): Promise<IPaginated<INews>> => {
  const res = await axiosInstance.get("/news/search", { params });
  return res.data as IPaginated<INews>;
};

