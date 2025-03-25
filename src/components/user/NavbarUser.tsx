import { Badge, Dropdown, Popover, Row, Col, Avatar } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { claimService } from "../../services/claim.service";
import { useUserStore } from "../../stores/userStore";
import { Claim } from "../../models/ClaimModel";
import { employeeService } from "../../services/employee.service";
import { Employee } from "../../models/EmployeeModel";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useUserStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{key: string; message: string; timestamp: string}>>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await employeeService.getEmployeeById(user.id);
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (user.id) {
      fetchEmployeeData();
    }
  }, [user.id]);

  useEffect(() => {
    const fetchClaims = async () => {
      if (user?.role_code === 'A003' || user?.role_code === 'A002') {
        try {
          let claims: Claim[] = [];
          
          if (user?.role_code === 'A003') {
            const response = await claimService.searchClaimsForApproval({
              searchCondition: {
                claim_status: 'Pending Approval',
                is_delete: false
              },
              pageInfo: {
                pageSize: 100,
                pageNum: 1
              }
            });
            claims = response.data.pageData.filter(claim => 
              claim.approval_info && claim.approval_info._id === user.id
            );
          } else if (user?.role_code === 'A002') {
            const response = await claimService.searchClaimsForFinance({
              searchCondition: {
                claim_status: 'Approved',
                is_delete: false
              },
              pageInfo: {
                pageSize: 100,
                pageNum: 1
              }
            });
            claims = response.data.pageData;
          }
          
          // Group claims by staff_name
          const groupedClaims = claims.reduce((acc: { [key: string]: number }, claim: Claim) => {
            acc[claim.staff_name] = (acc[claim.staff_name] || 0) + 1;
            return acc;
          }, {});

          // Create grouped notifications
          const newNotifications = Object.entries(groupedClaims).map(([staffName, count]) => ({
            key: staffName,
            message: user?.role_code === 'A003' 
              ? `⬇️ ${count} claim requests from ${staffName} need to be action`
              : `✅ ${count} approved claims from ${staffName}`,
            timestamp: new Date().toISOString(),
          }));
          
          setNotifications(newNotifications);
          setNotificationCount(claims.length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchClaims();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    {
      key: "1",
      label: (
        <Link to="/userdashboard/userprofile">
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
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.key} className="p-2 bg-gray-100 rounded-md">
              {notif.message}
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-gray-500">No notifications</div>
        )}
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
            {(user?.role_code === 'A003' || user?.role_code === 'A002') && (
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
              <Avatar
                src={employeeData?.avatar_url}
                icon={!employeeData?.avatar_url && <UserOutlined />}
                alt="User Avatar"
                size={40}
                className="cursor-pointer"
              />
            </Dropdown>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Navbar;