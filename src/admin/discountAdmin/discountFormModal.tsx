import { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  DatePicker,
  Switch,
  Checkbox,
  Select,
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

const MAX_DISCOUNT_VALUE = 1_000_000;
const MIN_DISCOUNT_VALUE = 1_000;
const DISCOUNT_STEP = 1_000;

const DiscountFormModal = ({ open, onClose, onRefresh, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (initialValues) {
      const data = {
        ...initialValues,
        dateRange:
          initialValues.startDate && initialValues.endDate
            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
            : [],
      };
      setOriginalData(data);
      form.setFieldsValue(data);
    } else {
      setOriginalData(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true, allowedDays: [], visibility: 'public' });
    }
  }, [initialValues, form]);

  const handleCancel = () => {
    if (originalData) {
      form.setFieldsValue(originalData);
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true, allowedDays: [], visibility: 'public' });
    }
    onClose();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const { dateRange, ...rest } = values;

      const payload = {
        ...rest,
        value: Number(rest.value),
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString(),
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

  const valueWarnRef = useRef({ tooHigh: false, tooLow: false });

  const handleValueChange = (val: number | null) => {
    if (val == null) return;
    if (val > MAX_DISCOUNT_VALUE) {
      if (!valueWarnRef.current.tooHigh) {
        message.warning(`Vượt quá tối đa ${MAX_DISCOUNT_VALUE.toLocaleString()}₫`);
        valueWarnRef.current.tooHigh = true;
      }
      return;
    } else {
      valueWarnRef.current.tooHigh = false;
    }

    if (val < MIN_DISCOUNT_VALUE) {
      if (!valueWarnRef.current.tooLow) {
        message.warning(`Thấp hơn tối thiểu ${MIN_DISCOUNT_VALUE.toLocaleString()}₫`);
        valueWarnRef.current.tooLow = true;
      }
      return;
    } else {
      valueWarnRef.current.tooLow = false;
    }
  };

  const handleValueBlur = () => {
    const raw = form.getFieldValue('value');
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    if (num > MAX_DISCOUNT_VALUE) {
      form.setFieldsValue({ value: MAX_DISCOUNT_VALUE });
      message.info(`Đã tự động đặt về tối đa ${MAX_DISCOUNT_VALUE.toLocaleString()}₫`);
      return;
    }
    if (num < MIN_DISCOUNT_VALUE) {
      form.setFieldsValue({ value: MIN_DISCOUNT_VALUE });
      message.info(`Đã tự động đặt về tối thiểu ${MIN_DISCOUNT_VALUE.toLocaleString()}₫`);
      return;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      title={initialValues ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá"}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      confirmLoading={loading}
      destroyOnClose={false}
      width={800}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã giảm giá"
              normalize={(v) => (typeof v === 'string' ? v.toUpperCase().trim() : v)}
              rules={[
                { required: true, message: "Vui lòng nhập mã" },
                {
                  pattern: /^[A-Z0-9_-]{3,20}$/,
                  message: "Mã 3-20 ký tự, chỉ gồm A-Z, 0-9, gạch dưới hoặc gạch ngang",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số tiền giảm (₫)"
              name="value"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  type: "number",
                  min: MIN_DISCOUNT_VALUE,
                  max: MAX_DISCOUNT_VALUE,
                  message: `Giá trị phải từ ${MIN_DISCOUNT_VALUE.toLocaleString()} đến ${MAX_DISCOUNT_VALUE.toLocaleString()}₫`,
                },
                {
                  validator: (_, val) => {
                    if (val == null || val === '') return Promise.resolve();
                    const num = Number(val);
                    if (Number.isNaN(num)) return Promise.reject("Giá trị không hợp lệ");
                    if (num % DISCOUNT_STEP !== 0) {
                      return Promise.reject(`Giá trị phải là bội số của ${DISCOUNT_STEP.toLocaleString()}₫`);
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                step={DISCOUNT_STEP}
                precision={0}
                formatter={numberFormatter}
                parser={numberParser}
                onChange={handleValueChange}
                onBlur={handleValueBlur}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượt sử dụng"
              tooltip="Để trống = không giới hạn"
              rules={[{ type: "number", min: 1, message: "Số lượt phải >= 1" }]}
            >
              <InputNumber min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Thời gian áp dụng"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian áp dụng" },
                {
                  validator: (_, value) => {
                    const [start, end] = value || [];
                    if (!start || !end) return Promise.resolve();
                    if (dayjs(end).isBefore(dayjs(start))) {
                      return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
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

            <Form.Item name="visibility" label="Phạm vi" initialValue={'public'}>
              <Select
                options={[
                  { label: 'Công khai (Public) - hiện cho người dùng chọn', value: 'public' },
                  { label: 'Riêng tư (Private) - không hiển thị, chỉ nhập tay', value: 'private' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DiscountFormModal;