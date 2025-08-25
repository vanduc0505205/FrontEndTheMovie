import axiosInstance from "@/lib/authService";
import axios from "axios";

export const bookTicket = async (bookingPayload: any) => {
  return axiosInstance.post("/booking/book", bookingPayload);
};

export const createVnPayPayment = async (amount: number) => {
  return axiosInstance.get(`/create_payment?amount=${amount}`, {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getUserBookings = async (userId: string) => {
  return axiosInstance.get(`/booking/user/${userId}`);
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  return axiosInstance.patch(`/booking/${bookingId}/status`, { status });
};

export const getAllBookings = async () => {
  return axiosInstance.get(`/booking/admin/all`);
};

export const getAllPayments = async () => {
  return axiosInstance.get("/booking/payments/admin/all");
  
};

