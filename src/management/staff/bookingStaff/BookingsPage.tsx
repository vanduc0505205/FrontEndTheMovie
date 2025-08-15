import React from 'react';
import { Table } from 'antd';

const BookingsPage: React.FC = () => {
  const columns = [
    { title: 'Mã đặt vé', dataIndex: 'id' },
    { title: 'Tên khách hàng', dataIndex: 'customer' },
    { title: 'Phim', dataIndex: 'movie' },
    { title: 'Suất chiếu', dataIndex: 'showtime' },
    { title: 'Ghế', dataIndex: 'seat' },
    { title: 'Trạng thái', dataIndex: 'status' },
  ];

  const data = []; // TODO: fetch API

  return (
    <div>
      <h2>Quản lý đặt vé</h2>
      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
};

export default BookingsPage;
