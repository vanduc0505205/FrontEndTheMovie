// src/api/discount.api.ts
import axiosClient from "./axiosClient";
import { IDiscount } from "@/interface/discount.ts";

export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  const res = await axiosClient.get("/discount");
  return res.data.list || res.data;
};

// API to get discount details by id
export const getDiscountById = async (id: string): Promise<IDiscount> => {
  const res = await axiosClient.get(`/discount/${id}`);
  return res.data;
};

// Create a new discount
export const createDiscount = async (data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axiosClient.post("/discount", data);
  return res.data;
};

// Update a discount by id
export const updateDiscount = async (id: string, data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axiosClient.put(`/discount/${id}`, data);
  return res.data;
};

// Delete a discount by id
export const deleteDiscount = async (id: string): Promise<void> => {
  await axiosClient.delete(`/discount/${id}`);
};

// ✅ Cập nhật lại interface để chỉ chứa những thuộc tính mà backend trả về
export interface ICheckDiscountResponse {
  success: boolean;
  message: string;
  discountId: string;
  code: string;
  type: "fixed";
  value: number;
  discountAmount: number;
  finalPrice: number;
}

export const checkDiscountCode = async (
  code: string,
  total: number
): Promise<ICheckDiscountResponse> => {
  const res = await axiosClient.post("/discount/check", { code, total });
  return res.data;
};

export type { IDiscount };