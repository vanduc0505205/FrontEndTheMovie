import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import  type { Login } from "@/interface/user";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Login) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        message.success("Đăng nhập thành công!");

        //Lưu thông tin user & token
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("login-success"));


        // Điều hướng theo quyền
        const role = data.user?.role;
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "staff") {
          navigate("/staff");
        } else {
          navigate("/");
        }
      } else {
        message.error(data.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      message.error("Lỗi server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] p-6">
      <div className="flex w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-lg">
        <div
          className="w-1/2 hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: "url('src/assets/images/dangky.jpg')",
          }}
        />
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <Title level={3}>🎥 Alpha Cinema</Title>
            <Text type="secondary">Đăng nhập để tiếp tục</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input size="large" placeholder="example@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password size="large" placeholder="******" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text>
                Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
              </Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
