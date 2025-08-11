import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  DatePicker,
  Switch,
  Select,
  Checkbox,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import { createDiscount, updateDiscount } from "@/api/discount.api";

const { RangePicker } = DatePicker;

const dayOptions = [
  { label: "Chủ nhật", value: 0 },
  { label: "Thứ 2", value: 1 },
  { label: "Thứ 3", value: 2 },
  { label: "Thứ 4", value: 3 },
  { label: "Thứ 5", value: 4 },
  { label: "Thứ 6", value: 5 },
  { label: "Thứ 7", value: 6 },
];

const DiscountFormModal = ({ open, onClose, onRefresh, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      const values = { ...initialValues };
      if (initialValues.startDate && initialValues.endDate) {
        values.dateRange = [
          dayjs(initialValues.startDate),
          dayjs(initialValues.endDate),
        ];
      }
      form.setFieldsValue(values);
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
  }, [initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const { dateRange, ...rest } = values;
      const payload = {
        ...rest,
        startDate: dateRange?.[0]?.toISOString() || null,
        endDate: dateRange?.[1]?.toISOString() || null,
      };

      if (initialValues) {
        await updateDiscount(initialValues._id, payload);
        message.success("Cập nhật mã giảm giá thành công");
      } else {
        await createDiscount(payload);
        message.success("Tạo mã giảm giá thành công");
      }

      form.resetFields();
      onClose();
      onRefresh();
    } catch (error) {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const numberFormatter = (value) =>
    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
  const numberParser = (value) =>
    value ? parseInt(value.replace(/,/g, ""), 10) || 0 : 0;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      title={initialValues ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá"}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      confirmLoading={loading}
      destroyOnClose
      width={800} // tăng chiều rộng modal để đủ 2 cột
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã giảm giá"
              rules={[{ required: true, message: "Vui lòng nhập mã" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại giảm"
              rules={[{ required: true, message: "Chọn loại giảm giá" }]}
            >
              <Select>
                <Select.Option value="percent">Theo phần trăm (%)</Select.Option>
                <Select.Option value="amount">Theo số tiền (₫)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Giá trị"
              name="value"
              rules={[
                { required: true, type: "number", min: 0, message: "Vui lòng nhập giá trị" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={form.getFieldValue("type") === "percent" ? 1 : 10000}
                formatter={numberFormatter}
                parser={numberParser}
              />
            </Form.Item>

            <Form.Item
              label="Số tiền tối đa được giảm (nếu là %)"
              name="maxDiscount"
              rules={[{ type: "number", min: 0, message: "Không được âm" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={10000}
                formatter={numberFormatter}
                parser={numberParser}
                onChange={(value) => {
                  form.setFieldsValue({ maxDiscount: value === null ? undefined : value });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="quantity"
              label="Số lượt sử dụng (để trống = không giới hạn)"
              rules={[{ type: "number", min: 1, message: "Số lượt phải >= 1" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="dateRange" label="Thời gian áp dụng">
              <RangePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item name="allowedDays" label="Chỉ áp dụng vào các ngày">
              <Checkbox.Group options={dayOptions} />
            </Form.Item>

            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DiscountFormModal;
