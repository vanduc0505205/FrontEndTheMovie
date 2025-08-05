import axios from "axios";

export const forgotPassword = async (email: string) => {
  const res = await axios.post("http://localhost:3000/user/forgot-password", {
    email,
  });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post("http://localhost:3000/user/reset-password", {
    token,
    newPassword,
  });
  return res.data;
};
