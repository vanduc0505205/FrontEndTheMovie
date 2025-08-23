import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getOAuthUser } from "@/api/auth.api";

const OAuthSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const refreshToken = params.get("refreshToken");

  useEffect(() => {
  const fetchUser = async () => {
    try {
      // Lưu token ngay lập tức
      localStorage.setItem("accessToken", token!);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      const user = await getOAuthUser();
      console.log(user);

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("login-success"));
      message.success("Đăng nhập bằng Google thành công!");
      navigate("/");
    } catch (error) {
      message.error("Lấy thông tin người dùng thất bại");
      navigate("/dang-nhap");
    }
  };

  if (token) {
    fetchUser();
  } else {
    message.error("Đăng nhập bằng Google thất bại");
    navigate("/dang-nhap");
  }
}, []);


  return null;
};

export default OAuthSuccess;
