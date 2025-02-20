import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute = ({ children }: UserRouteProps) => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'staff' && user.role !== 'finance' && user.role !== 'approver' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
