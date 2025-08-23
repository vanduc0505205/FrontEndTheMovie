import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Logout: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("http://localhost:3000/user/logout", {
          method: "POST",
          credentials: "include",
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("login-success"));
        message.success("Đã đăng xuất");
        navigate("/dang-nhap");
      } catch (err) {
        console.error("Lỗi đăng xuất:", err);
        message.error("Lỗi khi đăng xuất");
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
