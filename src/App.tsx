import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import TransactionPage from './pages/user/Transaction';
import AboutUs from './pages/AboutUs';
import Services from './pages/user/Services';
import ContactUs from './pages/Contactus';
import ForgotPassword from './components/common/ForgotPassword';
import { RoutePermissions } from './routes/RoutePermissions';

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
const IndustriesPage = lazy(() => import('./pages/InductriesPage'));
const ViewClaimRequest = lazy(() => import('./pages/admin/ViewClaimRequest'));

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
          <Route path='/industries' element={<IndustriesPage />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/services' element={<Services />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/login' element={<Login />} />
          <Route path='/contactus' element={<ContactUs />} />
          {/* User Dashboard Routes */}
          <Route path='/userdashboard/' element={<UserRoute><UserDashBoard /></UserRoute>}>
            <Route path="profile" element={
              <UserRoute>
                <Profile />
              </UserRoute>
            } />
          </Route>
          {/* User Dashboard Routes */}
          <Route path='/userdashboard/' element={<UserRoute><UserDashBoard /></UserRoute>}>
            <Route path="transaction" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={RoutePermissions.transaction}>
                  <TransactionPage />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="approvals" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={RoutePermissions.approvals}>
                  <ApprovalPage />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="claimrequest" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={RoutePermissions.claimrequest}>
                  <Request />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="finance" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={RoutePermissions.finance}>
                  <Finance />
                </RoleBasedRoute>
              </UserRoute>
            } />
            <Route path="request-detail/:id" element={
              <UserRoute>
                <RequestDetails />
              </UserRoute>
            } />
            <Route path="profile" element={
              <UserRoute>
                <RoleBasedRoute allowedRoles={RoutePermissions.profile}>
                  <Profile />
                </RoleBasedRoute>
              </UserRoute>
            } />
            {/* <Route path="create-request" element={
              <UserRoute>
                <CreateRequest />
              </UserRoute>
            } /> */}
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
          <Route path='/dashboard/view-claim-request' element={
            <AdminRoute>
              <ViewClaimRequest />
            </AdminRoute>
          } />
          <Route path='/dashboard/profile' element={
            <AdminRoute>
              <AdminRoute>
                <Profile />
              </AdminRoute>
            </AdminRoute>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App; 