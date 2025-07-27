import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  notification,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/api/room.api";
import { getSeatsByRoom } from "@/api/seat.api";
import { IRoom } from "@/types";

const RoomList = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [roomHasSeats, setRoomHasSeats] = useState(false);

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const { mutate: handleCreateOrUpdate, isPending } = useMutation({
    mutationFn: async (room: Partial<IRoom>) => {
      if (editingRoom) {
        return updateRoom(editingRoom._id, room);
      } else {
        return createRoom(room);
      }
    },
    onSuccess: () => {
      message.success(editingRoom ? "Đã cập nhật phòng" : "Đã tạo phòng");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      form.resetFields();
      setIsModalOpen(false);
      setEditingRoom(null);
    },
    onError: () => {
      notification.error({
        message: "Bạn không có quyền!",
        description: "Bạn không có quyền cho hành động này !",
        placement: "topRight",
      });
    },
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      message.success("Đã xoá phòng");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => {
      notification.error({
        message: "Bạn không thể xóa!",
        description: "Bạn không có quyền cho hành động này !",
        placement: "topRight",
      });
    },
  });

  const openModalToEdit = async (room: IRoom) => {
    setEditingRoom(room);
    form.setFieldsValue(room);
    setIsModalOpen(true);

    try {
      const seats = await getSeatsByRoom(room._id);
      setRoomHasSeats(seats.length > 0);
    } catch (err) {
      setRoomHasSeats(false);
    }
  };

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số hàng",
      dataIndex: "rows",
      key: "rows",
    },
    {
      title: "Số cột",
      dataIndex: "columns",
      key: "columns",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, room: IRoom) => (
        <div className="space-x-2">
          <Button size="small" onClick={() => openModalToEdit(room)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá phòng này?"
            onConfirm={() => handleDelete(room._id)}
          >
            <Button size="small" danger>
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onFinish = (values: any) => {
    handleCreateOrUpdate(values);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý phòng chiếu</h2>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setEditingRoom(null);
            setRoomHasSeats(false); // Reset lại
            setIsModalOpen(true);
          }}

        >
          Thêm phòng
        </Button>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={rooms}
        bordered
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingRoom ? "Cập nhật" : "Tạo"}
        confirmLoading={isPending}
        title={editingRoom ? "Cập nhật phòng" : "Tạo phòng mới"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="rows"
            label="Số hàng"
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber min={1} className="w-full" disabled={roomHasSeats} />
          </Form.Item>

          <Form.Item
            name="columns"
            label="Số cột"
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber min={1} className="w-full" disabled={roomHasSeats} />
          </Form.Item>
          {editingRoom && roomHasSeats && (
            <div className="text-yellow-600 mb-3">
              ⚠️ Phòng đã có ghế, không thể thay đổi số hàng và số cột.
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default RoomList;
