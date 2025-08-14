import React from "react";
import { Table } from "antd";

const columns2D = [
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Thứ 2 - Thứ 6",
    children: [
      {
        title: "Trước 17h",
        dataIndex: "weekdayBefore17h",
        key: "weekdayBefore17h",
      },
      {
        title: "Sau 17h",
        dataIndex: "weekdayAfter17h",
        key: "weekdayAfter17h",
      },
    ],
  },
  {
    title: "Thứ 7 - CN, Lễ",
    dataIndex: "weekend",
    key: "weekend",
  },
];

const data2D = [
  {
    key: "1",
    time: "Người lớn",
    weekdayBefore17h: "45.000đ",
    weekdayAfter17h: "60.000đ",
    weekend: "70.000đ",
  },
  {
    key: "2",
    time: "Học sinh - Sinh viên",
    weekdayBefore17h: "40.000đ",
    weekdayAfter17h: "50.000đ",
    weekend: "60.000đ",
  },
  {
    key: "3",
    time: "Trẻ em (<1m3)",
    weekdayBefore17h: "35.000đ",
    weekdayAfter17h: "45.000đ",
    weekend: "55.000đ",
  },
];

const columns3D = [
  {
    title: "Đối tượng",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Thứ 2 - Thứ 6",
    children: [
      {
        title: "Trước 17h",
        dataIndex: "weekdayBefore17h",
        key: "weekdayBefore17h",
      },
      {
        title: "Sau 17h",
        dataIndex: "weekdayAfter17h",
        key: "weekdayAfter17h",
      },
    ],
  },
  {
    title: "Thứ 7 - CN, Lễ",
    dataIndex: "weekend",
    key: "weekend",
  },
];

const data3D = [
  {
    key: "1",
    type: "Người lớn",
    weekdayBefore17h: "70.000đ",
    weekdayAfter17h: "80.000đ",
    weekend: "90.000đ",
  },
  {
    key: "2",
    type: "Học sinh - Sinh viên",
    weekdayBefore17h: "60.000đ",
    weekdayAfter17h: "70.000đ",
    weekend: "80.000đ",
  },
  {
    key: "3",
    type: "Trẻ em (<1m3)",
    weekdayBefore17h: "50.000đ",
    weekdayAfter17h: "60.000đ",
    weekend: "70.000đ",
  },
];

export default function TicketPrice() {
  return (
    <div className="p-6 py-20">
      <div>
        <h1 className="text-3xl font-bold mb-4">Bảng giá vé 2D</h1>
        <Table
          columns={columns2D}
          dataSource={data2D}
          bordered
          pagination={false}
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">Bảng giá vé 3D</h1>
        <Table
          columns={columns3D}
          dataSource={data3D}
          bordered
          pagination={false}
        />
      </div>

      <div className="text-gray-700 mt-6">
        <p>- Giá vé trên có thể thay đổi theo từng thời điểm khuyến mãi.</p>
        <p>- Học sinh/sinh viên cần mang theo thẻ để được hưởng ưu đãi.</p>
        <p>- Trẻ em cao dưới 1m3 được tính theo giá trẻ em.</p>
      </div>
    </div>
  );
}
