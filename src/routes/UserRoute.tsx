import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';


interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute = ({ children }: UserRouteProps) => {
  const user = useUserStore((state) => state);
  
  if (!user || (user.role_code !== 'A002' && user.role_code !== 'A003' && user.role_code !== 'A004')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
