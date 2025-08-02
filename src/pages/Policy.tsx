import React from "react";
import { Typography, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;

const PolicyPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        color: "#f0f0f0",
        minHeight: "100vh",
        padding: "48px 96px",
      }}
    >
      <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
        Quy định & Chính sách
      </Title>

      <Divider style={{ backgroundColor: "#444" }} />

      <Typography style={{ color: "#fff" }}>
        <Title level={3} style={{ color: "#fff" }}>1. Quy định chung</Title>
        <Paragraph style={{ color: "#eee" }}>
          - Khách hàng vui lòng đến rạp trước giờ chiếu ít nhất 15 phút.<br />
          - Không mang đồ ăn, thức uống từ bên ngoài vào rạp.<br />
          - Không hút thuốc, quay phim hoặc chụp ảnh trong phòng chiếu.<br />
          - Trẻ em dưới 13 tuổi phải có người lớn đi cùng khi xem phim có giới hạn độ tuổi.
        </Paragraph>

        <Title level={3} style={{ color: "#fff" }}>2. Chính sách vé</Title>
        <Paragraph style={{ color: "#eee" }}>
          - Vé đã mua không hoàn, không đổi.<br />
          - Vé đặt online cần thanh toán trong vòng 10 phút, quá thời gian hệ thống sẽ tự hủy.<br />
          - Khuyến mãi áp dụng tùy từng thời điểm và không cộng dồn với ưu đãi khác.
        </Paragraph>

        <Title level={3} style={{ color: "#fff" }}>3. Chính sách bảo mật</Title>
        <Paragraph style={{ color: "#eee" }}>
          - Mọi thông tin cá nhân của khách hàng đều được bảo mật và chỉ sử dụng cho mục đích hỗ trợ dịch vụ.<br />
          - Hệ thống có thể sử dụng cookie để cải thiện trải nghiệm người dùng.
        </Paragraph>

        <Title level={3} style={{ color: "#fff" }}>4. Chính sách thành viên</Title>
        <Paragraph style={{ color: "#eee" }}>
          - Thành viên tích lũy điểm khi mua vé hoặc sử dụng dịch vụ tại rạp.<br />
          - Ưu đãi sinh nhật, khuyến mãi riêng theo cấp độ thành viên (Silver, Gold, Diamond).<br />
          - Điểm tích lũy có thể đổi vé miễn phí hoặc quà tặng.
        </Paragraph>

        <Title level={3} style={{ color: "#fff" }}>5. Liên hệ - Khiếu nại</Title>
        <Paragraph style={{ color: "#eee" }}>
          - Email: cskh@trungtamchieuphim.vn<br />
          - Hotline: 1900 1234 (7:00 - 22:00 hàng ngày)<br />
          - Mọi thắc mắc sẽ được giải quyết trong vòng 48 giờ làm việc.
        </Paragraph>
      </Typography>
    </div>
  );
};

export default PolicyPage;
