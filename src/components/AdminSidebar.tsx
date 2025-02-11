
import { Link, useLocation } from 'react-router-dom';
import { ProjectOutlined, UserOutlined } from '@ant-design/icons';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Project Manage",
      icon: <ProjectOutlined />,
      path: "/admin/project-manager"
    },
    {
      title: "User Manage", 
      icon: <UserOutlined />,
      path: "/admin/user-manager"
    }
  ];

  return (
    <div className="bg-[#1E2640] min-h-screen w-64 fixed left-0 top-0 text-white">
      <div className="p-6">
        <div className="text-xl font-bold mb-8 text-center">
          Admin Dashboard
        </div>

        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-[#2E3754] text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 