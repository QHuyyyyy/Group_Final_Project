import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const AdminRoute = ({ children, allowedRoles }: AdminRouteProps) => {
  const user = useUserStore((state) => state);
  
  if (!user || user.role_code !== 'A001') {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role_code)) {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
