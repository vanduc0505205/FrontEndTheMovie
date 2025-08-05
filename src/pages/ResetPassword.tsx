import { Form, Input, Button, message, Typography } from "antd";
import { resetPassword } from "@/api/auth.api";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Link } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const token = searchParams.get("token");

  const onFinish = async (values: any) => {
    if (!token) {
      return message.error("Thiếu token trong URL");
    }

    try {
      await resetPassword(token, values.newPassword);
      message.success("Đặt lại mật khẩu thành công");
      navigate("/dang-nhap");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi đặt lại mật khẩu");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "2rem" }}>
          Đặt lại mật khẩu
        </Title>

        <Form form={form} onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đặt lại mật khẩu
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Link
              style={{ display: "block", textAlign: "center" }}
              onClick={() => navigate("/dang-nhap")}
            >
              Quay lại đăng nhập
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
