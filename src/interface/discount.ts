export interface IDiscount {
  _id: string;
  code: string;
  description?: string;
  value: number;               // số tiền giảm trực tiếp (VNĐ)
  quantity?: number;           // tổng số lượt được sử dụng (null/undefined = không giới hạn)
  usedCount?: number;          // số lượt đã sử dụng
  startDate?: string;          // ISO date string
  endDate?: string;            // ISO date string
  isActive?: boolean;
  visibility?: 'public' | 'private';
  allowedDays?: number[];      // ví dụ: [0,6] (Chủ nhật = 0, Thứ 7 = 6)
  createdAt?: string;
  updatedAt?: string;
}