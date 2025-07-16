import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  message,
  Popconfirm,
  Tag,
  Form,
} from "antd";
import MovieModal from "./movieFormModal";
import { Movie } from "@/types";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const statusMap: Record<Movie["status"], { label: string; color: string }> = {
  sap_chieu: { label: "Sắp chiếu", color: "blue" },
  dang_chieu: { label: "Đang chiếu", color: "green" },
  ngung_chieu: { label: "Ngừng chiếu", color: "red" },
};

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchMovies = async (page = currentPage, limit = pageSize) => {
    try {
      const res = await axios.get("http://localhost:3000/movie", {
        params: { page, limit },
      });
      setMovies(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phim");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!modalOpen) setSelectedMovie(null);
  }, [modalOpen]);

  const handleCreate = () => {
    setSelectedMovie(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/movie/${id}`);
      message.success("Xoá thành công");
      fetchMovies();
    } catch (error) {
      console.error("Lỗi xoá:", error);
      message.error("Xoá thất bại");
    }
  };

  const handleSubmit = async (data: Movie) => {
    setLoading(true);
    try {
      if (isEditing && selectedMovie) {
        await axios.put(`http://localhost:3000/movie/${selectedMovie._id}`, data);
        message.success("Cập nhật thành công");
      } else {
        await axios.post("http://localhost:3000/movie", data);
        message.success("Thêm phim thành công");
      }
      setModalOpen(false);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title={
          <div className="flex justify-between items-center">
            <Title level={4} className="!mb-0">
              Danh sách phim
            </Title>
            <Button type="primary" onClick={handleCreate}>
              + Thêm phim
            </Button>
          </div>
        }
        style={{ maxWidth: 1000, margin: "24px auto" }}
      >
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={movies}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          locale={{ emptyText: "Không có phim" }}
          renderItem={(movie) => (
            <List.Item>
              <Card
                bordered
                style={{ display: "flex", alignItems: "center", gap: 16 }}
                bodyStyle={{ display: "flex", padding: 12, width: "100%" }}
              >
                <img
                  src={movie.poster || "https://via.placeholder.com/100x140?text=No+Image"}
                  alt={movie.title}
                  style={{
                    width: 100,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Button
                      type="link"
                      style={{ padding: 0, fontSize: 16, fontWeight: 600 }}
                      onClick={() => navigate(`/admin/movies/${movie._id}`)}
                    >
                      {movie.title}
                    </Button>
                    <Tag color={statusMap[movie.status].color}>
                      {statusMap[movie.status].label}
                    </Tag>
                  </div>
                  <div>⏱ Thời lượng: {movie.duration} phút</div>
                  <div>🗣 Ngôn ngữ: {movie.language}</div>
                  <div>🎥 Đạo diễn: {movie.director}</div>
                  <div>👥 Diễn viên: {movie.actors?.join(", ")}</div>
                  <div>🔞 Độ tuổi: {movie.ageRating}</div>
                </div>
                <div>
                  <Space direction="vertical">
                    <Button size="small" onClick={() => handleEdit(movie)}>
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xoá phim này không?"
                      onConfirm={() => handleDelete(movie._id)}
                      okText="Xoá"
                      cancelText="Huỷ"
                    >
                      <Button size="small" danger>
                        Xoá
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />

        <MovieModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchMovies();
          }}
          onSubmit={handleSubmit}
          onSuccess={fetchMovies}
          initialValues={selectedMovie || undefined}
          isEditing={isEditing}
          loading={loading}
          form={form}
        />
      </Card>
    </>
  );
}
