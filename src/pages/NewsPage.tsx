import React from "react";
import { Card } from "antd";
import type { CSSProperties } from "react";

const newsList = [
  {
    title:
      "TẶNG POSTER PHIM CONAN TỪ NGÀY 1/8/2025. CƠ HỘI CUỐI CÙNG NHẬN QUÀ TỪ SIÊU PHẨM ĐÂY CẢ NHÀ ƠI!",
    date: "30/07/2025",
    image:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
  },
  {
    title: "ƯU ĐÃI GIÁ VÉ 55.000Đ/VÉ 2D CHO THÀNH VIÊN U22",
    date: "29/07/2025",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  },
  {
    title:
      "SUẤT CHIẾU ĐẶC BIỆT: BỘ TỨ SIÊU ĐẲNG – BƯỚC ĐI ĐẦU TIÊN",
    date: "25/07/2025",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    title:
      "HÉ LỘ PHẦN QUÀ SIÊU HOT CHO TUẦN KHỞI CHIẾU CONAN MOVIE 28",
    date: "25/07/2025",
    image:
      "https://images.unsplash.com/photo-1549921296-3a6b5a424c86?w=800&q=80",
  },
  {
    title:
      "SUẤT CHIẾU ĐẶC BIỆT – XÌ TRUM P (LỒNG TIẾNG) – XEM PHIM SỚM, NHẬN QUÀ XINH!",
    date: "17/07/2025",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
  },
  {
    title:
      "TRẢI NGHIỆM ĐIỆN ẢNH ĐÁNG NHỚ CỦA CÁC MAYER NHÍ TẠI TRUNG TÂM CHIẾU PHIM QUỐC GIA",
    date: "17/07/2025",
    image:
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80",
  },
];

const NewsPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        padding: "48px 96px",
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#fff",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        Tin tức
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {newsList.map((news, index) => (
          <Card
            key={index}
            hoverable
            style={cardStyle}
            cover={<img src={news.image} alt="news" style={imgStyle} />}
            bodyStyle={{ backgroundColor: "#1a1a1a", color: "#fff" }}
          >
            <p style={{ color: "#ccc", fontSize: 13 }}>{news.date}</p>
            <h3 style={titleStyle}>{news.title}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

const cardStyle: CSSProperties = {
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#1a1a1a",
  border: "none",
};

const imgStyle: CSSProperties = {
  height: 180,
  objectFit: "cover",
  width: "100%",
};

const titleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: "#fff",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export default NewsPage;
