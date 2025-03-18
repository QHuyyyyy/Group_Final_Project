import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Menu, Row, Col } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserStore } from "../stores/userStore";
import { employeeService } from "../services/employee.service";
import { Employee } from "../models/EmployeeModel";

const NavbarAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useUserStore();
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await employeeService.getEmployeeById(user.id);
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (user.id) {
      fetchEmployeeData();
    }
  }, [user.id]);

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
      <Menu.Item key="2" onClick={handleLogout} style={{
        color:"red"
      }}>
      <LogoutOutlined /> Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center bg-white dark:text-white px-6 py-3 shadow-md">
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Icons */}
        <Row gutter={[16,16]} align="middle">
        <Col>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar
            src={employeeData?.avatar_url}
            icon={!employeeData?.avatar_url && <UserOutlined />}
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
