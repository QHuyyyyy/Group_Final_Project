import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

interface UserRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const UserRoute = ({ children, allowedRoles }: UserRouteProps) => {
  const user = useUserStore((state) => state);
  
  if (!user || (user.role_code !== 'A002' && user.role_code !== 'A003' && user.role_code !== 'A004')) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role_code)) {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
