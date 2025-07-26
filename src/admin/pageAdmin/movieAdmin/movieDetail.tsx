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
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const statusMap: Record<IMovie["status"], { label: string; color: string }> = {
  sap_chieu: { label: "Sắp chiếu", color: "blue" },
  dang_chieu: { label: "Đang chiếu", color: "green" },
  ngung_chieu: { label: "Ngừng chiếu", color: "red" },
};

// Hàm chuẩn hóa link YouTube
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
      const data = res.data?.newMovie || res.data;
      console.log("Movie data:", data);
      setMovie(data);
    } catch (err) {
      console.error(err);
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
    <Card style={{ maxWidth: 900, margin: "24px auto" }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách phim
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={movie.poster || "https://via.placeholder.com/200x300?text=No+Poster"}
          alt={movie.title}
          width={200}
          height={300}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        <div className="flex-1">
          <Title level={3}>
            {movie.title}{" "}
            <Tag color={statusMap[movie.status]?.color}>
              {statusMap[movie.status]?.label}
            </Tag>
          </Title>
          <Paragraph strong>Mô tả:</Paragraph>
          <Paragraph>{movie.description}</Paragraph>
          <Paragraph>⏱ Thời lượng: {movie.duration} phút</Paragraph>
          <Paragraph>
            🎬 Ngày phát hành:{" "}
            {new Date(movie.releaseDate).toLocaleDateString()}
          </Paragraph>
          <Paragraph>👨‍💼 Đạo diễn: {movie.director}</Paragraph>
          <Paragraph>
            👥 Diễn viên: {movie.actors?.join(", ") || "Không có thông tin"}
          </Paragraph>
          <Paragraph>🗣 Ngôn ngữ: {movie.language}</Paragraph>
          <Paragraph>🔞 Giới hạn tuổi: {movie.ageRating}</Paragraph>

          {embedUrl && (
            <Paragraph>
              📽 Trailer:{" "}
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
    </Card>
  );
}
