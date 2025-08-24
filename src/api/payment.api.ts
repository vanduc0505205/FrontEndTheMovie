import axiosInstance from "@/lib/authService";

export const verifyVnPayPayment = async (params: Record<string, any>) => {
  return axiosInstance.get("/payment/vnp_return", { params });
};

export const createPayment = async (payload: { bookingId: string; bankCode?: string }) => {
  return axiosInstance.post("/payment/create", payload, {
    headers: {
      Accept: "application/json",
    },
  });
};

export const checkPaymentStatus = async (bookingId: string) => {
  return axiosInstance.get("/payment/check", { params: { bookingId } });
};
