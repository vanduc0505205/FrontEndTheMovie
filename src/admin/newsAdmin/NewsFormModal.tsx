import { Modal, Form, Input, Upload, Button, message, Select, Switch, DatePicker, Tabs, Row, Col } from "antd";
import { UploadFile, RcFile } from "antd/es/upload";
import { createNews, updateNews } from "@/api/news.api";
import { searchMovies } from "@/api/movie.api";
import { INews } from "@/interface/news";
import { useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import { uploadImage } from "@/api/upload.api";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingNews: INews | null;
}

export default function NewsFormModal({ open, onCancel, onSuccess, editingNews }: Props) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [movieOptions, setMovieOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (editingNews) {
      form.setFieldsValue(editingNews);
      if (editingNews.image) {
        setFileList([
          {
            uid: "-1",
            name: "news.png",
            status: "done",
            url: editingNews.image,
          },
        ]);
        setImageUrl(editingNews.image);
      }
    } else {
      form.resetFields();
      setFileList([]);
      setImageUrl("");
    }
  }, [editingNews, form, open]);

  const handleUpload = async (file: RcFile) => {
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url,
        },
      ]);
      form.setFieldsValue({ image: url });
      message.success("Tải ảnh lên thành công!");
    } catch {
      message.error("Lỗi khi tải ảnh.");
    }
    return false;
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url || file.preview;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const imgWindow = window.open(src as string);
    if (imgWindow) {
      imgWindow.document.write(`<img src="${src}" style="max-width:100%"/>`);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const cleanRelated = Array.isArray((values as any).relatedMovies)
        ? (values as any).relatedMovies.filter((v: any) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v))
        : undefined;

      const payload = {
        ...values,
        image: imageUrl,
        scheduleAt: values.scheduleAt ? (values.scheduleAt as any).toISOString?.() || values.scheduleAt : null,
        relatedMovies: cleanRelated,
      } as Partial<INews>;

      if (editingNews) {
        await updateNews(editingNews._id!, payload);
        message.success("Cập nhật tin tức thành công!");
      } else {
        await createNews(payload);
        message.success("Thêm tin tức thành công!");
      }
      onCancel();
      onSuccess();
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  return (
    <Modal
      title={editingNews ? "Chỉnh sửa tin tức" : "Thêm tin tức"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
      width={1000}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingNews || { title: "", content: "", category: "other", status: "draft", isFeatured: false, isPinned: false }}
      >
        <Tabs
          defaultActiveKey="content"
          items={[
            {
              key: 'content',
              label: 'Nội dung',
              children: (
                <>
                  <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Danh mục" name="category">
                        <Select
                          options={[
                            { label: "Phim", value: "movie" },
                            { label: "Khuyến mãi", value: "promotion" },
                            { label: "Sự kiện", value: "event" },
                            { label: "Khác", value: "other" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tags" name="tags">
                        <Select mode="tags" tokenSeparators={[',']} placeholder="Nhập tags và nhấn Enter" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Tóm tắt" name="excerpt">
                    <Input.TextArea rows={3} maxLength={300} showCount placeholder="Tóm tắt ngắn (<= 300 ký tự)" />
                  </Form.Item>
                  <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}>
                    <Input.TextArea rows={6} />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Ảnh minh họa" name="image" rules={[{ required: true, message: "Vui lòng tải ảnh!" }]}>
                        <ImgCrop aspect={16 / 9} modalTitle="Cắt ảnh (16:9)" quality={1}>
                          <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onRemove={() => {
                              setFileList([]);
                              setImageUrl("");
                              form.setFieldsValue({ image: "" });
                            }}
                            beforeUpload={(file) => handleUpload(file)}
                            maxCount={1}
                            onPreview={handlePreview}
                          >
                            {fileList.length >= 1 ? null : "+ Upload"}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Alt ảnh" name="coverAlt">
                        <Input placeholder="Mô tả ảnh (SEO/Accessibility)" />
                      </Form.Item>
                      <Form.Item label="Chú thích ảnh" name="imageCaption">
                        <Input placeholder="Chú thích hiển thị dưới ảnh (tuỳ chọn)" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )
            },
            {
              key: 'display',
              label: 'Hiển thị',
              children: (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Bài ghim (Pinned)" name="isPinned" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Bài nổi bật (Featured)" name="isFeatured" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Trạng thái" name="status">
                        <Select options={[{ label: 'Nháp', value: 'draft' }, { label: 'Xuất bản', value: 'published' }]} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Lịch đăng (scheduleAt)" name="scheduleAt">
                        <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn ngày giờ đăng (tuỳ chọn)" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Nguồn (URL)" name="sourceUrl">
                        <Input type="url" placeholder="https://..." />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Phim liên quan" name="relatedMovies">
                        <Select
                          mode="multiple"
                          showSearch
                          placeholder="Tìm phim để liên kết"
                          filterOption={false}
                          allowClear
                          onInputKeyDown={(e) => { if ((e as any).key === 'Enter') { e.preventDefault(); } }}
                          onSearch={async (val) => {
                            try {
                              const list = await searchMovies(val);
                              setMovieOptions(list.map((m: any) => ({ label: m.title || m.name || m.movieName || m._id, value: m._id })));
                            } catch {
                              setMovieOptions([]);
                            }
                          }}
                          options={movieOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )
            },
            {
              key: 'seo',
              label: 'SEO',
              children: (
                <>
                  <Form.Item label="SEO Title" name="metaTitle">
                    <Input />
                  </Form.Item>
                  <Form.Item label="SEO Description" name="metaDescription">
                    <Input.TextArea rows={2} maxLength={160} showCount />
                  </Form.Item>
                  <Form.Item label="SEO Keywords" name="metaKeywords">
                    <Input placeholder="tách bằng dấu phẩy" />
                  </Form.Item>
                </>
              )
            }
          ]}
        />
      </Form>
    </Modal>
  );
}
