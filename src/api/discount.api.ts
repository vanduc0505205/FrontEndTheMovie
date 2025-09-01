import axios from "axios";
import { IDiscount } from "@/interface/discount.ts";
export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  const res = await axios.get("http://localhost:3000/discount");
  return res.data.list || res.data;
};
export const getDiscountById = async (id: string): Promise<IDiscount> => {
  const res = await axios.get(`http://localhost:3000/discount/${id}`);
  return res.data;
};
export const createDiscount = async (data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axios.post("http://localhost:3000/discount", data);
  return res.data;
};
export const updateDiscount = async (id: string, data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axios.put(`http://localhost:3000/discount/${id}`, data);
  return res.data;
};

export const deleteDiscount = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:3000/discount/${id}`);
};

export interface IApplyDiscountRequest {
  code: string;
  total: number;
}

export interface IApplyDiscountResponse {
  discountAmount: number;
  finalPrice?: number; 
  discountedTotal?: number; 
}

export const applyDiscount = async (
  data: IApplyDiscountRequest
): Promise<IApplyDiscountResponse> => {
  const res = await axios.post("http://localhost:3000/discount/apply", data);
  return res.data;
};

export interface IAvailableDiscount {
  id: string;
  code: string;
  description?: string;
  value: number;
  startDate?: string;
  endDate?: string;
  allowedDays?: number[];
  remaining: number | null; // null = không giới hạn
}

export const getAvailableDiscounts = async (): Promise<IAvailableDiscount[]> => {
  const res = await axios.get("http://localhost:3000/discount/available");
  return Array.isArray(res.data) ? res.data : [];
};

export type { IDiscount };