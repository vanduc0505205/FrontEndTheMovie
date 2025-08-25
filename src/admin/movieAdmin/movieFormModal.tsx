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
import dayjs from "dayjs";
import { movieSchema } from "@/validations/movie.schema";

import { getCategories } from "@/api/category.api";
import { getAllMoviesSimple } from "@/api/movie.api";
import { RcFile, UploadFile } from "antd/es/upload";
import ImgCrop from "antd-img-crop";
import { IMovie } from "@/interface/movie";
import { uploadImage } from "@/api/upload.api";

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
  const [posterFileList, setPosterFileList] = useState<UploadFile[]>([]);
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [posterUrl, setPosterUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

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

      if (initialValues.poster) {
        setPosterFileList([
          {
            uid: "-1",
            name: "poster.png",
            status: "done",
            url: initialValues.poster,
          },
        ]);
        setPosterUrl(initialValues.poster);
      }

      if (initialValues.banner) {
        const banner = Array.isArray(initialValues.banner)
          ? initialValues.banner[0]
          : initialValues.banner;
        setBannerFileList([
          {
            uid: "-2",
            name: "banner.png",
            status: "done",
            url: banner,
          },
        ]);
        setBannerUrl(banner);
      }
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (!open) {
      setPosterFileList([]);
      setBannerFileList([]);
      setPosterUrl("");
      setBannerUrl("");
    }
  }, [open]);

  const handleUpload = async (file: RcFile, type: "poster" | "banner") => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const url = await uploadImage(file); // ✅ gọi API gián tiếp
      if (type === "poster") {
        setPosterUrl(url);
        setPosterFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url,
          },
        ]);
        form.setFieldsValue({ poster: url });
      } else {
        setBannerUrl(url);
        setBannerFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url,
          },
        ]);
        form.setFieldsValue({ banner: url });
      }
      message.success("Tải ảnh lên thành công!");
    } catch {
      message.error("Lỗi khi tải ảnh lên.");
    }
    return false;

  };

  // Preview ảnh khi click
  const handlePreview = async (file: UploadFile) => {
    let src = file.url || file.preview;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src as string;
    const imgWindow = window.open(src);
    if (imgWindow) imgWindow.document.write(image.outerHTML);
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

        const exists = await getAllMoviesSimple();
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

      onSubmit(result.data as IMovie);
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
            <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}>
              <Input />
            </Form.Item>

            <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item name="releaseDate" label="Ngày khởi chiếu" rules={[{ required: true, message: "Vui lòng lựa chọn ngày khởi chiếu" }]}>
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item name="director" label="Đạo diễn" rules={[{ required: true, message: "Vui lòng nhập đạo diễn" }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="actors"
              label="Diễn viên (cách nhau bởi dấu phẩy)"
              rules={[{ required: true, message: "Vui lòng nhập các diễn viên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="categories" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
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
            <Form.Item name="language" label="Quốc gia" rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}>
              <Select>
                <Option value="Thái Lan">Thái Lan</Option>
                <Option value="Nhật Bản">Nhật Bản</Option>
                <Option value="Việt Nam">Việt Nam</Option>
                <Option value="Mỹ">Mỹ</Option>
                <Option value="Hàn Quốc">Hàn Quốc</Option>

              </Select>
            </Form.Item>

            <Form.Item name="ageRating" label="Độ tuổi" rules={[{ required: true, message: "Vui lòng chọn độ tuổi" }]}>
              <Select>
                <Option value="C13">C13</Option>
                <Option value="C16">C16</Option>
                <Option value="C18">C18</Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
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

            <Form.Item name="poster" label="Poster" rules={[{ required: true, message: "Vui lòng tải lên poster" }]}>
              <ImgCrop
                rotate
                aspect={2 / 3}
                modalTitle="Cắt ảnh Poster (tỉ lệ 2:3)"
                quality={1}
              >
                <Upload
                  listType="picture-card"
                  fileList={posterFileList}
                  onChange={({ fileList }) => setPosterFileList(fileList)}
                  onRemove={() => {
                    setPosterFileList([]);
                    setPosterUrl("");
                    form.setFieldsValue({ poster: "" });
                  }}
                  beforeUpload={(file) => handleUpload(file, "poster")}
                  maxCount={1}
                  onPreview={handlePreview}
                >
                  {posterFileList.length >= 1 ? null : "+ Upload"}
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item name="banner" label="Banner" rules={[{ required: true, message: "Vui lòng tải lên banner" }]}>
              <ImgCrop
                rotate
                aspect={16 / 9}
                modalTitle="Cắt ảnh Banner (tỉ lệ 16:9)"
                quality={1}
              >
                <Upload
                  listType="picture-card"
                  fileList={bannerFileList}
                  onChange={({ fileList }) => setBannerFileList(fileList)}
                  onRemove={() => {
                    setBannerFileList([]);
                    setBannerUrl("");
                    form.setFieldsValue({ banner: "" });
                  }}
                  beforeUpload={(file) => handleUpload(file, "banner")}
                  maxCount={1}
                  onPreview={handlePreview}
                >
                  {bannerFileList.length >= 1 ? null : "+ Upload"}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
