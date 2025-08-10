import React from 'react';
import { Table, Button } from 'antd';

const ShowtimesPage: React.FC = () => {
  const columns = [
    { title: 'Mã suất', dataIndex: 'id' },
    { title: 'Phim', dataIndex: 'movie' },
    { title: 'Phòng', dataIndex: 'room' },
    { title: 'Rạp', dataIndex: 'cinema' },
    { title: 'Ngày chiếu', dataIndex: 'date' },
    { title: 'Giờ chiếu', dataIndex: 'time' },
    {
      title: 'Hành động',
      render: () => <Button type="link">Chỉnh sửa</Button>,
    },
  ];

  const data = []; // TODO: fetch API

  return (
    <div>
      <h2>Quản lý lịch chiếu</h2>
      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
};

export default ShowtimesPage;
