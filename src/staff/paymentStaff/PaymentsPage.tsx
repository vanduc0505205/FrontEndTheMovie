import React from 'react';
import { Table } from 'antd';

const PaymentsPage: React.FC = () => {
  const columns = [
    { title: 'Mã thanh toán', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer' },
    { title: 'Số tiền', dataIndex: 'amount' },
    { title: 'Phương thức', dataIndex: 'method' },
    { title: 'Ngày thanh toán', dataIndex: 'date' },
    { title: 'Trạng thái', dataIndex: 'status' },
  ];

  const data = []; // TODO: fetch API

  return (
    <div>
      <h2>Quản lý thanh toán</h2>
      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
};

export default PaymentsPage;
