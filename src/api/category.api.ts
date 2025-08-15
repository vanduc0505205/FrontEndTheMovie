// services/category.service.ts
import axiosInstance from "@/lib/authService";
import { ICategory } from "@/types/category";

export const getCategories = async (): Promise<ICategory[]> => {
  const res = await axiosInstance.get("/category");
  return res.data.list;
};

export const createCategory = (payload: {
  categoryName: string;
  description?: string;
}) => {
  return axiosInstance.post("/category", payload);
};

export const updateCategory = (
  id: string,
  payload: { categoryName: string; description?: string }
) => {
  return axiosInstance.put(`/category/${id}`, payload);
};

export const deleteCategory = (id: string) => {
  return axiosInstance.delete(`/category/${id}`);
};
