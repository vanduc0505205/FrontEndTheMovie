import { useEffect, useState } from "react";
import { Table, Button, Space, Input, Popconfirm, Tag, Switch } from "antd";
import {
  getAllDiscounts,
  deleteDiscount,
} from "@/api/discount.api";
import DiscountFormModal from "./discountFormModal";

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchDiscounts = async () => {
  setLoading(true);
  try {
    const data = await getAllDiscounts(); 
    setDiscounts(data);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách discount:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (text) =>
        text === "percent" ? <Tag color="green">%</Tag> : <Tag color="blue">₫</Tag>,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
    },
    {
      title: "Tối đa",
      dataIndex: "maxDiscount",
    },
    {
      title: "Số lượt",
      render: (_, record) => `${record.usedCount}/${record.quantity}`,
    },
    {
      title: "Ngày",
      render: (_, record) =>
        `${new Date(record.startDate).toLocaleDateString()} - ${new Date(
          record.endDate
        ).toLocaleDateString()}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (active) => <Switch checked={active} disabled />,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => {
            setEditingDiscount(record);
            setOpen(true);
          }}>Sửa</Button>

          <Popconfirm
            title="Xóa mã giảm giá này?"
            onConfirm={() => {
              deleteDiscount(record._id).then(fetchDiscounts);
            }}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm mã..."
          onSearch={(value) => setSearch(value)}
          allowClear
        />
        <Button type="primary" onClick={() => {
          setEditingDiscount(null);
          setOpen(true);
        }}>
          Thêm mã
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={discounts.filter(d => d.code.includes(search.toUpperCase()))}
        columns={columns}
        loading={loading}
      />

      <DiscountFormModal
        open={open}
        onClose={() => setOpen(false)}
        onRefresh={fetchDiscounts}
        initialValues={editingDiscount}
      />
    </>
  );
};

export default DiscountList;
