import React from 'react';
import { 
  TeamOutlined,
  UserAddOutlined
} from '@ant-design/icons';

interface NavbarAdminUserProps {
  onAddUser: () => void;
}

const NavbarAdminUser: React.FC<NavbarAdminUserProps> = ({ onAddUser }) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1E2640] text-white p-4">
      <div className="h-full flex flex-col">
        {/* Logo or Brand */}
        <div className="text-xl font-bold mb-8">Admin Panel</div>

        {/* Menu Items */}
        <div className="space-y-2">
          <div className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors cursor-pointer">
            <TeamOutlined />
            <span>Staff Management</span>
          </div>

          <div 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
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