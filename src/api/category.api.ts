import { ICategory } from "@/interface/category";
import axiosInstance from "@/lib/authService";

export const getCategories = async (): Promise<ICategory[]> => {
  const res = await axiosInstance.get("/category");
  return res.data.list;
};

export const getDeletedCategories = async (): Promise<ICategory[]> => {
  const res = await axiosInstance.get("/category/trash");
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

export const restoreCategory = (id: string) => {
  return axiosInstance.patch(`/category/${id}/restore`);
};

export const purgeCategory = (id: string) => {
  return axiosInstance.delete(`/category/${id}/purge`);
};
