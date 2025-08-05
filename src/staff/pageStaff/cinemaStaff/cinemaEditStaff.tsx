import React, { useEffect } from "react";
import { Form, Input, Button, message, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCinemaById, updateCinema } from "@/api/cinema.api";
import { Cinema } from "@/interface/cinema";

const EditCinemaStaff = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: cinema, isLoading } = useQuery({
    queryKey: ["cinema", id],
    queryFn: () => getCinemaById(id!),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: Partial<Cinema>) => updateCinema(id!, values),
    onSuccess: () => {
      message.success("Cập nhật thành công!");
      navigate("/staff/cinemas");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Cập nhật thất bại!";
      message.error(errorMsg);
    },
  });

  useEffect(() => {
    if (cinema) {
      form.setFieldsValue({
        name: cinema.name,
        address: cinema.address,
      });
    }
  }, [cinema, form]);

  const onFinish = (values: Partial<Cinema>) => {
    mutate(values);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sửa Rạp Chiếu</h1>
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
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCinemaStaff;
