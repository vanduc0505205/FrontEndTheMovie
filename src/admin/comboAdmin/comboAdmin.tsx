import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Card, Popconfirm, Tag, Tooltip, Typography, Image } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { ICombo } from '@/interface/combo';
import { comboApi } from '@/api/combo.api';
import ComboModal from './comboModal';

const { Title } = Typography;
const combos = await comboApi.getAllCombo();
const ComboList: React.FC = () => {
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCombo, setSelectedCombo] = useState<ICombo | undefined>(undefined);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const data = await comboApi.getAllCombo();
      setCombos(data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const handleCreate = () => {
    setSelectedCombo(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (combo: ICombo) => {
    setSelectedCombo(combo);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await comboApi.deleteCombo(id);
      message.success('Xóa combo thành công!');
      fetchCombos();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await comboApi.toggleAvailability(id);
      message.success('Cập nhật trạng thái thành công!');
      fetchCombos();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ICombo> = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image
          src={`http://localhost:3000${imageUrl}`}
          alt="Combo"
          width={80}
          height={60}
          style={{ objectFit: 'cover' }}
          fallback="https://via.placeholder.com/80x60?text=No+Image"
        />
      ),
    },
    {
      title: 'Tên Combo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Sản phẩm đi kèm',
      key: 'products',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.popcorns && record.popcorns.length > 0 && (
            <div>
              <strong>Đồ ăn:</strong>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {record.popcorns.map((item, index) => (
                  <li key={index}>{item.name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>
          )}
          {record.drinks && record.drinks.length > 0 && (
            <div>
              <strong>Nước Uống:</strong>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {record.drinks.map((item, index) => (
                  <li key={index}>{item.name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isAvailable',
      dataIndex: 'isAvailable',
      render: (isAvailable: boolean, record: ICombo) => (
        <Space>
          <Popconfirm
            title={`Bạn có muốn ${isAvailable ? 'vô hiệu hóa' : 'kích hoạt'} combo này?`}
            onConfirm={() => handleToggleAvailability(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title={isAvailable ? 'Vô hiệu hóa' : 'Kích hoạt'}>
              <Tag color={isAvailable ? 'green' : 'red'} style={{ cursor: 'pointer' }}>
                {isAvailable ? 'Đang bán' : 'Ngừng bán'}
              </Tag>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa combo này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản Lý Combo"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm Combo Mới
        </Button>
      }
    >
      <Table columns={columns} dataSource={combos} loading={loading} rowKey="_id" />
      <ComboModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        comboData={selectedCombo}
        onSuccess={fetchCombos}
      />
    </Card>
  );
};

export default ComboList;