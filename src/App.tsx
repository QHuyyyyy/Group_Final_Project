import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import TransactionPage from './pages/user/Transaction';

// Lazy load components
const Homepage = lazy(() => import('./pages/Homepage'));
const Login = lazy(() => import('./pages/common/Login'));
const Profile = lazy(() => import('./pages/common/Profile'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjectManager = lazy(() => import('./pages/admin/AdminProjectManager'));
const AdminUserManager = lazy(() => import('./pages/admin/AdminUserManager'));
const UserDashBoard = lazy(() => import('./pages/user/UserDashboard'));
const ApprovalPage = lazy(() => import('./pages/user/Approval'));
const Request = lazy(() => import('./pages/user/Request'));
const Finance = lazy(() => import('./pages/user/Finance'));
const RequestDetails = lazy(() => import('./pages/user/RequestDetails'));
const CreateRequest = lazy(() => import('./pages/user/CreateRequest'));

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
          <Route path='/transaction' element={<TransactionPage/>}/>
          {/* User Dashboard Routes */}
          <Route path='/userdashboard/' element={<UserRoute><UserDashBoard /></UserRoute>}>
            <Route path="profile" element={
              <UserRoute>
                <Profile />
              </UserRoute>
            } />
            <Route path="approvals" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={['approver']}>
                <ApprovalPage />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="claimrequest" element={
                <UserRoute>
                <Request />
                </UserRoute>
            } />
            <Route path="finance" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={['finance']}>
                <Finance />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="request-detail/:id" element={
              <UserRoute>
                <RequestDetails />
              </UserRoute>
            } />
            <Route path="create-request" element={
              <UserRoute>
                <CreateRequest />
              </UserRoute>
            } />
          </Route>

          {/* Admin Routes */}
          <Route path='/dashboard' element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path='/dashboard/project-manager' element={
            <AdminRoute>
              <AdminProjectManager />
            </AdminRoute>
          } />
          <Route path='/dashboard/user-manager' element={
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