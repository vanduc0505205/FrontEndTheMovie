import { Form, Input, Button, message, Typography } from "antd";
import { forgotPassword } from "@/api/auth.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await forgotPassword(values.email);
      message.success(res.message || "Đã gửi yêu cầu reset");

      if (import.meta.env.VITE_SHOW_TOKEN === "true" && res.resetToken) {
        setToken(res.resetToken);
        navigate(`/reset-password?token=${res.resetToken}`);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi xảy ra");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Title level={3}>Quên mật khẩu</Title>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Nhập email đã đăng ký" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>

        {import.meta.env.VITE_SHOW_TOKEN === "true" && token && (
          <div className="mt-4">
            <strong>Token (Dev):</strong> {token}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
