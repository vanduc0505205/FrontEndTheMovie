import React, { useState, useMemo, useCallback } from "react";
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
  Select,
  Tag,
  Space,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, createRoom, updateRoom } from "@/api/room.api";
import { getSeatsByRoom } from "@/api/seat.api";
import { IRoom } from "@/interface/room";

const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr)?.role || null : null;
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

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const { mutate: handleCreateOrUpdate, isPending } = useMutation({
    mutationFn: async (room: Partial<IRoom>) => {
      if (userRole !== "admin") {
        throw new Error("Bạn không có quyền thực hiện hành động này!");
      }
      return editingRoom
        ? updateRoom(editingRoom._id, room)
        : createRoom(room);
    },
    onSuccess: () => {
      message.success(editingRoom ? "Đã cập nhật phòng" : "Đã tạo phòng");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      form.resetFields();
      setIsModalOpen(false);
      setEditingRoom(null);
    },
    onError: (error) => {
      notification.error({
        message: "Thất bại",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        placement: "topRight",
      });
    },
  });

  const { mutate: handleToggleStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IRoom["status"] }) => {
      if (userRole !== "admin") {
        throw new Error("Bạn không có quyền thực hiện hành động này!");
      }
      return updateRoom(id, { status });
    },
    onSuccess: () => {
      message.success("Đã cập nhật trạng thái phòng");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật trạng thái.";

      if (status === 409 && code === "ROOM_MAINTENANCE_BLOCKED_BY_ACTIVE_BOOKINGS") {
        notification.warning({
          message: "Không thể bật bảo trì",
          description: serverMessage,
          placement: "topRight",
        });
        return;
      }

      notification.error({
        message: "Thất bại",
        description: serverMessage,
        placement: "topRight",
      });
    },
  });

  const openModalToEdit = useCallback(
    async (room: IRoom) => {
      setEditingRoom(room);
      form.setFieldsValue(room);
      setIsModalOpen(true);

      try {
        const seats = await getSeatsByRoom(room._id);
        setRoomHasSeats(seats?.length > 0);
      } catch (err) {
        console.error("Lỗi khi kiểm tra ghế:", err);
        setRoomHasSeats(false);
      }
    },
    [form]
  );

  const onFinish = useCallback(
    (values: any) => {
      handleCreateOrUpdate(values);
    },
    [handleCreateOrUpdate]
  );

  const columns = useMemo(
    () => [
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
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) => {
          const color = status === "open" ? "green" : "red";
          const text = status === "open" ? "Mở" : "Bảo trì";
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, room: IRoom) => {
          const isMaintenance = room.status === "maintenance";
          const newStatus: IRoom["status"] = isMaintenance ? "open" : "maintenance";
          const buttonText = isMaintenance ? "Mở lại" : "Bảo trì";

          return (
            <Space>
              <Button size="small" onClick={() => openModalToEdit(room)} title="Chỉnh sửa phòng">
                Sửa
              </Button>
              {userRole === "admin" && (
                <Popconfirm
                  title={`Xác nhận chuyển trạng thái sang ${buttonText.toLowerCase()}?`}
                  onConfirm={() =>
                    handleToggleStatus({ id: room._id, status: newStatus })
                  }
                >
                  <Button
                    size="small"
                    danger={!isMaintenance}
                    type={isMaintenance ? "primary" : "default"}
                    title={`Chuyển trạng thái sang ${buttonText.toLowerCase()}`}
                  >
                    {buttonText}
                  </Button>
                </Popconfirm>
              )}
            </Space>
          );
        },
      },
    ],
    [openModalToEdit, handleToggleStatus]
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý phòng chiếu</h2>
        {userRole === "admin" && (
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
        locale={{ emptyText: "Không có dữ liệu phòng chiếu" }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
          form.resetFields();
        }}
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
            extra="Giới hạn: 1–15"
            rules={[
              { required: true, message: "Vui lòng nhập số hàng" },
              {
                validator(_, value) {
                  if (typeof value !== "number" || !Number.isInteger(value)) {
                    return Promise.reject("Số hàng phải là số nguyên");
                  }
                  if (value < 1 || value > 15) {
                    return Promise.reject("Số hàng phải từ 1 đến 15");
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

          <Form.Item
            name="columns"
            label="Số cột"
            extra="Giới hạn: 1–15"
            rules={[
              { required: true, message: "Vui lòng nhập số cột" },
              {
                validator(_, value) {
                  if (typeof value !== "number" || !Number.isInteger(value)) {
                    return Promise.reject("Số cột phải là số nguyên");
                  }
                  if (value < 1 || value > 15) {
                    return Promise.reject("Số cột phải từ 1 đến 15");
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

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Select.Option value="open">Mở</Select.Option>
              <Select.Option value="maintenance">Bảo trì</Select.Option>
            </Select>
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