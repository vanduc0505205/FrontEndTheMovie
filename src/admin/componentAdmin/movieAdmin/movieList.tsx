// pages/admin/MovieList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, List, Typography, Space, message } from "antd";
import MovieModal, { MovieFormData } from "./movieFormModal";

const { Title } = Typography;

interface Movie extends MovieFormData {
  _id: string;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/movie");
      setMovies(res.data.list);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phim");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const handleSubmit = async (data: MovieFormData) => {
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
    <Card
      title={
        <div className="flex justify-between items-center">
          <Title level={4} className="!mb-0">Danh sách phim</Title>
          <Button type="primary" onClick={handleCreate}>+ Thêm phim</Button>
        </div>
      }
      style={{ maxWidth: 1000, margin: "24px auto" }}
    >
      <List
        bordered
        itemLayout="horizontal"
        dataSource={movies}
        locale={{ emptyText: "Không có phim" }}
        renderItem={(movie) => (
          <List.Item
            actions={[
              <Button size="small" onClick={() => handleEdit(movie)}>Sửa</Button>,
              <Button size="small" danger onClick={() => handleDelete(movie._id)}>Xoá</Button>,
            ]}
          >
            <List.Item.Meta
              title={movie.title}
              description={`Thời lượng: ${movie.duration} phút | Trạng thái: ${movie.status}`}
            />
          </List.Item>
        )}
      />
      <MovieModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={selectedMovie || undefined}
        isEditing={isEditing}
        loading={loading}
      />
    </Card>
  );
}
