import { Modal, Form, Input, Upload, Button, message, Select } from "antd";
import { UploadFile, RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { createNews, updateNews } from "@/api/news.api";
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
    return false; // ngăn Upload tự upload
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
      const payload = { ...values, image: imageUrl };

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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingNews || { title: "", content: "", category: "other" }}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

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

        <Form.Item
          label="Ảnh minh họa"
          name="image"
          rules={[{ required: true, message: "Vui lòng tải ảnh!" }]}
        >
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
      </Form>
    </Modal>
  );
}
