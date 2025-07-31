// src/lib/auth.ts

// Lấy user từ localStorage
export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Lấy access token từ localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Xoá user và token (khi logout)
export const clearUserData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};
