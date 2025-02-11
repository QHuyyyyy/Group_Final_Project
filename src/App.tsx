import UserDashBoard from "./pages/UserDashboard";

import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminRoute from './routes/AdminRoute';

// Lazy load components
const Homepage = lazy(() => import('./pages/Homepage'));
const Login = lazy(() => import('./pages/Login')); 
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProjectManager = lazy(() => import('./pages/AdminProjectManager'));
const AdminUserManager = lazy(() => import('./pages/AdminUserManager'));

const Loading = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/userdashboard' element={<UserDashBoard />} />
          
          {/* Admin Routes */}
          <Route path='/dashboard' element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path='/admin/project-manager' element={
            <AdminRoute>
              <AdminProjectManager />
            </AdminRoute>
          } />
          <Route path='/admin/user-manager' element={
            <AdminRoute>
              <AdminUserManager />
            </AdminRoute>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
