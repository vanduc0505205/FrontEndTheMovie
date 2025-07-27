import React from "react";
import { Form, Input, Button, message } from "antd";
import { createCinema } from "@/api/cinema.api";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const AddCinema = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createCinema,
    onSuccess: () => {
      message.success("Thêm rạp thành công!");
      navigate("/admin/cinemas");
    },
    onError: () => {
      message.error("Thêm rạp thất bại!");
    },
  });

  const onFinish = (values: { name: string; address: string }) => {
    mutate(values);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm Rạp Chiếu</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Tên rạp" rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}>
          <Input placeholder="Nhập tên rạp" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" color="green" htmlType="submit" loading={isPending}>
            Thêm rạp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCinema;
