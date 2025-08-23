import axiosInstance from '@/lib/authService';
import { INews } from '@/interface/news';

// Lấy tất cả tin tức (có thể truyền query params nếu cần phân trang, lọc...)
export const getAllNews = async (params?: Record<string, any>) => {
  const res = await axiosInstance.get("/news", { params });
  return res.data;
};

// Lấy danh sách tin tức đơn giản (chỉ list, không phân trang)
export const getAllNewsSimple = async (): Promise<INews[]> => {
  const res = await axiosInstance.get("/news");
  return res.data.list; 
};

// Lấy chi tiết tin tức theo id
export const getNewsById = async (id: string): Promise<INews> => {
  const res = await axiosInstance.get(`/news/${id}`);
  return res.data;
};

// Tạo mới tin tức
export const createNews = async (news: Partial<INews>): Promise<INews> => {
  const res = await axiosInstance.post("/news", news);
  return res.data;
};

// Cập nhật tin tức
export const updateNews = async (
  id: string,
  news: Partial<INews>
): Promise<INews> => {
  const res = await axiosInstance.put(`/news/${id}`, news);
  return res.data;
};

// Xóa tin tức
export const deleteNews = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/news/${id}`);
};

// Tìm kiếm tin tức theo từ khóa
export const searchNews = async (query: string): Promise<INews[]> => {
  const res = await axiosInstance.get("/news/search", { params: { q: query } });
  return res.data.list;
};

