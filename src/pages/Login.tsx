import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import type { Login } from "@/interface/user";

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
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("login-success"));

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block">
          <img
            src="src/assets/images/dangky.jpg"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-8">
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

            <div className="text-center mb-2">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="text-center">
              <Text>
                Chưa có tài khoản?{" "}
                <Link to="/dang-ky" className="text-blue-500 hover:underline">
                  Đăng ký
                </Link>
              </Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
