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
  localStorage.removeItem("loginAt");
};

// Lấy role user
export const getUserRole = () => {
  const user = getUserFromLocalStorage();
  return user?.role || null;
};

export const SESSION_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

export const setLoginAtNow = () => {
  localStorage.setItem("loginAt", Date.now().toString());
};

export const getLoginAt = (): number | null => {
  const v = localStorage.getItem("loginAt");
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

export const isSessionExpired = (): boolean => {
  const at = getLoginAt();
  if (!at) return false;
  return Date.now() - at >= SESSION_MAX_AGE_MS;
};

export const enforceLogoutIfExpired = (): boolean => {
  if (isSessionExpired()) {
    clearUserData();
    if (typeof window !== "undefined") {
      window.location.href = "/dang-nhap";
    }
    return true;
  }
  return false;
};