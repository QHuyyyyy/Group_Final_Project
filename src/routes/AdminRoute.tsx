import { Navigate, Outlet } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = UserAuth();
  const role = localStorage.getItem('role');

  if (user && role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default AdminRoute;
