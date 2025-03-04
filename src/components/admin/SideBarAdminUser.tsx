import React from 'react';
import { 
  TeamOutlined,
  EyeOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarAdminUserProps {
  onAddUser: () => void;
}

const NavbarAdminUser: React.FC<NavbarAdminUserProps> = ({ onAddUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1E2640] text-white p-4">
      <div className="h-full flex flex-col">
        {/* Logo or Brand */}
        <div className="text-xl font-bold mb-8">Admin Panel</div>

        {/* Menu Items */}
        <div className="space-y-2">
          <div 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              isActiveRoute('/dashboard/user-manager')
                ? 'bg-blue-600 text-white'
                : 'hover:bg-[#2E3754] text-gray-300'
            }`}
            onClick={() => navigate('/dashboard/user-manager')}
          >
            <TeamOutlined />
            <span>Staff Management</span>
          </div>
          <div 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              isActiveRoute('/dashboard/view-claim-request')
                ? 'bg-blue-600 text-white'
                : 'hover:bg-[#2E3754] text-gray-300'
            }`}
            onClick={() => navigate('/dashboard/view-claim-request')}
          >
            <EyeOutlined />
            <span>View Claim Request</span>
          </div>

          <div 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer"
            onClick={onAddUser}
          >
            <UserAddOutlined />
            <span>Add User</span>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default NavbarAdminUser;