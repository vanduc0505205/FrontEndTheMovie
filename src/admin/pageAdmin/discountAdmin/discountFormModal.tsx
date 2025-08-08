import React from "react";
import { Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";

const { Option } = Select;

interface DiscountModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const thousandFormatter = (value?: string | number) =>
  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

const thousandParser = (value?: string) => {
  const n = value ? parseInt(value.replace(/,/g, ""), 10) : 0;
  return Math.max(0, n);
};

const DiscountModal: React.FC<DiscountModalProps> = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
        form.resetFields();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Thêm mã giảm giá"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã giảm giá"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại giảm giá"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại" }]}
        >
          <Select placeholder="Chọn loại">
            <Option value="percentage">Phần trăm</Option>
            <Option value="fixed">Giá cố định</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá trị"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={thousandFormatter}
            parser={thousandParser}
          />
        </Form.Item>

        <Form.Item
          label="Số tiền tối đa được giảm (nếu là %)"
          name="maxAmount"
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={thousandFormatter}
            parser={thousandParser}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Ngày hết hạn"
          name="expirationDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DiscountModal;
