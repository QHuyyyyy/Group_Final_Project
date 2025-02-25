import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useUserStore((state) => state);
  
  if (!user || user.role_code !== 'A001') {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
