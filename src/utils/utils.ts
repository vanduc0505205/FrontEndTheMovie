// src/utils/utils.ts

export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return "0 VNĐ";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};