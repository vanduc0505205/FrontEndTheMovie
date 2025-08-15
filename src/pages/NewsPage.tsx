import React from "react";
import { Card } from "antd";
import type { CSSProperties } from "react";

const newsList = [
  {
    title:
      "TẶNG POSTER PHIM CONAN TỪ NGÀY 1/8/2025. CƠ HỘI CUỐI CÙNG NHẬN QUÀ TỪ SIÊU PHẨM ĐÂY CẢ NHÀ ƠI!",
    date: "30/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018973.jpg&w=384&q=75",
  },
  {
    title: "ƯU ĐÃI GIÁ VÉ 55.000Đ/VÉ 2D CHO THÀNH VIÊN U22",
    date: "29/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018966.png&w=384&q=75",
  },
  {
    title:
      "SUẤT CHIẾU ĐẶC BIỆT: BỘ TỨ SIÊU ĐẲNG – BƯỚC ĐI ĐẦU TIÊN",
    date: "25/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018943.jpg&w=384&q=75",
  },
  {
    title:
      "HÉ LỘ PHẦN QUÀ SIÊU HOT CHO TUẦN KHỞI CHIẾU CONAN MOVIE 28",
    date: "25/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018939.jpg&w=384&q=75",
  },
  {
    title:
      "SUẤT CHIẾU ĐẶC BIỆT – XÌ TRUM P (LỒNG TIẾNG) – XEM PHIM SỚM, NHẬN QUÀ XINH!",
    date: "17/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018918.jpg&w=384&q=75",
  },
  {
    title:
      "TRẢI NGHIỆM ĐIỆN ẢNH ĐÁNG NHỚ CỦA CÁC MAYER NHÍ TẠI TRUNG TÂM CHIẾU PHIM QUỐC GIA",
    date: "17/07/2025",
    image:
      "https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FThumbs%2F0018915.jpg&w=384&q=75",
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
        <br />
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
