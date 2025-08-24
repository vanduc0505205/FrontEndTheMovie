// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // Địa chỉ backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Bạn có thể thêm các interceptor ở đây để xử lý lỗi hoặc token
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401 (Unauthorized) ở đây, ví dụ: redirect về trang login
      console.error("Authentication error: ", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;