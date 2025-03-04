import { Card,  Badge, Statistic, Row, Col, Avatar } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileProtectOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Menu from '../../components/user/Menu';
import NavbarAdminDashboard from '../../components/NavbarAdminDashboard';
import { useUserStore } from '../../stores/userStore';
import { useRoleMapping } from '../../hooks/useRoleMapping';
import { useApiStore } from '../../stores/apiStore';
import { employeeService } from '../../services/employeeService';
import { useEffect, useState } from 'react';


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
  updated_by?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Remove the mock data
const claimStats: ClaimStats = {
  totalClaims: 0,
  pendingClaims: 0,
  approvedClaims: 0,
  rejectedClaims: 0
};

const Profile = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/dashboard/profile';
  const { getRoleName } = useRoleMapping();
  const {isLoading} = useApiStore()
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  // Add state for projects


  // const [dataLoaded, setDataLoaded] = useState({
  //   employeeData:false
  // })
  // const [isLoad, setIsLoad] = useState(true)
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

  // Format date helper function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format salary with commas
  const formatSalary = (salary: number | undefined) => {
    if (!salary) return 'N/A';
    return salary.toLocaleString() + ' VND';
  };
  // useEffect(() => {
  //     const allDataLoaded = Object.values(dataLoaded).every(status => status === true);
  //     if (allDataLoaded) {
  //       setIsLoad(false);
  //     }
  //   }, [dataLoaded]);
    // const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
    // if (isLoad) {
    //   return (
    //     <Layout style={{ 
    //       height: "100vh", 
    //       display: "flex", 
    //       justifyContent: "center", 
    //       alignItems: "center",
    //       background: "#f0f2f5"
    //     }}>
    //       <div style={{ textAlign: "center" }}>
    //         <Spin indicator={loadingIcon} />
    //         <h2 style={{ marginTop: 20, color: "#1890ff" }}>Loading Profile...</h2>
    //         <p style={{ color: "#8c8c8c" }}>Please wait</p>
    //       </div>
    //     </Layout>
    //   );
    // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {isAdminDashboard ? (
        <>
          <AdminSidebar />
          <div className="flex-1 ml-64">
            <div className="fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-sm z-50">
              <NavbarAdminDashboard />
            </div>
            <div className="p-8 mt-20">
              {/* Profile content wrapper */}
              <div className="max-w-7xl mx-auto">
                <Row gutter={[24, 24]}>
                  {/* Left Column - Personal Info */}
                  <Col xs={24} md={8}>
                    <Card className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="text-center mb-8">
                        <div className="relative inline-block">
                          <Avatar 
                            size={140} 
                            src={employeeData?.avatar_url}
                            icon={!employeeData?.avatar_url && <UserOutlined />} 
                            className="ring-4 ring-white shadow-xl"
                          />
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <Badge 
                              status="success"
                              text={isLoading ? 'Loading...' : getRoleName(user.role_code)}
                              className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100" 
                            />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold mt-6 mb-1 text-gray-800">{employeeData?.full_name || user.user_name}</h2>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-4">
                        {[
                          { label: "Email", value: user.email, icon: <MailOutlined className="text-blue-500" /> },
                          { label: "Phone", value: employeeData?.phone, icon: <PhoneOutlined className="text-green-500" /> },
                          { label: "Department", value: employeeData?.department_name, icon: <TeamOutlined className="text-purple-500" /> },
                          { label: "Job Rank", value: employeeData?.job_rank, icon: <BankOutlined className="text-indigo-500" /> },
                          { label: "Address", value: employeeData?.address, icon: <EnvironmentOutlined className="text-red-500" /> },
                          { label: "Start Date", value: formatDate(employeeData?.start_date), icon: <CalendarOutlined className="text-orange-500" /> },
                          { label: "End Date", value: formatDate(employeeData?.end_date), icon: <CalendarOutlined className="text-yellow-500" /> },
                          { label: "Salary", value: formatSalary(employeeData?.salary), icon: <DollarOutlined className="text-emerald-500" /> },
                          { label: "Contract", value: employeeData?.contract_type, icon: <FileProtectOutlined className="text-cyan-500" /> }
                        ].map(item => (
                          <div key={item.label} className="flex items-center p-4 bg-gray-50/70 rounded-xl hover:bg-gray-50 transition-colors">
                            {item.icon}
                            <span className="text-gray-600 w-28 font-medium ml-2">{item.label}:</span>
                            <span className="text-gray-800 flex-1">{item.value || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>

                  {/* Right Column - Stats & Activities */}
                  <Col xs={24} md={16}>
                    <div className="space-y-6">
          
                  

                      {/* Statistics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <Statistic 
                            title={<span className="text-gray-600 font-medium">Total Requests</span>}
                            value={claimStats.totalClaims}
                            prefix={<FileTextOutlined className="text-blue-500" />}
                            className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-gray-800"
                          />
                        </Card>

                        <Card className="rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <Statistic 
                            title={<span className="text-gray-600 font-medium">Pending Requests</span>}
                            value={claimStats.pendingClaims}
                            prefix={<ClockCircleOutlined className="text-amber-500" />}
                            className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-gray-800"
                          />
                        </Card>
                      </div>

                      {/* Requests Summary */}
                      <Card 
                        title={<span className="text-xl font-bold">Request Summary</span>}
                        className="rounded-xl border-0 shadow-md"
                        extra={
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                            View All
                          </button>
                        }
                      >
                        <div className="space-y-3">
                          {Object.entries(claimStats).map(([key, value]) => (
                            <div key={key} 
                                 className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                              <span className="capitalize text-gray-700 font-medium">
                                {key.replace('Claims', '')} Requests
                              </span>
                              <Badge 
                                count={value} 
                                className={`px-4 py-1 rounded-full ${
                                  key === 'pendingClaims' ? 'bg-amber-500' :
                                  key === 'approvedClaims' ? 'bg-emerald-500' :
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
      ) : (
        <>
  
            <Menu />
        
          <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA]">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-6xl mx-auto space-y-8 p-8">
                <Row gutter={[24, 24]}>
                  {/* Personal Information */}
                  <Col xs={24} md={8}>
                    <Card className="shadow-lg rounded-2xl overflow-hidden border-0">
                      <div className="text-center mb-8">
                        <div className="relative inline-block">
                          <Avatar 
                            size={130} 
                            src={employeeData?.avatar_url}
                            icon={!employeeData?.avatar_url && <UserOutlined />} 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl"
                          />
                        </div>
                        <h2 className="text-2xl font-bold mt-4 mb-1 text-gray-800">{employeeData?.full_name || user.user_name}</h2>
                        <p className="text-gray-500 font-medium">{employeeData?.job_rank || 'Employee'}</p>
                        <Badge 
                          status="processing" 
                          text={isLoading ? 'Loading...' : getRoleName(user.role_code)}
                          className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full" 
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
                          <span className="text-gray-800 font-medium">{formatDate(employeeData?.start_date)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">End Date:</span>
                          <span className="text-gray-800 font-medium">{formatDate(employeeData?.end_date)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Salary:</span>
                          <span className="text-gray-800 font-medium">{formatSalary(employeeData?.salary)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Contract:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.contract_type || 'N/A'}</span>
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
                        title={<span className="flex items-center gap-2">
                          <CreditCardOutlined className="text-blue-500" /> Payment Method
                        </span>}
                        className="shadow-md rounded-xl border-0"
                        extra={<button className="text-blue-500 hover:text-blue-700">Edit</button>}
                      >
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">Active Account</p>
                              <p className="text-gray-500 text-sm mt-1">{employeeData?.account || 'N/A'}</p>
                            </div>
                          
                          </div>
                        </div>
                      </Card>

                      {/* Requests */}
                      <Card 
                        title={<span className="flex items-center gap-2">
                          <FileTextOutlined className="text-blue-500" /> My Requests
                        </span>}
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