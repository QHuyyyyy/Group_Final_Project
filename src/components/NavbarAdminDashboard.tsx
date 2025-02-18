import React from "react";
import { Avatar, Badge, Dropdown, Menu, Row, Col } from "antd";
import {
 
  BellOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import avatar from "../assets/avatar.png"

const NavbarAdminDashboard: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="2">
        <SettingOutlined /> Settings
      </Menu.Item>
      <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 shadow-md">
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="US Flag"
            className="w-5 h-5 rounded-full"
          />
          <span className="hidden sm:block">En</span>
        </div>

        {/* Notification Icons */}
        <Row gutter={[16,16]} align="middle">
            <Col>
        <Badge count={1} className="cursor-pointer">
          <MailOutlined className="text-xl" />
        </Badge>
        </Col>
        <Col>
        <Badge count={5} className="cursor-pointer">
          <BellOutlined className="text-xl" />
        </Badge>
        </Col>

        <Col>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar
            src={avatar}
            className="cursor-pointer"
          />
        </Dropdown>
        </Col>
        </Row>
      </div>
    </div>
  );
};

export default NavbarAdminDashboard;
