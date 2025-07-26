import React, { useEffect, useState } from "react";
import { message } from "antd";

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      message.error("Vui lòng đăng nhập để tiếp tục");
      setAuthorized(false);
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (!user?.role || !allowedRoles.includes(user.role)) {
        message.error("Bạn không có quyền truy cập vào tác vụ này");
        setAuthorized(false);
        return;
      }

      setAuthorized(true); // Đủ quyền
    } catch (error) {
      message.error("Dữ liệu người dùng không hợp lệ");
      setAuthorized(false);
    }
  }, [allowedRoles]);

  // Chưa xác định quyền: render rỗng (tránh flicker)
  if (authorized === null) return null;

  // Không có quyền: không render gì cả
  if (!authorized) return null;

  // Có quyền
  return <>{children}</>;
};

export default RequireRole;
