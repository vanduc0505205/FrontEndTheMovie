import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          role: "customer",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Đăng ký thành công! Mời bạn đăng nhập.");
        navigate("/dang-nhap");
      } else {
        message.error(data.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
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
            <Text type="secondary">Đăng ký để bắt đầu hành trình điện ảnh</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tên người dùng"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input size="large" placeholder="Tên của bạn" />
            </Form.Item>

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
              hasFeedback
            >
              <Input.Password size="large" placeholder="******" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="******" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng ký
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text>Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
