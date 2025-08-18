import { useEffect, useState, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ICategory } from "@/interface/category";
import { IMovie } from "@/interface/movie";
import { createMovie, deleteMovie, getAllMovies, updateMovie } from "@/api/movie.api";
import { getCategories } from "@/api/category.api";

const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.role || null;
  } catch (err) {
    return null;
  }
};

const userRole = getUserRole();

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
        const res = await getAllMovies(params);
        setMovies(res.list);   // getAllMovies trả về res.data, trong đó có list
        setTotal(res.total);
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
      try {
        const res = await getCategories();
        setCategories(res); // API category trả về { list, total } giống movie
      } catch (err) {
        message.error("Không thể tải danh mục phim");
      }
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
      await deleteMovie(id);
      message.success("Xoá thành công");
      fetchMovies(
        currentPage,
        pageSize,
        searchTitle,
        selectedCategory,
        selectedStatus
      );
    } catch (error) {
      message.error("Xoá thất bại");
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Lấy URL banner đầu tiên nếu là mảng, nếu không lấy nguyên giá trị
      const bannerUrl = Array.isArray(data.banner)
        ? data.banner[0]
        : data.banner;

      // Format lại dữ liệu trước khi gửi
      const formattedData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        director: data.director?.trim(),
        language: data.language?.trim(),
        duration: Number(data.duration) || 0,
        releaseDate: data.releaseDate
          ? new Date(data.releaseDate).toISOString()
          : new Date().toISOString(),
        categories: Array.isArray(data.categories)
          ? data.categories.map((c: any) => c?.trim?.() || c).filter(Boolean)
          : data.categories
            ? [data.categories].filter(Boolean)
            : [],
        actors: (() => {
          if (Array.isArray(data.actors)) {
            return data.actors
              .map((a: any) => a?.trim?.() || a)
              .filter(Boolean);
          }
          if (typeof data.actors === "string") {
            return data.actors
              .split(",")
              .map((a: string) => a.trim())
              .filter(Boolean);
          }
          return [];
        })(),
        banner: bannerUrl, // Sử dụng banner dạng string
        poster: data.poster?.trim() || "",
        // Loại bỏ trường trailer vì server không chấp nhận
        status: data.status || "sap_chieu",
        ageRating: data.ageRating || "P",
      };


      // Kiểm tra dữ liệu bắt buộc
      if (
        !formattedData.title ||
        !formattedData.description ||
        !formattedData.director ||
        !formattedData.language ||
        !formattedData.poster ||
        !formattedData.banner
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      if (isEditing && selectedMovie) {
        await updateMovie(selectedMovie._id, formattedData);
        message.success("Cập nhật thành công");
      } else {
        await createMovie(formattedData);
        message.success("Thêm phim thành công");
      }

      setModalOpen(false);
      fetchMovies();
    } catch (error: any) {
      console.error("Error details:", error.response?.data || error.message);
      message.error(
        error.response?.data?.message ||
        `Không thể ${isEditing ? "cập nhật" : "thêm"} phim. Vui lòng thử lại.`
      );
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
        grid={{ gutter: 20, xs: 1, sm: 1, md: 2 }}
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
              hoverable
              styles={{
                body: {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  borderRadius: 16,
                  boxShadow: "0 2px 12px #f0f1f2",
                  transition: "box-shadow 0.2s",
                  minHeight: 200,
                  width: "1150px",
                  maxWidth: "100%",
                },
              }}
              bodyStyle={{
                display: "flex",
                padding: 24,
                width: "100%",
                background: "#f9fafb",
              }}
            >
              <img
                src={
                  movie.poster ||
                  "https://via.placeholder.com/100x160?text=No+Image"
                }
                alt={movie.title}
                style={{
                  width: 120,
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #eee",
                  boxShadow: "0 1px 4px #ddd",
                  marginRight: 24,
                  background: "#fff",
                }}
              />
              <div style={{ flex: 1, paddingLeft: 8 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#1677ff",
                      lineHeight: 1.2,
                      marginRight: 8,
                    }}
                  >
                    {movie.title}
                  </span>
                  {statusMap[movie.status] ? (
                    <Tag
                      color={statusMap[movie.status].color}
                      style={{ fontWeight: 500 }}
                    >
                      {statusMap[movie.status].label}
                    </Tag>
                  ) : (
                    <Tag color="default">Không xác định</Tag>
                  )}
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="duration">
                    ⏱
                  </span>{" "}
                  <b>Thời lượng:</b> {movie.duration} phút
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="date">
                    📅
                  </span>{" "}
                  <b>Ngày phát hành:</b>{" "}
                  {dayjs(movie.releaseDate).format("DD/MM/YYYY")}
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="language">
                    🗣
                  </span>{" "}
                  <b>Ngôn ngữ:</b> {movie.language}
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="director">
                    🎥
                  </span>{" "}
                  <b>Đạo diễn:</b> {movie.director}
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="actors">
                    👥
                  </span>{" "}
                  <b>Diễn viên:</b>{" "}
                  {movie.actors.length > 3
                    ? movie.actors.slice(0, 3).join(", ") + "..."
                    : movie.actors.join(", ")}
                </div>
                <div style={{ color: "#444", marginBottom: 4 }}>
                  <span role="img" aria-label="category">
                    📂
                  </span>{" "}
                  <b>Danh mục:</b>{" "}
                  {movie.categories?.map((cat) => (
                    <Tag key={cat._id} style={{ marginBottom: 2 }}>
                      {cat.categoryName}
                    </Tag>
                  ))}
                </div>
                <div style={{ color: "#444" }}>
                  <span role="img" aria-label="age">
                    🔞
                  </span>{" "}
                  <b>Độ tuổi:</b> {movie.ageRating}
                </div>
              </div>
              {userRole === "admin" && (
                <div>
                  <Space direction="vertical">
                    <Button size="small" onClick={() => navigate(`/admin/movies/${movie._id}`)}>
                      Chi tiết
                    </Button>
                    {userRole === "admin" && (
                      <>
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
                      </>
                    )}
                  </Space>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />

      <MovieModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMovie(null);
          setIsEditing(false);
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