import { Card,  Badge, Statistic, Row, Col, Avatar, Spin, Layout } from 'antd';
import { UserOutlined,  ClockCircleOutlined,FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Menu from '../../components/user/Menu';
import NavbarAdminDashboard from '../../components/NavbarAdminDashboard';
import { useUserStore } from '../../stores/userStore';
import { useRoleMapping } from '../../hooks/useRoleMapping';
import { useApiStore } from '../../stores/apiStore';
import { employeeService } from '../../services/employeeService';
import { useEffect, useState } from 'react';

interface Staff {
  id: string;
  name: string;
  department: string;
  rank: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  projects: string[];
  projectRoles: string[];
}

interface ClaimStats {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
}

interface Employee {
  _id: string;
  user_id: string;
  job_rank: string;
  contract_type: string;
  account: string;
  address: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  department_name: string;
  salary: number;
  start_date: string;
  end_date: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Mock data - replace with actual API calls
const staffData: Staff = {
  id: "EMP001",
  name: "John Doe",
  department: "Engineering",
  rank: "Senior Developer",
  role: "Staff",
  email: "john.doe@company.com",
  phone: "+84 123 456 789",
  salary: 2000,
  projects: ["Project Alpha", "Project Beta"],
  projectRoles: ["Developer", "Tech Lead"]
};

const claimStats: ClaimStats = {
  totalClaims: 15,
  pendingClaims: 2,
  approvedClaims: 12,
  rejectedClaims: 1
};

const Profile = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/dashboard/profile';
  const { getRoleName } = useRoleMapping();
  const {isLoading} = useApiStore()
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [dataLoaded, setDataLoaded] = useState({
    employeeData:false
  })
  const [isLoad, setIsLoad] = useState(true)
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await employeeService.getEmployeeById(user.id);
        setEmployeeData(data);
        setDataLoaded(prev => ({ ...prev, employeeData: true }));
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setDataLoaded(prev => ({ ...prev, employeeData: true }));
      }
    };

    if (user.id) {
      fetchEmployeeData();
    }
  }, [user.id]);
  useEffect(() => {
      const allDataLoaded = Object.values(dataLoaded).every(status => status === true);
      if (allDataLoaded) {
        setIsLoad(false);
      }
    }, [dataLoaded]);
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
    if (isLoad) {
      return (
        <Layout style={{ 
          height: "100vh", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          background: "#f0f2f5"
        }}>
          <div style={{ textAlign: "center" }}>
            <Spin indicator={loadingIcon} />
            <h2 style={{ marginTop: 20, color: "#1890ff" }}>Loading Profile...</h2>
            <p style={{ color: "#8c8c8c" }}>Please wait</p>
          </div>
        </Layout>
      );
    }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isAdminDashboard ? (
        <>
          <AdminSidebar />
          <div className="flex-1 ml-64 bg-[#F7F8FA]">
            <div className="fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-md z-50">
              <NavbarAdminDashboard />
            </div>
            <div className="p-8 mt-16">
              {/* Profile content */}
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-6xl mx-auto space-y-8">
                  <Row gutter={[24, 24]}>
                    {/* Personal Information */}
                    <Col xs={24} md={8}>
                      <Card className="shadow-lg rounded-2xl overflow-hidden border-0">
                        <div className="text-center mb-8">
                          <div className="relative inline-block">
                            <Avatar 
                              size={130} 
                              icon={<UserOutlined />} 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl"
                            />
                           
                          </div>
                          <h2 className="text-2xl font-bold mt-4 mb-1 text-gray-800">{user.user_name}</h2>
                          <p className="text-gray-500 font-medium">{user.email}</p>
                          <Badge 
                            status="processing" 
                            text={isLoading ? 'Loading...' : getRoleName(user.role_code)}
                            className="mt-3  bg-blue-50 text-blue-600 " 
                          />
                        </div>
                        
                        <div className="space-y-6">
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Email:</span>
                            <span className="text-gray-800 font-medium">{user.email}</span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Phone:</span>
                            <span className="text-gray-800 font-medium">{employeeData?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Department:</span>
                            <span className="text-gray-800 font-medium">{employeeData?.department_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Job Rank:</span>
                            <span className="text-gray-800 font-medium">{employeeData?.job_rank || 'N/A'}</span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Address:</span>
                            <span className="text-gray-800 font-medium">{employeeData?.address || 'N/A'}</span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 w-24">Start Date:</span>
                            <span className="text-gray-800 font-medium">
                              {employeeData?.start_date ? new Date(employeeData.start_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-gray-800 mb-4">My Projects</h3>
                          <div className="space-y-4">
                            {staffData.projects.map((project, index) => (
                              <div key={project} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium text-gray-800">{project}</h4>
                                    <p className="text-sm text-gray-500">Role: {staffData.projectRoles[index]}</p>
                                  </div>
                                  <Badge 
                                    status="processing" 
                                    text="Active"
                                    className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full" 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* Cột bên phải */}
                    <Col xs={24} md={16}>
                      <div className="space-y-12">
                        {/* Statistics */}
                        <div className="space-y-4">
                          <Card className="shadow-md rounded-xl border-0">
                            <Statistic 
                              title="Total Requests" 
                              value={claimStats.totalClaims}
                              prefix={<FileTextOutlined className="text-blue-500" />}
                            />
                          </Card>

                          <Card className="shadow-md rounded-xl border-0">
                            <Statistic 
                              title="Pending Requests" 
                              value={claimStats.pendingClaims}
                              prefix={<ClockCircleOutlined className="text-yellow-500" />}
                            />
                          </Card>
                        </div>

                        {/* Account */}
                       

                        {/* Requests */}
                        <Card 
                          title="My Requests" 
                          className="shadow-md rounded-xl border-0"
                          extra={<button className="text-blue-500 hover:text-blue-700">Filter</button>}
                        >
                          <div className="space-y-4">
                            {Object.entries(claimStats).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <span className="capitalize text-gray-700">{key.replace('Claims', '')} request</span>
                                <Badge 
                                  count={value} 
                                  className={`px-3 py-1 rounded-full ${
                                    key === 'pendingClaims' ? 'bg-yellow-500' :
                                    key === 'approvedClaims' ? 'bg-green-500' :
                                    key === 'rejectedClaims' ? 'bg-red-500' :
                                    'bg-blue-500'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
  
            <Menu />
        
          <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA]">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-6xl mx-auto space-y-8">
                <Row gutter={[24, 24]}>
                  {/* Personal Information */}
                  <Col xs={24} md={8}>
                    <Card className="shadow-lg rounded-2xl overflow-hidden border-0">
                      <div className="text-center mb-8">
                        <div className="relative inline-block">
                          <Avatar 
                            size={130} 
                            icon={<UserOutlined />} 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl"
                          />
                         
                        </div>
                        <h2 className="text-2xl font-bold mt-4 mb-1 text-gray-800">{staffData.name}</h2>
                        <p className="text-gray-500 font-medium">{staffData.rank}</p>
                        <Badge 
                          status="processing" 
                          text={staffData.role}
                          className="mt-3  bg-blue-50 text-blue-600 " 
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Email:</span>
                          <span className="text-gray-800 font-medium">{staffData.email}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Phone:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Department:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.department_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Job Rank:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.job_rank || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Address:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.address || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Start Date:</span>
                          <span className="text-gray-800 font-medium">
                            {employeeData?.start_date ? new Date(employeeData.start_date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">My Projects</h3>
                        <div className="space-y-4">
                          {staffData.projects.map((project, index) => (
                            <div key={project} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-gray-800">{project}</h4>
                                  <p className="text-sm text-gray-500">Role: {staffData.projectRoles[index]}</p>
                                </div>
                                <Badge 
                                  status="processing" 
                                  text="Active"
                                  className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* Cột bên phải */}
                  <Col xs={24} md={16}>
                    <div className="space-y-12">
                      {/* Statistics */}
                      <div className="space-y-4">
                        <Card className="shadow-md rounded-xl border-0">
                          <Statistic 
                            title="Total Requests" 
                            value={claimStats.totalClaims}
                            prefix={<FileTextOutlined className="text-blue-500" />}
                          />
                        </Card>

                        <Card className="shadow-md rounded-xl border-0">
                          <Statistic 
                            title="Pending Requests" 
                            value={claimStats.pendingClaims}
                            prefix={<ClockCircleOutlined className="text-yellow-500" />}
                          />
                        </Card>
                      </div>

                      {/* Account */}
                      <Card 
                        title="Payment Method" 
                        className="shadow-md rounded-xl border-0"
                        extra={<button className="text-blue-500 hover:text-blue-700">Edit</button>}
                      >
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">Active Account</p>
                              <p className="text-gray-500 text-sm mt-1">{staffData.id}</p>
                            </div>
                          
                          </div>
                        </div>
                      </Card>

                      {/* Requests */}
                      <Card 
                        title="My Requests" 
                        className="shadow-md rounded-xl border-0"
                        extra={<button className="text-blue-500 hover:text-blue-700">Filter</button>}
                      >
                        <div className="space-y-4">
                          {Object.entries(claimStats).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                              <span className="capitalize text-gray-700">{key.replace('Claims', '')} request</span>
                              <Badge 
                                count={value} 
                                className={`px-3 py-1 rounded-full ${
                                  key === 'pendingClaims' ? 'bg-yellow-500' :
                                  key === 'approvedClaims' ? 'bg-green-500' :
                                  key === 'rejectedClaims' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;