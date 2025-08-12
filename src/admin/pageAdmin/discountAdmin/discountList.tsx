import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Popconfirm, Switch, Modal, Descriptions, message, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAllDiscounts, deleteDiscount, getDiscountById, updateDiscount } from '@/api/discount.api';
import { IDiscount } from '@/interface/discount';
import DiscountFormModal from './discountFormModal';

const { Search } = Input;

const DiscountList = () => {
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null);
  const [open, setOpen] = useState(false);
  const [detailData, setDetailData] = useState<IDiscount | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const navigate = useNavigate();

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await getAllDiscounts();
      setDiscounts(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách mã giảm giá. Vui lòng thử lại.');
      console.error('Lỗi khi lấy danh sách discount:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const res = await getDiscountById(id);
      setDetailData(res);
      setDetailVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết mã giảm giá. Vui lòng thử lại.');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateDiscount(id, { isActive: !isActive });
      message.success(`Đã ${!isActive ? 'kích hoạt' : 'tắt'} mã thành công!`);
      fetchDiscounts();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const debounceSearch = (value: string) => {
    const delay = setTimeout(() => setSearch(value.toUpperCase()), 300);
    return () => clearTimeout(delay);
  };

  const columns = [
    { title: 'Mã', dataIndex: 'code', render: (text: string) => <b>{text}</b> },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      render: (value: number) => `${value.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Số lượt',
      render: (_: any, record: IDiscount) => `${record.usedCount || 0}/${record.quantity ?? '∞'}`,
    },
    {
      title: 'Ngày',
      render: (_: any, record: IDiscount) =>
        `${new Date(record.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - 
         ${new Date(record.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (active: boolean, record: IDiscount) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${active ? 'tắt' : 'kích hoạt'} mã "${record.code}"?`}
          onConfirm={() => handleToggleActive(record._id, active)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Switch checked={active} />
        </Popconfirm>
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, record: IDiscount) => (
        <Space>
          <Button onClick={() => handleViewDetail(record._id)}>Chi tiết</Button>
          <Button onClick={() => { setEditingDiscount(record); setOpen(true); }}>Sửa</Button>
          <Popconfirm title="Xóa mã giảm giá này?" onConfirm={() => deleteDiscount(record._id).then(fetchDiscounts)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm mã..."
          onSearch={debounceSearch}
          allowClear
          onChange={(e) => debounceSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          onClick={() => { setEditingDiscount(null); setOpen(true); }}
        >
          Thêm mã
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={discounts.filter((d: IDiscount) => d.code.includes(search))}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
      />

      <DiscountFormModal
        open={open}
        onClose={() => setOpen(false)}
        onRefresh={fetchDiscounts}
        initialValues={editingDiscount}
      />

      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        title="Chi tiết mã giảm giá"
        width={600}
      >
        {detailData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã">{detailData.code}</Descriptions.Item>
            <Descriptions.Item label="Giá trị">{detailData.value.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Số lượt">
              {`${detailData.usedCount || 0}/${detailData.quantity ?? '∞'}`}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {new Date(detailData.startDate).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {new Date(detailData.endDate).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detailData.isActive ? <Tag color="success">Kích hoạt</Tag> : <Tag color="red">Ngừng</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày áp dụng">
              {detailData.allowedDays?.length
                ? detailData.allowedDays.map((d) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d]).join(', ')
                : 'Tất cả các ngày'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default DiscountList;