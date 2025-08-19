import axios from "axios";
import { getAccessToken, getRefreshToken, clearUserData } from "./auth";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global refresh token state
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    const isLoginRequest =
      originalRequest.url?.includes("/user/login") ||
      originalRequest.url?.includes("/auth/google");

    // Nếu là login → chỉ show message, không redirect
    if (isLoginRequest) {
      const beMessage =
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!";
      message.error(beMessage);
      return Promise.reject(error);
    }

    // Xử lý refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        clearUserData();
        window.location.href = "/dang-nhap";
        return Promise.reject(error);
      }

      try {
        const res = await axiosInstance.post("/user/refresh-token", { refreshToken });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        clearUserData();
        window.location.href = "/dang-nhap";
        return Promise.reject(err);
      }
    }

    // Các lỗi khác
    const beMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    message.error(beMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance;
