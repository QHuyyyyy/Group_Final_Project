import React from "react";
import { Avatar, Dropdown, Menu, Row, Col } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import avatar from "../assets/avatar.png"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavbarAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() =>{
        navigate("/dashboard/profile")
      }}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={() =>{
        navigate("/dashboard/settingadmin")
      }}>
        <SettingOutlined /> Settings
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout} style={{
        color:"red"
      }}>
      <LogoutOutlined /> Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center bg-white  dark:text-white px-6 py-3 shadow-md">
      
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Icons */}
        <Row gutter={[16,16]} align="middle">
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
