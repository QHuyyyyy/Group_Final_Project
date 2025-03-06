import React, { lazy, Suspense } from "react";
import { UserOutlined,LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import {Dropdown} from "antd"
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import avatar from "../../assets/avatar.png";


const AdminClaimStats = lazy(() => import('../../components/admin/AdminClaimStats'));
const AdminProjectStats = lazy(() => import('../../components/admin/AdminProjectStats'))
const AdminDashboard: React.FC = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menu = [
    {
      key: "1",
      label: (
        <Link to="/dashboard/profile">
          <UserOutlined className="pr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/dashboard/settingadmin">
          <SettingOutlined className="pr-2" />
          Setting
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={handleLogout} className="cursor-pointer">
          <LogoutOutlined className="pr-2" />
          Logout
        </span>
      ),
    },
  ];
  return (
    <>
    <Suspense>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-5 justify-end w-full">
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
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 ml-64  bg-sky-50">
          <div className="p-8 mt-1">
            <p className="text-2xl font-bold mb-4 font-mono" >Dashboard Overview</p>
            {/* Claim stats section */}
            <AdminClaimStats/>
            {/* Project stats section */}
            <AdminProjectStats/>
          </div>
        </div>

      </div>
      </Suspense>
    </>
  );
};

export default AdminDashboard;