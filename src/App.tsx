import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AboutUs from './pages/AboutUs';
import Services from './pages/user/Services';
import ContactUs from './pages/Contactus';
import VerifyToken from './pages/common/VerifyToken';
import ResendToken from './pages/common/ResendToken';
import ProtectedRoute from './routes/ProtectedRoute';
import { RoutePermissions } from './routes/RoutePermissions';
import SettingUser from './pages/user/SettingUser';
import ForgotPassword from './pages/common/ForgotPassword';
import NotFound from './pages/NotFound';

// Lazy load components
const Homepage = lazy(() => import('./pages/Homepage'));
const Login = lazy(() => import('./pages/common/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjectManager = lazy(() => import('./pages/admin/AdminProjectManager'));
const AdminUserManager = lazy(() => import('./pages/admin/AdminUserManager'));
const UserDashBoard = lazy(() => import('./pages/user/UserDashboard'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const ApprovalPage = lazy(() => import('./pages/user/Approval'));
const Claim = lazy(() => import('./pages/user/Request'));
const Finance = lazy(() => import('./pages/user/Finance'));
const IndustriesPage = lazy(() => import('./pages/InductriesPage'));
const ViewClaimRequest = lazy(() => import('./pages/admin/ViewClaimRequest'));
const Project= lazy(() => import('./pages/user/Project'));
const UserSpinner = lazy(() => import('./components/user/UserSpinner'));
const Loading = () => (
  <UserSpinner />
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
          <Route path='/verify-email/:token' element={<VerifyToken />} />
          <Route path='/resend-token' element={<ResendToken />} />
          <Route path="*" element={<NotFound />} />
          {/* User Dashboard Routes */}
          <Route path='/userdashboard/' element={
            <ProtectedRoute allowedRoles={RoutePermissions.user}>
              <UserDashBoard />
            </ProtectedRoute>
          }>
            <Route path="userprofile" element={
              <ProtectedRoute allowedRoles={RoutePermissions.user}>
                <UserProfile />
              </ProtectedRoute>
            } />
          
            <Route path="approvals" element={
              <ProtectedRoute allowedRoles={RoutePermissions.approvals}>
                <ApprovalPage />
              </ProtectedRoute>
            } />
            <Route path="claimrequest" element={
              <ProtectedRoute allowedRoles={RoutePermissions.claimrequest}>
                <Claim />
              </ProtectedRoute>
            } />
            <Route path="finance" element={
              <ProtectedRoute allowedRoles={RoutePermissions.finance}>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path='settinguser' element={
            <ProtectedRoute allowedRoles={RoutePermissions.user} redirectPath="/">
              <SettingUser />
            </ProtectedRoute>
          } />
              <Route path='/userdashboard/projects' element={
            <ProtectedRoute allowedRoles={RoutePermissions.user} redirectPath="/">
              <Project />
            </ProtectedRoute>
          } />
            {/* <Route path="create-request" element={
              <UserRoute>
                <CreateRequest />
              </UserRoute>
            } /> */}
          </Route>

          {/* Admin Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute allowedRoles={RoutePermissions.admin} redirectPath="/">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path='/dashboard/project-manager' element={
            <ProtectedRoute allowedRoles={RoutePermissions.admin} redirectPath="/">
              <AdminProjectManager />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/user-manager' element={
            <ProtectedRoute allowedRoles={RoutePermissions.admin} redirectPath="/">
              <AdminUserManager />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/view-claim-request' element={
            <ProtectedRoute allowedRoles={RoutePermissions.admin} redirectPath="/">
              <ViewClaimRequest />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/adminprofile' element={
            <ProtectedRoute allowedRoles={RoutePermissions.admin} redirectPath="/">
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App; 