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

// Gọi API login
export const login = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post(`/user/login`, { email, password });
    return res.data; // data.user, data.accessToken, ...
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Đổi mật khẩu
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  try {
    const res = await axiosInstance.patch(`/user/${userId}/change-password`, {
      oldPassword,
      newPassword,
    });
    return res.data; // { message: "Đổi mật khẩu thành công" }
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};