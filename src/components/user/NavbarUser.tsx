import { Badge, Dropdown, Popover, Row, Col } from "antd";
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
        <Link to="/userdashboard/profile">
          <UserOutlined className="pr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: "2",
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
    <div className="w-80 p-3 bg-white rounded-lg">
      <p className="flex justify-center font-semibold text-gray-700">🔔 Notifications</p>
      <div className="mt-2 border-t pt-2 space-y-2">
        {notifications.map((notif) => (
          <div key={notif.key} className="p-2 bg-gray-100 rounded-md">
            {notif.message}
          </div>
        ))}
      </div>
      <div className="mt-2 text-right">
        <button className="hover:underline" onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 shadow-md">
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Popover
              content={notificationContent}
              trigger="click"
              open={open}  
              onOpenChange={setOpen}  
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Badge count={2} className="cursor-pointer">
                <BellOutlined className="text-xl" />
              </Badge>
            </Popover>
          </Col>

          <Col>
            <Dropdown menu={{ items: menu }} trigger={["click"]}>
              <img
                src={avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="cursor-pointer rounded-full"
              />
            </Dropdown>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Navbar;