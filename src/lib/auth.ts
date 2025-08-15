// Lấy user từ localStorage
export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Lấy access token từ localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Lấy refresh token từ localStorage
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Xoá user và token (khi logout)
export const clearUserData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Lấy role user
export const getUserRole = () => {
  const user = getUserFromLocalStorage();
  return user?.role || null;
};