import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Input,
  message,
  Table,
  Tag,
  Pagination,
  Divider,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRooms } from "@/api/room.api";
import {
  bulkCreateSeats,
  getSeatsByRoom,
  updateSeat,
} from "@/api/seat.api";
import { ISeat } from "@/types/seat";

const SeatList = () => {
  const [hasSeats, setHasSeats] = useState(false);
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

  useEffect(() => {
    if (selectedRoom) {
      setHasSeats((seats || []).length > 0);
    }
  }, [selectedRoom, seats]);

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

  //Phân trang
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatCode.charAt(0); 
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, ISeat[]>);
  const rowKeys = Object.keys(groupedSeats).sort(); 
  const pageSize = 1; 
  const [currentPage, setCurrentPage] = useState(1);
  const currentRow = rowKeys[currentPage - 1];
  const currentSeats = groupedSeats[currentRow] || [];

  const columns = [
    {
      title: "Mã ghế",
      dataIndex: "seatCode",
      key: "seatCode",
      render: (text: string) => <Tag>{text}</Tag>,
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
        const statusLabel = {
          available: "Còn trống",
          booked: "Đã đặt",
          maintenance: "Bảo trì",
        };
        return (
          <Tag
            color={colorMap[seat.status]}
            onClick={() => handleStatusToggle(seat)}
            style={{ cursor: "pointer" }}
          >
            {statusLabel[seat.status]}
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
            value={selectedRoom}
          >
            {rooms.map((room) => (
              <Select.Option key={room._id} value={room._id}>
                {room.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {!hasSeats && (
          <>
            <div className="flex gap-4">
              <Form.Item
                name="rows"
                label="Số hàng (Không thể thay đổi)"
                rules={[{ required: true }]}
                className="flex-1"
              >
                <InputNumber min={1} max={26} className="w-full" disabled />
              </Form.Item>

              <Form.Item
                name="columns"
                label="Số cột (Không thể thay đổi)"
                rules={[{ required: true }]}
                className="flex-1"
              >
                <InputNumber min={1} className="w-full" disabled />
              </Form.Item>
            </div>

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
          </>
        )}

        {hasSeats && (
          <div className="mt-2 text-blue-600">
            Phòng đã có ghế. Không thể thêm ghế VI.
          </div>
        )}
      </Form>
      <Divider className="my-6" />
      {currentRow && (
        <h3 className="text-lg font-semibold mb-2">
          Danh sách ghế - Hàng {currentRow}
        </h3>
      )}
      {selectedRoom && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Danh sách ghế</h3>
          <Table
            rowKey="_id"
            loading={loadingSeats}
            columns={columns}
            dataSource={currentSeats} // chỉ hiển thị A1 → A10 nếu currentRow là "A"
            bordered
            pagination={false}
          />
        </div>
      )}
      <Pagination
        current={currentPage}
        pageSize={1} // mỗi trang 1 hàng
        total={rowKeys.length}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
        className="mt-4 text-center"
      />
    </div>
  );
};

export default SeatList;
