import React, { useState } from 'react';
import { 
  UserOutlined, 
  TeamOutlined,
  UserAddOutlined,
  CaretDownOutlined
} from '@ant-design/icons';

interface NavbarAdminUserProps {
  onAddUser: () => void;
}

const NavbarAdminUser: React.FC<NavbarAdminUserProps> = ({ onAddUser }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

          {/* User Management Dropdown */}
          <div className="relative">
            <div 
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#2E3754] transition-colors cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="flex items-center space-x-3">
                <UserOutlined />
                <span>User Management</span>
              </div>
              <CaretDownOutlined className={`transition-transform duration-200 ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="pl-8 mt-1 space-y-2 bg-[#2E3754] rounded-lg py-2">
                <div 
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-[#3B4865] rounded-lg transition-colors cursor-pointer"
                  onClick={onAddUser}
                >
                  <UserAddOutlined />
                  <span>Add User</span>
                </div>
                {/* Add more dropdown items here if needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div> 
  );
};

export default NavbarAdminUser;