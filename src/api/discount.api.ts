import axios from "axios";
import { IDiscount } from "@/interface/discount.ts";
// API trả về danh sách discount (giả sử backend trả về { list: IDiscount[] })
export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  const res = await axios.get("http://localhost:3000/discount");
  return res.data.list || res.data; // fallback nếu backend trả thẳng mảng
};

// API lấy chi tiết discount theo id
export const getDiscountById = async (id: string): Promise<IDiscount> => {
  const res = await axios.get(`http://localhost:3000/discount/${id}`);
  return res.data;
};

// Tạo mới discount
export const createDiscount = async (data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axios.post("http://localhost:3000/discount", data);
  return res.data;
};

// Cập nhật discount theo id
export const updateDiscount = async (id: string, data: Partial<IDiscount>): Promise<IDiscount> => {
  const res = await axios.put(`http://localhost:3000/discount/${id}`, data);
  return res.data;
};

// Xóa discount theo id
export const deleteDiscount = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:3000/discount/${id}`);
};

// Dữ liệu request áp dụng mã giảm giá
export interface IApplyDiscountRequest {
  code: string;
  total: number;
}

// Dữ liệu response áp dụng mã giảm giá (bạn tùy chỉnh nếu backend trả khác)
export interface IApplyDiscountResponse {
  discountedTotal: number;
  discountAmount: number;
  // thêm trường khác nếu có
}

// Áp dụng mã giảm giá
export const applyDiscount = async (
  data: IApplyDiscountRequest
): Promise<IApplyDiscountResponse> => {
  const res = await axios.post("http://localhost:3000/discount/apply", data);
  return res.data;
};

export type { IDiscount };