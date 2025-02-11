import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
