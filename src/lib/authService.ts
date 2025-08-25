import axios from "axios";
import { getAccessToken, getRefreshToken, clearUserData, isSessionExpired } from "./auth";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (isSessionExpired()) {
      clearUserData();
      if (typeof window !== "undefined") {
        window.location.href = "/dang-nhap";
      }
      return Promise.reject(new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."));
    }
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

    if (isLoginRequest) {
      const beMessage =
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!";
      message.error(beMessage);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isSessionExpired()) {
        clearUserData();
        if (typeof window !== "undefined") {
          window.location.href = "/dang-nhap";
        }
        return Promise.reject(error);
      }
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

    // Với 403, để tầng gọi tự xử lý UI (tránh trùng thông báo)
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    // Không hiển thị message.error() ở interceptor để tránh trùng lặp với màn hình gọi
    // Tầng gọi sẽ tự thông báo phù hợp ngữ cảnh
    return Promise.reject(error);
  }
);

export default axiosInstance;
