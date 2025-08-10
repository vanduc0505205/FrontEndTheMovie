import React from 'react';
import { Table, Button } from 'antd';

const MoviesPage: React.FC = () => {
  const columns = [
    { title: 'Mã phim', dataIndex: 'id' },
    { title: 'Tên phim', dataIndex: 'title' },
    { title: 'Thể loại', dataIndex: 'category' },
    { title: 'Thời lượng', dataIndex: 'duration' },
    { title: 'Ngày khởi chiếu', dataIndex: 'releaseDate' },
    {
      title: 'Hành động',
      render: () => <Button type="link">Xem chi tiết</Button>,
    },
  ];

  const data = []; // TODO: fetch API

  return (
    <div>
      <h2>Quản lý phim</h2>
      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
};

export default MoviesPage;
