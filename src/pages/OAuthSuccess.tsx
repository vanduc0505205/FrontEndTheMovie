import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token); // hoặc access_token tuỳ bạn đặt ở backend
      window.dispatchEvent(new Event("login-success"));
      message.success("Đăng nhập bằng Google thành công!");
      navigate("/");
    } else {
      message.error("Đăng nhập bằng Google thất bại");
      navigate("/dang-nhap");
    }
  }, []);

  return null;
};

export default OAuthSuccess;
