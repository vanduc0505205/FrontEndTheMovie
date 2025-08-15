import React from "react";
import { Form, Input, Button, message, notification } from "antd";
import { createCinema } from "@/api/cinema.api";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getUserRole } from "@/lib/auth";

const AddCinema = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const role = getUserRole();

  const { mutate, isPending } = useMutation({
    mutationFn: createCinema,
    onSuccess: () => {
      message.success("Thêm rạp thành công!");
      navigate("/admin/cinemas");
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        notification.error({
          message: "Thêm thất bại",
          description: "Bạn không có quyền cho hành động này!",
        });
      } else {
        message.error("Thêm rạp thất bại!");
      }
    },
  });

  const onFinish = (values: { name: string; address: string }) => {
    mutate(values);
  };


  if (role !== "admin") {
    notification.error({
      message: "Không có quyền",
      description: "Bạn không có quyền thêm rạp chiếu!",
      placement: "topRight",
    });
    return null;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm Rạp Chiếu</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Tên rạp"
          rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}
        >
          <Input placeholder="Nhập tên rạp" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Thêm rạp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCinema;
