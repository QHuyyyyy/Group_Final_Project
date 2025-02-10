import { Card, Descriptions, Badge, Statistic, Row, Col, Avatar } from 'antd';
import { UserOutlined, ProjectOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';

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
  role: "Claimer",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Basic Information Card */}
        <Card 
          className="shadow-lg dark:bg-slate-800"
          title={
            <div className="flex items-center space-x-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{staffData.name}</h2>
                <p className="text-slate-500 dark:text-slate-400">{staffData.rank}</p>
              </div>
            </div>
          }
        >
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            <Descriptions.Item label="Employee ID">{staffData.id}</Descriptions.Item>
            <Descriptions.Item label="Department">{staffData.department}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Badge status="processing" text={staffData.role} />
            </Descriptions.Item>
            <Descriptions.Item label="Email">{staffData.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{staffData.phone}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Projects Card */}
        <Card 
          className="shadow-lg dark:bg-slate-800"
          title={<span className="flex items-center"><ProjectOutlined className="mr-2" />Projects</span>}
        >
          <Row gutter={[16, 16]}>
            {staffData.projects.map((project, index) => (
              <Col xs={24} sm={12} key={project}>
                <Card className="bg-blue-50 dark:bg-slate-700">
                  <h3 className="font-semibold dark:text-white">{project}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{staffData.projectRoles[index]}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Claims Statistics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center shadow-lg dark:bg-slate-800">
              <Statistic 
                title="Total Claims"
                value={claimStats.totalClaims}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center shadow-lg dark:bg-slate-800">
              <Statistic 
                title="Pending Claims"
                value={claimStats.pendingClaims}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center shadow-lg dark:bg-slate-800">
              <Statistic 
                title="Approved Claims"
                value={claimStats.approvedClaims}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center shadow-lg dark:bg-slate-800">
              <Statistic 
                title="Rejected Claims"
                value={claimStats.rejectedClaims}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Salary Information (if visible) */}
        <Card 
          className="shadow-lg dark:bg-slate-800"
          title={<span className="flex items-center"><DollarOutlined className="mr-2" />Salary Information</span>}
        >
          <Descriptions bordered>
            <Descriptions.Item label="Base Salary">
              ${staffData.salary.toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
