import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd";

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const userString = localStorage.getItem("user");

  if (!userString) {
    message.error("Vui lòng đăng nhập để tiếp tục");
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (!user?.role || !allowedRoles.includes(user.role.toLowerCase())) {
      message.error("Bạn không có quyền truy cập vào tác vụ này");
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  } catch (error) {
    message.error("Dữ liệu người dùng không hợp lệ");
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
