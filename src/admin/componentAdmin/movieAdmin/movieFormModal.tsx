// components/MovieModal.tsx
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export interface MovieFormData {
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  director: string;
  actors: string[];
  language: string;
  ageRating: "C13" | "C16" | "C18";
  status: "sap_chieu" | "dang_chieu" | "ngung_chieu";
}

interface MovieModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MovieFormData) => void;
  initialValues?: Partial<MovieFormData>;
  isEditing: boolean;
  loading?: boolean;
}

export default function MovieModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEditing,
  loading,
}: MovieModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        actors: initialValues.actors?.join(", "),
        releaseDate: initialValues.releaseDate ? dayjs(initialValues.releaseDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const formatted: MovieFormData = {
      ...values,
      actors: values.actors.split(",").map((a: string) => a.trim()),
      releaseDate: values.releaseDate.toISOString(),
    };
    onSubmit(formatted);
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Chỉnh sửa phim" : "Thêm phim"}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEditing ? "Lưu" : "Thêm"}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="releaseDate" label="Ngày khởi chiếu" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="director" label="Đạo diễn">
          <Input />
        </Form.Item>
        <Form.Item name="language" label="Ngôn ngữ">
          <Input />
        </Form.Item>
        <Form.Item name="actors" label="Diễn viên (cách nhau bởi dấu phẩy)">
          <Input />
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
      </Form>
    </Modal>
  );
}
