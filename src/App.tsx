import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './routes/AdminRoute';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/dashboard' element={
            <AdminRoute>
           <AdminDashboard/>
           </AdminRoute>
            } />
        </Routes>
      </Router>
    </>
  );
};

export default App;
