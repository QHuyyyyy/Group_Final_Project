
import { Badge, Dropdown, Popover } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import avatar from "../../assets/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    {
      key: "1",
      label: (
        <Link to={`profile`}>
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

  const notifications = [
    { key: "1", message: "📩 There are 2 requests waiting for your approval!!!" },
    
  ];

  const notificationContent = (
    <div className="w-80 p-3 bg-white  rounded-lg">
      <p className="flex justify-center font-semibold text-gray-700">🔔 Notifications</p>
      <div className="mt-2 border-t pt-2 space-y-2">
        {notifications.map((notif) => (
          <div key={notif.key} className="p-2 bg-gray-100 rounded-md">
            {notif.message}
          </div>
        ))}
      </div>
      <div className="mt-2 text-right">
      <button className=" hover:underline" onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-between p-5">
      {/* Icon and user */}
      <div className="flex items-center gap-5 justify-end w-full">
        {/* Notifications */}    
        <Popover
          content={notificationContent}
          trigger="click"
          open={open}  
          onOpenChange={setOpen}  
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Badge count={2} className="cursor-pointer">
            <BellOutlined className="text-2xl" />
          </Badge>
        </Popover>

        {/* User Dropdown */}
        <Dropdown menu={{ items: menu }} trigger={["click"]}>
            <img
              src={avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="cursor-pointer"
            />
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
