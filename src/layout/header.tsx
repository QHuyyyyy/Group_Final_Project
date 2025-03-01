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
  }, [role]);

  return (
    <div className="bg-black shadow-md w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white">ClaimRequest</div>
        {/* Navigation Links */}
        <div className="flex space-x-4">

          <a href="/" className="text-white hover:text-amber-700"/>

          <a href="/aboutus" className="text-white hover:text-amber-700">

            About
          </a>
          <a href="/services" className="text-white hover:text-amber-700">
            Services
          </a>

          <a href="/industries" className="text-white hover:text-amber-700">
            Industries
          </a>
                 
          <a href="/contactus" className="text-white hover:text-amber-700">
            Contact
          </a>
          {isShow && (
            <Link to="/dashboard" className="text-white hover:text-amber-700">
              Dashboard
            </Link>
          )}
          {isShowUserD && (
            <Link
              to="/userdashboard/profile"
              className="text-white hover:text-amber-700"
            >
              UserDashboard
            </Link>
          )}
        </div>
        {/* Login Button */}
        <div>
          {token ? (
            <div className="flex items-center">
              <div
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="border-2 border-white shadow-md"
                />
                <span className="text-white font-semibold text-lg mr-4">
                  {user.user_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 bg-white text-black border px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black border px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;