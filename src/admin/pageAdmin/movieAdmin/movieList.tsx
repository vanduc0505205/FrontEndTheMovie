import React, { useEffect, useState, useCallback } from "react";
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
  Input,
  Select,
} from "antd";
import MovieModal from "./movieFormModal";
import { IMovie } from "@/types/movie";
import { ICategory } from "@/types/category";
import { useNavigate } from "react-router-dom";
import { Import } from "lucide-react";
import dayjs from "dayjs";

const { Title } = Typography;

const statusMap: Record<IMovie["status"], { label: string; color: string }> = {
  sap_chieu: { label: "Sắp chiếu", color: "blue" },
  dang_chieu: { label: "Đang chiếu", color: "green" },
  ngung_chieu: { label: "Ngừng chiếu", color: "red" },
};

export default function MovieList() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const fetchMovies = useCallback(
    async (
      page = currentPage,
      limit = pageSize,
      title = searchTitle,
      category = selectedCategory,
      status = selectedStatus
    ) => {
      const params: any = { page, limit };
      if (title) params.title = title;
      if (category) params.category = category;
      if (status) params.status = status;
      try {
        const res = await axios.get("http://localhost:3000/movie", {
          params,
        });
        setMovies(res.data.list);
        setTotal(res.data.total);
      } catch (err) {
        message.error("Không thể tải danh sách phim");
      }
    },
    [currentPage, pageSize, searchTitle, selectedCategory, selectedStatus]
  );

  useEffect(() => {
    fetchMovies(
      currentPage,
      pageSize,
      searchTitle,
      selectedCategory,
      selectedStatus
    );
  }, [currentPage, pageSize, searchTitle, selectedCategory, selectedStatus]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:3000/category");
      console.log("Categories fetched:", res.data.list);
      setCategories(res.data.list);
    };
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setSelectedMovie(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (movie: IMovie) => {
    setSelectedMovie(movie);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/movie/${id}`);
      message.success("Xoá thành công");
      fetchMovies(
        currentPage,
        pageSize,
        searchTitle,
        selectedCategory,
        selectedStatus
      );
    } catch (error) {
      console.error("Lỗi xoá:", error);
      message.error("Xoá thất bại");
    }
  };

  const handleSubmit = async (data: IMovie) => {
    setLoading(true);
    try {
      if (isEditing && selectedMovie) {
        await axios.put(
          `http://localhost:3000/movie/${selectedMovie._id}`,
          data
        );
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
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <Title level={4} className="!mb-0">
            Danh sách phim
          </Title>
          <Space wrap>
            <Input.Search
              placeholder="Tìm theo tên phim"
              allowClear
              onSearch={(value) => {
                setSearchTitle(value);
                setCurrentPage(1);
                fetchMovies(
                  1,
                  pageSize,
                  value,
                  selectedCategory,
                  selectedStatus
                );
              }}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Lọc theo danh mục"
              allowClear
              options={categories.map((cat) => ({
                label: cat.categoryName,
                value: cat._id,
              }))}
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
                fetchMovies(1, pageSize, searchTitle, value, selectedStatus);
              }}
              onClear={() => {
                setSelectedCategory(undefined);
                setCurrentPage(1);
                fetchMovies(
                  1,
                  pageSize,
                  searchTitle,
                  undefined,
                  selectedStatus
                );
              }}
              style={{ width: 160 }}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              options={Object.entries(statusMap).map(([key, val]) => ({
                label: val.label,
                value: key,
              }))}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
                fetchMovies(1, pageSize, searchTitle, selectedCategory, value);
              }}
              onClear={() => {
                setSelectedStatus(undefined);
                setCurrentPage(1);
                fetchMovies(
                  1,
                  pageSize,
                  searchTitle,
                  selectedCategory,
                  undefined
                );
              }}
              style={{ width: 160 }}
            />
            <Button type="primary" onClick={handleCreate}>
              + Thêm phim
            </Button>
          </Space>
        </div>
      }
      style={{ maxWidth: 1200, margin: "24px auto" }}
    >
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2 }}
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
              // bordered
              style={{ display: "flex", alignItems: "center", gap: 16 }}
              bodyStyle={{ display: "flex", padding: 12, width: 1150 }}
            >
              <img
                src={
                  movie.poster ||
                  "https://via.placeholder.com/100x140?text=No+Image"
                }
                alt={movie.title}
                style={{
                  width: 120,
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
                  {statusMap[movie.status] ? (
                    <Tag color={statusMap[movie.status].color}>
                      {statusMap[movie.status].label}
                    </Tag>
                  ) : (
                    <Tag color="default">Không xác định</Tag>
                  )}
                </div>
                <div>⏱ Thời lượng: {movie.duration} phút</div>
                <div>
                  📅 Ngày phát hành:{" "}
                  {dayjs(movie.releaseDate).format("DD/MM/YYYY")}
                </div>
                <div>🗣 Ngôn ngữ: {movie.language}</div>
                <div>🎥 Đạo diễn: {movie.director}</div>
                <div>
                  👥 Diễn viên:{" "}
                  {movie.actors.length > 3
                    ? movie.actors.slice(0, 3).join(", ") + "..."
                    : movie.actors.join(", ")}
                </div>
                <div>
                  📂 Danh mục:{" "}
                  {movie.categories?.map((cat) => (
                    <Tag key={cat._id}>{cat.categoryName}</Tag>
                  ))}
                </div>
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
        }}
        onSubmit={handleSubmit}
        onSuccess={() => {
          fetchMovies(
            currentPage,
            pageSize,
            searchTitle,
            selectedCategory,
            selectedStatus
          );
        }}
        initialValues={selectedMovie || undefined}
        isEditing={isEditing}
        loading={loading}
        form={form}
      />
    </Card>
  );
}
