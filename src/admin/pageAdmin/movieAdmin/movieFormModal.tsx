import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  message,
} from "antd"; import dayjs from "dayjs";
import { movieSchema } from "@/validations/movie.schema";
import { IMovie } from "@/types/movie";
import { getCategories } from "@/services/category.service";
import { getAllMovies } from "@/services/movie.service";


const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface MovieModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IMovie) => void;
  onSuccess?: () => void;
  initialValues?: Partial<IMovie>;
  isEditing: boolean;
  loading?: boolean;
  form: any;
}

export default function MovieModal({
  open,
  onClose,
  onSubmit,
  onSuccess,
  initialValues,
  isEditing,
  loading,
  form,
}: MovieModalProps) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        // console.log(res);
        setCategories(res);
      } catch (err) {
        message.error("Không thể tải danh mục.");
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        releaseDate: initialValues.releaseDate
          ? dayjs(initialValues.releaseDate)
          : undefined,
        actors: initialValues.actors?.join(", ") || "",
        banner: initialValues.banner?.join(", ") || "",
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values: any) => {
    try {
      const formatted = {
        ...values,
        duration: Number(values.duration),
        releaseDate: values.releaseDate?.toISOString(),
        actors: values.actors
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean),
        banner: values.banner
          ?.split(",")
          .map((b: string) => b.trim())
          .filter(Boolean),
          categories: values.categories?.map((c: string) => c.trim()).filter(Boolean) || [],
      };

       const now = dayjs().startOf("day");
      if (dayjs(formatted.releaseDate).isBefore(now)) {
        return Modal.error({
          title: "Ngày phát hành không hợp lệ",
          content: "Ngày phát hành không được trước ngày hôm nay.",
        });
      }

      if (!isEditing) {
        const exists = await getAllMovies();
        if (exists.some((movie) => movie.title === formatted.title)) {
          return Modal.error({
            title: "Tên phim bị trùng",
            content: "Phim này đã tồn tại.",
          });
        }
      }
      
      const result = movieSchema.safeParse(formatted);
      if (!result.success) {
        const errors = result.error.errors.map((e) => e.message).join("\n");
         return Modal.error({ title: "Lỗi xác thực", content: errors });
      }

       onSubmit(result.data as unknown as IMovie);
      console.log("Submit data:", formatted);
      if (onSuccess) onSuccess();
      form.resetFields();
      onClose();
    } catch (err) {
      Modal.error({
        title: "Lỗi xử lý form",
        content: "Đã xảy ra lỗi không mong muốn khi gửi dữ liệu.",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const trailerUrl = form.getFieldValue("trailer");
  const posterUrl = form.getFieldValue("poster");
  const bannerUrls = form.getFieldValue("banner");

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Chỉnh sửa phim" : "Thêm phim"}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEditing ? "Lưu" : "Thêm"}
      width={1000}
      style={{ top: 10 }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input placeholder="Ví dụ: Avengers: Endgame" />
            </Form.Item>
            
            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
            >
              <Input type="number" placeholder="120" />
            </Form.Item>

            <Form.Item
              name="releaseDate"
              label="Ngày khởi chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày phát hành" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="director"
              label="Đạo diễn"
              rules={[{ required: true, message: "Vui lòng nhập tên đạo diễn" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="actors"
              label="Diễn viên (phân cách bằng dấu phẩy)"
              rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 diễn viên" }]}
            >
              <Input placeholder="Chris Evans, Robert Downey Jr." />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <TextArea rows={2} placeholder="Tóm tắt nội dung phim..." />
            </Form.Item>
            <Form.Item
               name="categories"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 danh mục" }]}
            >
              <Select mode="multiple" placeholder="Chọn danh mục">
                {(Array.isArray(categories) ? categories : []).map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="language"
               label="Quốc gia"
              rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
            >
              <Select placeholder="Chọn quốc gia">
                <Option value="Việt Nam">Việt Nam</Option>
                <Option value="Mỹ">Mỹ</Option>
                <Option value="Anh">Anh</Option>
                <Option value="Hàn Quốc">Hàn Quốc</Option>
                <Option value="Nhật Bản">Nhật Bản</Option>
                <Option value="Trung Quốc">Trung Quốc</Option>
                <Option value="Pháp">Pháp</Option>
                <Option value="Đức">Đức</Option>
                <Option value="Tây Ban Nha">Tây Ban Nha</Option>
                <Option value="Ý">Ý</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="ageRating"
              label="Độ tuổi"
              rules={[{ required: true, message: "Vui lòng chọn độ tuổi" }]}
            >
              <Select placeholder="Chọn độ tuổi">
                <Option value="C13">C13</Option>
                <Option value="C16">C16</Option>
                <Option value="C18">C18</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="sap_chieu">Sắp chiếu</Option>
                <Option value="dang_chieu">Đang chiếu</Option>
                <Option value="ngung_chieu">Ngừng chiếu</Option>
              </Select>
            </Form.Item>

            {isEditing && (
              <>
                <Form.Item name="taoLuc" label="Ngày tạo">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="capNhatLuc" label="Ngày cập nhật">
                  <Input disabled />
                </Form.Item>
              </>
            )}

            <Form.Item name="trailer" label="Link trailer">
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>

            {trailerUrl && getYouTubeEmbedUrl(trailerUrl) && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Xem trước Trailer</Title>
                <iframe
                  width="100%"
                  height="250"
                  src={getYouTubeEmbedUrl(trailerUrl) as string}
                  title="Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <Form.Item name="poster" label="Link poster">
              <Input placeholder="https://example.com/poster.jpg" />
            </Form.Item>

            {posterUrl && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Xem trước Poster</Title>
                <img
                  src={posterUrl}
                  alt="Poster"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </div>
            )}

            <Form.Item
              name="banner"
              label="Link banner (phân cách bằng dấu phẩy)"
            >
              <Input placeholder="https://img1.jpg, https://img2.jpg" />
            </Form.Item>

            {bannerUrls && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Xem trước Banner</Title>
                <Row gutter={[8, 8]}>
                  {bannerUrls
                    .split(",")
                    .map((url: string, index: number) => {
                      const trimmed = url.trim();
                      if (!trimmed) return null;
                      return (
                        <Col span={12} key={index}>
                          <img
                            src={trimmed}
                            alt={`Banner ${index + 1}`}
                            style={{ width: "100%", borderRadius: 8 }}
                          />
                        </Col>
                      );
                    })}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
