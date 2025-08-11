// Interface Discount theo schema mongoose bạn cho
export interface IDiscount {
  _id: string;
  code: string;
  description?: string;
  type: "percent" | "amount";
  value: number;
  maxDiscount?: number | null;
  quantity?: number;
  usedCount?: number;
  startDate?: string; // ISO string date
  endDate?: string;
  isActive?: boolean;
  allowedDays?: number[]; // ví dụ: [0,6]
  createdAt?: string;
  updatedAt?: string;
}
