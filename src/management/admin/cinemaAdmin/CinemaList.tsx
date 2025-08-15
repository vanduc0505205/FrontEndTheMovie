import React, { useState } from "react";
import { Table, Button, Popconfirm, notification } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteCinema, getCinemas } from "@/api/cinema.api";
import { ICinema } from "@/types/cinema";

const CinemaList = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cinemas", page],
    queryFn: () => getCinemas(page, limit),
  });

  const { mutate } = useMutation({
    mutationFn: deleteCinema,
    onSuccess: () => {
      notification.success({
        message: "Xoá thành công",
        description: "Rạp chiếu đã được xoá khỏi hệ thống.",
        placement: "topRight",
        duration: 3,
      });
      queryClient.invalidateQueries({ queryKey: ["cinemas", page] });
    },
    onError: () => {
      notification.error({
        message: "Xoá thất bại",
        description: "Bạn không có quyền cho hành động này!",
        placement: "topRight",
      });
    },
  });

  const columns = [
    { title: "Tên rạp", dataIndex: "name", width: "33%" },
    { title: "Địa chỉ", dataIndex: "address", width: "33%" },
    {
      title: "Hành động",
      width: "34%",
      render: (_: any, record: ICinema) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => navigate(`/admin/cinemas/edit/${record._id}`)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => mutate(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Button onClick={() => navigate(`/admin/cinemas/${record._id}`)}>Xem</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Danh sách rạp chiếu</h1>
      <Button type="primary" className="mb-4" onClick={() => navigate("/admin/cinemas/add")}>Thêm rạp</Button>
      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={data?.data || []}
        columns={columns}
        tableLayout="fixed"
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.pagination?.total || 0,
          onChange: (newPage) => setPage(newPage),
        }}
      />
    </div>
  );
};

export default CinemaList;
