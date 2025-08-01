import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Tag,
  Image,
  message,
  Button,
  Modal,
} from "antd";
import axios from "axios";
import { IMovie } from "@/types/movie";
import { ArrowLeftOutlined, CloseCircleTwoTone } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const statusMap: Record<IMovie["status"], { label: string; color: string }> = {
  sap_chieu: { label: "Sắp chiếu", color: "blue" },
  dang_chieu: { label: "Đang chiếu", color: "green" },
  ngung_chieu: { label: "Ngừng chiếu", color: "red" },
};

function getYoutubeEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    const youtubeRegex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    const videoId = match?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerVisible, setTrailerVisible] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/movie/${id}`);
      const data = res.data?.newMovie || res.data; // handle both cases
      setMovie(data);
    } catch (err) {
      message.error("Không thể tải thông tin phim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center text-red-500">Không tìm thấy phim</div>;
  }

  const embedUrl = getYoutubeEmbedUrl(movie.trailer || "");

  return (
    <Card
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 4px 24px #e0e0e0",
        background: "#fff",
      }}
    >
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách phim
      </Button>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Image
          src={movie.poster || "https://via.placeholder.com/200x300?text=No+Poster"}
          alt={movie.title}
          width={220}
          height={320}
          style={{
            objectFit: "cover",
            borderRadius: 12,
            boxShadow: "0 2px 8px #e0e0e0",
            background: "#fafafa",
          }}
          preview={false}
        />
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: "#f7f9fa",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 4px #f0f1f2",
          }}
        >
          <Title level={3} style={{ marginBottom: 8 }}>
            {movie.title}{" "}
            <Tag color={statusMap[movie.status]?.color}>
              {statusMap[movie.status]?.label}
            </Tag>
          </Title>
          <Paragraph strong style={{ marginBottom: 4 }}>Mô tả:</Paragraph>
          <Paragraph style={{ marginBottom: 12 }}>{movie.description}</Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            ⏱ <b>Thời lượng:</b> {movie.duration} phút
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            🎬 <b>Ngày phát hành:</b>{" "}
            {new Date(movie.releaseDate).toLocaleDateString()}
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            👨‍💼 <b>Đạo diễn:</b> {movie.director}
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            👥 <b>Diễn viên:</b> {movie.actors?.join(", ") || "Không có thông tin"}
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            🗣 <b>Ngôn ngữ:</b> {movie.language}
          </Paragraph>
          <Paragraph style={{ marginBottom: 4 }}>
            🔞 <b>Giới hạn tuổi:</b> {movie.ageRating}
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            📂 <b>Danh mục:</b>{" "}
            {movie.categories?.map((cat) => (
              <Tag key={cat._id} >{cat.categoryName}</Tag>
            )) || "Không có danh mục"}
          </Paragraph>
          {embedUrl && (
            <Paragraph style={{ marginBottom: 4 }}>
              📽 <b>Trailer:</b>{" "}
              <Button type="link" onClick={() => setTrailerVisible(true)}>
                Xem trailer
              </Button>
            </Paragraph>
          )}

          {/* Modal Trailer */}
          <Modal
            open={trailerVisible}
            onCancel={() => setTrailerVisible(false)}
            footer={null}
            width={1000}
          // bodyStyle={{ padding: 20 }}
          // destroyOnClose
          >
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={embedUrl}
                title="Trailer"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </Modal>

          {movie.banner?.length > 0 && (
            <>
              <Paragraph strong style={{ marginTop: 24 }}>Banner:</Paragraph>
              <div className="flex flex-wrap gap-2">
                {movie.banner.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    width={300}
                    height={160}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Trailer */}
      <Modal
        open={trailerVisible}
        onCancel={() => setTrailerVisible(false)}
        footer={null}
        width={1000}
        closeIcon={
          <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 32 }} />
        }
      >
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={embedUrl}
            title="Trailer"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      </Modal>

      
    </Card>
  );
}
