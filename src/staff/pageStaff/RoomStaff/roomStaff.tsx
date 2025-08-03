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
import { IRoom } from "@/types/room";
import { getUserFromLocalStorage } from "@/lib/auth";
const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.role || null;
  } catch (err) {
    return null;
  }
};

const userRole = getUserRole();


const RoomList = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [roomHasSeats, setRoomHasSeats] = useState(false);
  const user = getUserFromLocalStorage(); // Lấy user từ localStorage

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
        description: "Bạn không có quyền cho hành động này!",
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
        description: "Bạn không có quyền cho hành động này!",
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
      render: (_, room: IRoom) => {

        return (
          <div className="space-x-2">
            <Button size="small" onClick={() => openModalToEdit(room)}>
              Sửa
            </Button>
            <Popconfirm
              title="Xác nhận xoá phòng này?"
              onConfirm={() => handleDelete(room._id)}
            >
              {userRole === "admin" && (
                <Button size="small" danger>
                  Xoá
                </Button>
              )}
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    handleCreateOrUpdate(values);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý phòng chiếu</h2>

        {user?.role === "admin" && ( // 👈 Ẩn nút "Thêm phòng" nếu không phải admin
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setEditingRoom(null);
              setRoomHasSeats(false);
              setIsModalOpen(true);
            }}
          >
            Thêm phòng
          </Button>
        )}
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
            rules={[
              { required: true, whitespace: true, message: "Không được để trống" },
              {
                validator: (_, value) => {
                  if (!value || !value.trim()) return Promise.resolve();
                  const inputName = value.trim().toLowerCase();

                  const isDuplicate = rooms.some(
                    (room) =>
                      room.name.trim().toLowerCase() === inputName &&
                      room._id !== editingRoom?._id
                  );

                  return isDuplicate
                    ? Promise.reject("Tên phòng đã tồn tại")
                    : Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="rows"
            label="Số hàng"
            rules={[
              { required: true, message: "Vui lòng nhập số hàng" },
              {
                validator(_, value) {
                  if (typeof value !== "number" || !Number.isInteger(value)) {
                    return Promise.reject("Số hàng phải là số nguyên");
                  }
                  if (value < 1 || value > 10) {
                    return Promise.reject("Số hàng phải từ 1 đến 20");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={10}
              className="w-full"
              disabled={roomHasSeats}
              step={1}
            />
          </Form.Item>

          <Form.Item
            name="columns"
            label="Số cột"
            rules={[
              { required: true, message: "Vui lòng nhập số cột" },
              {
                validator(_, value) {
                  if (typeof value !== "number" || !Number.isInteger(value)) {
                    return Promise.reject("Số cột phải là số nguyên");
                  }
                  if (value < 1 || value > 15) {
                    return Promise.reject("Số cột phải từ 1 đến 26");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={15}
              className="w-full"
              disabled={roomHasSeats}
              step={1}
            />
          </Form.Item>

          {editingRoom && roomHasSeats && (
            <Form.Item>
              <div className="text-yellow-600">
                ⚠️ Phòng đã có ghế, không thể thay đổi số hàng và số cột.
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default RoomList;
