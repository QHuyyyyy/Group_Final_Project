import { Navigate } from 'react-router-dom';

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute = ({ children }: UserRouteProps) => {
  const role = localStorage.getItem('role');
  
  if (role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
