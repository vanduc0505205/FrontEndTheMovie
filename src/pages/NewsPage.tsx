import React, { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import type { CSSProperties } from "react";
import { getAllNews } from "@/api/news.api"; // API lấy tin tức
import { INews } from "@/interface/news";

const NewsPage = () => {
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNewsList(data.list || data); // tuỳ backend trả về
    } catch (err) {
      message.error("Lỗi khi tải tin tức!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {newsList.map((news) => (
            <Card
              key={news._id}
              hoverable
              style={cardStyle}
              cover={<img src={news.image} alt="news" style={imgStyle} />}
              bodyStyle={{ backgroundColor: "#1a1a1a", color: "#fff" }}
            >
              <p style={{ color: "#ccc", fontSize: 13 }}>
                {new Date(news.createdAt).toLocaleDateString("vi-VN")}
              </p>
              <h3 style={titleStyle}>{news.title}</h3>
            </Card>
          ))}
        </div>
      )}
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
