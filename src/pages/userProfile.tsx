import React from "react";
import { Button, Input, Form, Tabs, Row, Col, Card } from "antd";

const { TabPane } = Tabs;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields()
      .then((values) => console.log("Thông tin đã lưu:", values))
      .catch((info) => console.log("Lỗi:", info));
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #141414, #1f1f1f)", minHeight: "100vh", padding: "40px" }}>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 20, fontSize: 28, fontWeight: "bold" }}>
        <br />
        Thông tin cá nhân
      </h2>

      <Card style={{ maxWidth: 950, margin: "0 auto", background: "#1c1c1c", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <Tabs
          defaultActiveKey="1"
          centered
          tabBarStyle={{ color: "#fff" }}
          style={{ marginBottom: 40 }}
        >
          <TabPane tab={<span style={{ color: "#fff" }}>Tài khoản của tôi</span>} key="1" />
          <TabPane tab={<span style={{ color: "#fff" }}>Lịch sử mua vé</span>} key="2" />
          <TabPane tab={<span style={{ color: "#fff" }}>Lịch sử điểm thưởng</span>} key="3" />
        </Tabs>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: "Nguyễn",
            lastName: "Đăng Quang Long",
            phone: "0367937776",
            address: "",
            username: "longndqph48791",
            email: "longndqph48791@gmail.com",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Họ *</span>} name="firstName" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
                <Input style={{ background: "#0b0e16", color: "#fff", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Tên *</span>} name="lastName" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                <Input style={{ background: "#0b0e16", color: "#fff", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Số điện thoại *</span>} name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                <Input style={{ background: "#0b0e16", color: "#fff", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Địa chỉ</span>} name="address">
                <Input style={{ background: "#0b0e16", color: "#fff", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Tên đăng nhập</span>} name="username">
                <Input disabled style={{ background: "#0b0e16", color: "#888", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ color: "white" }}>Email</span>} name="email">
                <Input disabled style={{ background: "#0b0e16", color: "#888", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Button style={{ background: "#2a2a2a", color: "#fff", borderRadius: 8 }}>
              Đổi mật khẩu
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{
                background: "linear-gradient(90deg, #ff4d4f, #ff7875)",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              Lưu thông tin
            </Button>
          </div>
        </Form>
      </Card>

      {/* Footer */}
      <div style={{ marginTop: 60, textAlign: "center", color: "#999", fontSize: 14 }}>
        {["Chính sách", "Lịch chiếu", "Tin tức", "Giá vé", "Hỏi đáp", "Liên hệ"].map((item, i) => (
          <span key={i} style={{ margin: "0 15px", cursor: "pointer", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
