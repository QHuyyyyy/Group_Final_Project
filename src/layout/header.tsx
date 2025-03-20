import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useUserStore } from "../stores/userStore";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isShow, setIsShow] = useState(false);
  const [isShowUserD, setIsShowUserD] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const user = useUserStore((state) => state);
  const {token} = useAuth();
  const role = user.role_code;

  useEffect(() => {
    if (role == "A001") {
      setIsShow(true);
    }
    if (role === "A002" || role === "A003" || role === "A004") {
      setIsShowUserD(true);
    }

    // Thêm event listener cho scroll
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [role]);

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg backdrop-blur-lg bg-opacity-80' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className={`text-2xl font-bold ${
            isScrolled ? 'text-gray-800' : 'text-white'
          }`}>
            ClaimRequest
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/aboutus', label: 'About' },
              { path: '/services', label: 'Services' },
              { path: '/industries', label: 'Industries' },
              { path: '/contactus', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-all duration-300 hover:text-amber-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isShow && (
              <Link
                to="/dashboard"
                className={`font-medium transition-all duration-300 hover:text-amber-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
            {isShowUserD && (
              <Link
                to="/userdashboard/profile"
                className={`font-medium transition-all duration-300 hover:text-amber-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                UserDashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-2 cursor-pointer"
                 onClick={() => navigate("/userdashboard/profile")}>
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className={`border-2 ${
                      isScrolled ? 'border-gray-300' : 'border-white'
                    } shadow-md`}
                  />
                  <span className={`font-medium ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    {user.user_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? 'bg-white text-black border border-black hover:bg-gray-100'
                    : 'bg-white/20 text-white border-white hover:bg-white/30 '
                }`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;