
import UserDashBoard from "./pages/UserDashboard";

import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminRoute from './routes/AdminRoute';
export const Homepage = lazy(() => import('./pages/Homepage'));
export const Login = lazy(() => import('./pages/Login')); 
export const Profile = lazy(() => import('./pages/Profile'));
export const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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

          <Route path="/dashboard/*" element={<UserDashBoard />} />
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route 
            path='/dashboard' 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
