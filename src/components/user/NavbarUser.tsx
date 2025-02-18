
import { Badge, Dropdown, MenuProps } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import avatar from "../../assets/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/userdashboard/profile">
          <UserOutlined className="pr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: "22",
      label: (
        <span onClick={handleLogout} className="cursor-pointer">
          <LogoutOutlined className="pr-2" />
          Logout
        </span>
      ),
    },
  ];

  const notifications: MenuProps["items"] = [
    { key: "1", label: "There are 2 requests waiting for your approval!!!" },
  ];

  return (
    <div className="flex items-center justify-between p-5">
      {/* Icon and user */}
      <div className="flex items-center gap-5 justify-end w-full">
        {/* Notifications */}
        <Dropdown menu={{ items: notifications }} trigger={["click"]}>
          <Badge count={2} className="cursor-pointer">
            <BellOutlined className="text-2xl" />
          </Badge>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown menu={{ items: menu }} trigger={["click"]}>
          <div>
            <img
              src={avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="cursor-pointer"
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
