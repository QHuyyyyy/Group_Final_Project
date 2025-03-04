import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute = ({ children, allowedRoles}: ProtectedRouteProps) => {
  const user = useUserStore((state) => state);
  
  if (!user || !user.role_code) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role_code)) {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;