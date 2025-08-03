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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { movieSchema } from "@/validations/movie.schema";
import { IMovie } from "@/types/movie";
import { getCategories } from "@/api/category.api";
import { getAllMovies } from "@/api/movie.api";
import { RcFile } from "antd/es/upload";

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
  const [posterUrl, setPosterUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch {
        message.error("Không thể tải danh mục.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        releaseDate: dayjs(initialValues.releaseDate),
        categories: initialValues.categories?.map((cat: any) =>
          typeof cat === "string" ? cat : cat._id
        ),
        actors: initialValues.actors?.join(", ") || "",
        poster: initialValues.poster || "",
        banner: Array.isArray(initialValues.banner)
          ? initialValues.banner[0]
          : initialValues.banner || "",
      });
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (open) {
      setPosterUrl(initialValues?.poster || "");
      setBannerUrl(
        Array.isArray(initialValues?.banner)
          ? initialValues?.banner[0]
          : initialValues?.banner || ""
      );
    }
  }, [open, initialValues]);

  const handleUpload = async (file: RcFile, type: "poster" | "banner") => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (type === "poster") {
          setPosterUrl(data.url);
          form.setFieldsValue({ poster: data.url });
        } else {
          setBannerUrl(data.url);
          form.setFieldsValue({ banner: data.url });
        }
        message.success("Tải ảnh lên thành công!");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch {
      message.error("Lỗi khi tải ảnh lên.");
    }

    return false;
  };

  const handleFinish = async (values: any) => {
    try {
      const formatted: any = {
        ...values,
        duration: Number(values.duration),
        releaseDate: values.releaseDate?.toISOString(),
        actors: values.actors
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean),
        categories:
          values.categories?.map((c: string) => c.trim()).filter(Boolean) || [],
        poster: posterUrl || values.poster || "",
        banner: bannerUrl || values.banner || "",

      };
      if (!isEditing) {
        const now = dayjs().startOf("day");
        if (dayjs(formatted.releaseDate).isBefore(now)) {
          return Modal.error({
            title: "Ngày phát hành không hợp lệ",
            content: "Ngày phát hành không được trước ngày hôm nay.",
          });
        }

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
      if (onSuccess) onSuccess();
      form.resetFields();
      onClose();
    } catch {
      Modal.error({
        title: "Lỗi xử lý form",
        content: "Đã xảy ra lỗi không mong muốn khi gửi dữ liệu.",
      });
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Chỉnh sửa phim" : "Thêm phim"}
      onCancel={() => {
        form.resetFields();
        setPosterUrl(initialValues?.poster || "");
        setBannerUrl(
          Array.isArray(initialValues?.banner)
            ? initialValues?.banner[0]
            : initialValues?.banner || ""
        );
        onClose();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEditing ? "Lưu" : "Thêm"}
      width={1000}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="releaseDate"
              label="Ngày khởi chiếu"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item name="director" label="Đạo diễn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="actors" label="Diễn viên (cách nhau bởi dấu phẩy)" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="categories" label="Danh mục" rules={[{ required: true }]}>
              <Select mode="multiple">
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="language" label="Quốc gia" rules={[{ required: true }]}>
              <Select>
                <Option value="Việt Nam">Việt Nam</Option>
                <Option value="Mỹ">Mỹ</Option>
                <Option value="Hàn Quốc">Hàn Quốc</Option>
              </Select>
            </Form.Item>

            <Form.Item name="ageRating" label="Độ tuổi" rules={[{ required: true }]}>
              <Select>
                <Option value="C13">C13</Option>
                <Option value="C16">C16</Option>
                <Option value="C18">C18</Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Option value="sap_chieu">Sắp chiếu</Option>
                <Option value="dang_chieu">Đang chiếu</Option>
                <Option value="ngung_chieu">Ngừng chiếu</Option>
              </Select>
            </Form.Item>

            <Form.Item name="trailer" label="Trailer (YouTube)">
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>

            {form.getFieldValue("trailer") &&
              getYouTubeEmbedUrl(form.getFieldValue("trailer")) && (
                <div style={{ marginBottom: 16 }}>
                  <Title level={5}>Xem trước Trailer</Title>
                  <iframe
                    width="100%"
                    height="250"
                    src={getYouTubeEmbedUrl(form.getFieldValue("trailer"))!}
                    title="Trailer"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )}

            <Form.Item name="poster" label="Poster" rules={[{ required: true }]}>
              <Upload
                beforeUpload={(file) => handleUpload(file, "poster")}
                showUploadList={false}
              >
                <UploadOutlined /> Tải ảnh poster
              </Upload>
              {posterUrl && (
                <img src={posterUrl} alt="Poster" style={{ width: "100%", marginTop: 8, borderRadius: 8 }} />
              )}
            </Form.Item>

            <Form.Item name="banner" label="Banner" rules={[{ required: true }]}>
              <Upload
                beforeUpload={(file) => handleUpload(file, "banner")}
                showUploadList={false}
              >
                <UploadOutlined /> Tải ảnh banner
              </Upload>
              {bannerUrl && (
                <img src={bannerUrl} alt="Banner" style={{ width: "100%", marginTop: 8, borderRadius: 8 }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
