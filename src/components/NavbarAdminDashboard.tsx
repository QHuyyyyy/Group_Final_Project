import React from 'react';
import { Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import avatar from '../assets/avatar.png'; // Import avatar mặc định

const NavbarAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menu = [
    {
      key: '1',
      label: (
        <Link to="/dashboard/profile">
          <UserOutlined className="pr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={handleLogout} className="cursor-pointer">
          <LogoutOutlined className="pr-2" />
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-between p-5 bg-white w-full">
      <div className="flex-1"></div>
      <div className="flex items-center gap-5 justify-end">
        <Dropdown menu={{ items: menu }} trigger={["click"]}>
          <img
            src={avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default NavbarAdminDashboard;
