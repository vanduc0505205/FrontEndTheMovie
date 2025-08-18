import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { message } from "antd";

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const NotAuthorized = () => (
  <div
    style={{
      height: "100vh",      
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", 
      alignItems: "center",     
      textAlign: "center",
      padding: 40,
    }}
  >
    <img
      src="http://localhost:3000/uploads/needLogin.svg"
      alt="Cần đăng nhập"
      style={{ width: 500, marginBottom: 10 }} 
    />
    <h2>Bạn cần đăng nhập để tiếp tục</h2>
    <p>
      Vui lòng <Link to="/dang-nhap" className="text-blue-600 hover:text-blue-800 underline">đăng nhập</Link> để truy cập trang này.
    </p>
  </div>
);

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <NotAuthorized />;
  }

  try {
    const user = JSON.parse(userString);
    if (!user?.role || !allowedRoles.includes(user.role.toLowerCase())) {
      message.error("Bạn không có quyền truy cập vào tác vụ này");
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  } catch (error) {
    message.error("Dữ liệu người dùng không hợp lệ");
    return <Navigate to="/dang-nhap" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
