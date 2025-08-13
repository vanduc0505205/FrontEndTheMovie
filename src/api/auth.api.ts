import axiosInstance from "@/lib/authService";

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/user/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axiosInstance.post("/user/reset-password", { token, newPassword });
  return res.data;
};

// API lấy thông tin user sau khi login OAuth
export const getOAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
