import axiosInstance from "@/lib/authService";

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