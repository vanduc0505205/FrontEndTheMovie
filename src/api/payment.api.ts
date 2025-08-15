// src/api/payment.ts
import axiosInstance from "@/lib/authService";

export const verifyVnPayPayment = async (params: Record<string, any>) => {
  return axiosInstance.get("/check_payment/verify", { params });
};
