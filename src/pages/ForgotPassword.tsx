import { Form, Input, Button, message, Typography, Alert } from "antd";
import { forgotPassword } from "@/api/auth.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Title } = Typography;

const ForgotPassword = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldownSec, setCooldownSec] = useState<number>(0);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const timer = setInterval(() => {
      setCooldownSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSec]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await forgotPassword(values.email);
      message.success(
        res?.message ||
          "Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư."
      );
      form.resetFields();
      setCooldownSec(15);
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.debug("ForgotPassword error:", err);
      }
      message.error(err.response?.data?.message || "Lỗi xảy ra");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Title level={3}>Quên mật khẩu</Title>
        </div>

        <Alert
          className="mb-4"
          type="info"
          message="Hướng dẫn"
          description="Nhập email đã đăng ký. Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu (liên kết có thời hạn)."
          showIcon
        />

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email đã đăng ký" type="email" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading || cooldownSec > 0}
            >
              {cooldownSec > 0 ? `Gửi lại sau ${cooldownSec}s` : "Gửi yêu cầu"}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-2 text-sm text-gray-600">
          Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu. Liên kết có thể hết hạn sau một thời gian ngắn.
        </div>

        <div className="mt-6 text-center">
          <Link to="/dang-nhap" className="text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
