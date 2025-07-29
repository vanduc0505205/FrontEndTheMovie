// HeaderStaff.tsx
import React from "react";
import { Layout, Avatar, Dropdown, Menu, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const HeaderStaff = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/dang-nhap");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white shadow-md px-6 flex justify-between items-center">
      <Text className="text-xl font-semibold">Trang Nhân Viên </Text>
      <Dropdown overlay={menu} placement="bottomRight">
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar icon={<UserOutlined />} />
          <Text className="hidden md:block">staff</Text>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderStaff;
