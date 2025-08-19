import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getShowtimes, deleteShowtime } from "@/api/showtime.api";
import ShowtimeFormModal from "./ShowtimeFormModal";
import { IShowtime } from "@/interface/showtime";

const ShowtimeList = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery<IShowtime[]>({
    queryKey: ["showtimes"],
    queryFn: getShowtimes,
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<IShowtime | null>(null);

  const mutationDelete = useMutation({
    mutationFn: (id: string) => deleteShowtime(id),
    onSuccess: () => {
      message.success("🗑️ Đã xoá suất chiếu");
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
    onError: () => {
      message.error("❌ Xoá thất bại");
    },
  });

  const handleAdd = () => {
    setSelectedShowtime(null); // clear form
    setModalOpen(true);
  };

  const handleEdit = (record: IShowtime) => {
    setSelectedShowtime(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    mutationDelete.mutate(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedShowtime(null);
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: ["movieId", "title"],
      key: "movie",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Rạp",
      dataIndex: ["cinemaId", "name"],
      key: "cinema",
    },
    {
      title: "Phòng",
      dataIndex: ["roomId", "name"],
      key: "room",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, record: IShowtime) => (
        <div className="flex flex-col">
          <span>⏰ Bắt đầu: {new Date(record.startTime).toLocaleString()}</span>
          <span>🎬 Kết thúc: {new Date(record.endTime).toLocaleString()}</span>
        </div>
      ),
    },
    {
      title: "Giá vé",
      dataIndex: "defaultPrice",
      key: "price",
      render: (value: number) => <Tag color="blue">{value.toLocaleString()} VND</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IShowtime) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn xoá suất chiếu này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách suất chiếu</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={data}
        bordered
      />

      <ShowtimeFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedShowtime}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};

export default ShowtimeList;
