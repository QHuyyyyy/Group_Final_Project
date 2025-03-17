import { Badge, Dropdown, Popover, Row, Col } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import avatar from "../../assets/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { claimService } from "../../services/claim.service";
import { useUserStore } from "../../stores/userStore";
import { Claim } from "../../models/ClaimModel";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useUserStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{key: string; message: string; timestamp: string}>>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchPendingClaims = async () => {
      if (user?.role_code === 'A003') {
        try {
          const response = await claimService.searchClaims({
            searchCondition: {
              claim_status: 'Pending Approval',
              is_delete: false
            },
            pageInfo: {
              pageSize: 10,
              pageNum: 1
            }
          });
          
          const pendingClaims = response.data.pageData;
          
          // Nhóm các claim theo staff_name
          const groupedClaims = pendingClaims.reduce((acc: { [key: string]: number }, claim: Claim) => {
            acc[claim.staff_name] = (acc[claim.staff_name] || 0) + 1;
            return acc;
          }, {});

          // Tạo thông báo tổng hợp
          const newNotifications = Object.entries(groupedClaims).map(([staffName, count]) => ({
            key: staffName,
            message: `⬇️ ${count} claim requests from ${staffName} need to be action`,
            timestamp: new Date().toISOString(), // Sử dụng thời gian hiện tại cho thông báo nhóm
          }));
          
          setNotifications(newNotifications);
          setNotificationCount(pendingClaims.length); // Vẫn giữ tổng số claim trong badge
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchPendingClaims();
  }, [user]);

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
        <Link to="/userdashboard/settinguser">
          <SettingOutlined className="pr-2" />
          Settings
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={handleLogout} className="cursor-pointer">
          <LogoutOutlined className="pr-2" />
          Logout
        </span>
      ),
    },
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
    <div className="flex justify-between items-center bg-white dark:text-white px-6 py-3 shadow-md">
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            {user?.role_code === 'A003' && (
              <Popover
                content={notificationContent}
                trigger="click"
                open={open}  
                onOpenChange={setOpen}  
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Badge count={notificationCount} className="cursor-pointer">
                  <BellOutlined className="text-xl" />
                </Badge>
              </Popover>
            )}
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