import React, { useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Input,
  message,
  Table,
  Tag,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRooms } from "@/api/room.api";
import {
  bulkCreateSeats,
  getSeatsByRoom,
  updateSeat,
} from "@/api/seat.api";

const SeatList = () => {
  const [roomRows, setRoomRows] = useState<number>(0);
  const [roomCols, setRoomCols] = useState<number>(0);
  const [form] = Form.useForm();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const {
    data: seats = [],
    isLoading: loadingSeats,
  } = useQuery({
    queryKey: ["seats", selectedRoom],
    queryFn: () => getSeatsByRoom(selectedRoom!),
    enabled: !!selectedRoom,
  });

  const { mutateAsync: createSeats, isPending } = useMutation({
    mutationFn: bulkCreateSeats,
    onSuccess: () => {
      message.success("Tạo ghế thành công");
      queryClient.invalidateQueries({ queryKey: ["seats", selectedRoom] });
    },
    onError: () => message.error("Tạo ghế thất bại"),
  });

  const { mutate: editSeat } = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<any> }) =>
      updateSeat(id, updates),
    onSuccess: () => {
      message.success("Đã cập nhật ghế");
      queryClient.invalidateQueries({ queryKey: ["seats", selectedRoom] });
    },
    onError: () => message.error("Cập nhật thất bại"),
  });

  const handleSubmit = async (values) => {
    try {
      const payload = {
        roomId: values.roomId,
        rows: values.rows,
        columns: values.columns,
        vipRows: values.vipRows?.split(",").map((r) => r.trim().toUpperCase()),
        vipSeats: values.vipSeats?.split(",").map((s) => s.trim().toUpperCase()),
      };
      await createSeats(payload);
      form.resetFields();
    } catch (err) { }
  };

  const handleTypeToggle = (seat) => {
    const newType = seat.type === "VIP" ? "NORMAL" : "VIP";
    editSeat({ id: seat._id, updates: { type: newType } });
  };

  const handleStatusToggle = (seat) => {
    const nextStatus = seat.status === "available"
      ? "maintenance"
      : seat.status === "maintenance"
        ? "available"
        : "available";
    editSeat({ id: seat._id, updates: { status: nextStatus } });
  };

  const columns = [
    {
      title: "Mã ghế",
      dataIndex: "seatCode",
      key: "seatCode",
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (_, seat) => (
        <Tag
          color={seat.type === "VIP" ? "gold" : "blue"}
          onClick={() => handleTypeToggle(seat)}
          style={{ cursor: "pointer" }}
        >
          {seat.type}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, seat) => {
        const colorMap = {
          available: "green",
          booked: "red",
          maintenance: "orange",
        };
        return (
          <Tag
            color={colorMap[seat.status]}
            onClick={() => handleStatusToggle(seat)}
            style={{ cursor: "pointer" }}
          >
            {seat.status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Quản lý ghế</h2>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="roomId" label="Phòng" rules={[{ required: true }]}>
          <Select
            placeholder="Chọn phòng"
            loading={loadingRooms}
            onChange={(value) => {
              setSelectedRoom(value);
              const selected = rooms.find((room) => room._id === value);
              if (selected) {
                setRoomRows(selected.rows);
                setRoomCols(selected.columns);
                form.setFieldsValue({
                  rows: selected.rows,
                  columns: selected.columns,
                });
              }
            }}


          >
            {rooms.map((room) => (
              <Select.Option key={room._id} value={room._id}>
                {room.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="rows" label="Số hàng (tối đa 26)" rules={[{ required: true }]}>
          <InputNumber min={1} max={26} className="w-full" />
        </Form.Item>

        <Form.Item name="columns" label="Số cột" rules={[{ required: true }]}>
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item name="vipRows" label="Hàng VIP (phân cách bằng dấu phẩy, ví dụ: A,B)">
          <Input placeholder="A,B,C" />
        </Form.Item>

        <Form.Item name="vipSeats" label="Ghế VIP cụ thể (ví dụ: C3,D4)">
          <Input placeholder="C3,D4" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Tạo ghế
          </Button>
        </Form.Item>
      </Form>

      {selectedRoom && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Danh sách ghế</h3>
          <Table
            rowKey="_id"
            loading={loadingSeats}
            columns={columns}
            dataSource={seats}
            bordered
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default SeatList;
