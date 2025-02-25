import { Button } from 'antd';
import {  ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const user = useUserStore((state) => state);
  const navigate = useNavigate();

  // Kiểm tra user và role_code
  if (!user?.role_code || !allowedRoles.includes(user.role_code)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-4 pt-32">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-50 rounded-full transform -translate-x-6 translate-y-6"></div>

          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-800">Từ chối truy cập</h2>
            <p className="text-gray-500">
              Bạn không có quyền truy cập trang này
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate(-1)}
              type="default"
              icon={<ArrowLeftOutlined />}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 h-12 px-8 rounded-full flex items-center"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;