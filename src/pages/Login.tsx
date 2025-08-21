import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { IUser } from "@/interface/user";
import { login } from "@/api/auth.api";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: IUser) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const data = await login(email, password);

      if (data.accessToken) {
        if (data.user?.status === "blocked") {
          message.error("Tài khoản của bạn đã bị khóa.");
          return;
        }

        message.success("Đăng nhập thành công!");
        localStorage.setItem("accessToken", data.accessToken);
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
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      message.error(error.response?.data?.message || "Lỗi server. Vui lòng thử lại.");
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

            <Form.Item>
              <Button
                icon={<img src="https://developers.google.com/identity/images/g-logo.png" alt="google" className="w-5 h-5 mr-2" />}
                block
                size="large"
                onClick={() => {
                  window.location.href = "http://localhost:3000/auth/google";
                }}
              >
                Đăng nhập bằng Google
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
