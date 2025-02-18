import { Card,  Badge, Statistic, Row, Col, Avatar } from 'antd';
import { UserOutlined,  ClockCircleOutlined,FileTextOutlined } from '@ant-design/icons';


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

export default function Profile() {
  return (
    <>
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
                    <span className="text-gray-800 font-medium">{staffData.phone}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 w-24">Department:</span>
                    <span className="text-gray-800 font-medium">{staffData.department}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 w-24">ID:</span>
                    <span className="text-gray-800 font-medium">{staffData.id}</span>
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
    </>
  );
}