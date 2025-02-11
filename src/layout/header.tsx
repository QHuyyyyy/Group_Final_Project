import { useNavigate } from "react-router-dom";
import { UserAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();

  return (
    <div className="bg-black shadow-md w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white">
          ClaimRequest
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-amber-700">About</a>
          <a href="#" className="text-white hover:text-amber-700">Services</a>
          <a href="#" className="text-white hover:text-amber-700">Industries</a>
          <a href="#" className="text-white hover:text-amber-700">Careers</a>
          <a href="#" className="text-white hover:text-amber-700">Contact</a>
        </div>
        {/* Login Button */}
        <div>
          {user ? (
            <div className="flex items-center">
              <div onClick={() => navigate('/profile')} className="flex items-center space-x-2">
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                <span className="text-white font-semibold text-lg">{user.displayName}</span>
              </div>
              <button 
                onClick={logOut} 
                className="ml-4 bg-white text-black border px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-black border px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition-colors">
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
