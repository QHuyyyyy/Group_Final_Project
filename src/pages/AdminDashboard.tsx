import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Cell} from "recharts";
import { Col, Row, Card, Statistic, Tag, Table, List } from "antd"
import { UserOutlined, ProjectOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import AdminSidebar from '../components/AdminSidebar';

interface Claim {
  id: number;
  name: string;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
  claimer: string;
}

const AdminDashboard: React.FC = () => {
  const userStats = 1534;
  const projectStats = 342;
  const claimStats = {
    total: 298,
    pending: 124,
    approved: 84,
    rejected: 32,
    paid: 58,
  };
  const claimsData = [
    { status: "Pending", count: 124 },
    { status: "Approved", count: 84 },
    { status: "Rejected", count: 32 },
    { status: "Paid", count: 58 },
  ];
  const claimCategories = [
    { name: "Employment contracts", value: 40 },
    { name: "Customer complaints", value: 30 },
    { name: "Insurance policies", value: 20 },
    { name: "Other", value: 10 },
  ];
  const recentClaims = [
    { id: 1, name: "Overtime Payment", status: "Pending", claimer: "John Doe" },
    { id: 2, name: "Travel Reimbursement", status: "Approved", claimer: "Jane Smith" },
    { id: 3, name: "Project Bonus", status: "Rejected", claimer: "Alice Johnson" },
    { id: 4, name: "Meal Allowance", status: "Paid", claimer: "Bob Brown" },
  ];
  const recentActivities = [
    { activity: "User John approved a claim", time: "2 hours ago" },
    { activity: "Project Alpha was completed", time: "5 hours ago" },
    { activity: "User Sarah submitted a claim", time: "Yesterday" },
    { activity: "Admin assigned a user to Project Beta", time: "2 days ago" },
  ];
  const projectTrendData = [
    { month: "Jan", projects: 20 },
    { month: "Feb", projects: 30 },
    { month: "Mar", projects: 45 },
    { month: "Apr", projects: 50 },
    { month: "May", projects: 40 },
    { month: "Jun", projects: 55 },
  ];

  const statusColors: Record<Claim["status"], string> = {
    Pending: "gold",
    Approved: "green",
    Rejected: "red",
    Paid: "blue",
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Claim Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Claim["status"]) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    { title: "Claimer", dataIndex: "claimer", key: "claimer" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // colors for pie chart
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
        {/* Stats Section */}
        <Row gutter={[16, 16]}>
          <Col md={8} xs={24}>
            <Card style={{
              backgroundColor:"#138dcf"
            }}>
              <Statistic
                title={<span style={{ color: "white" }}>Total Users</span>}
                className="font-bold"
                value={userStats}
                prefix={<UserOutlined style={{ color: "white" }} />}
                valueStyle={{color:"white"}}
              />
            </Card>
          </Col>

          <Col md={8} xs={24}>
            <Card style={{
              backgroundColor:"#ffb703"
            }}>
              <Statistic
                title={<span style={{ color: "white" }}>Total Claims</span>}
                className="font-bold"
                value={claimStats.total}
                prefix={<FileTextOutlined style={{ color: "white" }} />}
                valueStyle={{color:"white"}}
              />
            </Card>
          </Col>

          <Col md={8} xs={24}>
            <Card style={{
              backgroundColor:"#f25050"
            }}>
              <Statistic
                title={<span style={{ color: "white" }}>Pending Claims</span>}
                className="font-bold"
                value={claimStats.pending}
                prefix={<ClockCircleOutlined style={{ color: "white" }} />}
                valueStyle={{color:"white"}}
              />
            </Card>
          </Col>
        </Row>

        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <Card title="Claim Request Overview">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={claimsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col md={12} xs={24}>
              <Card title="Claims By Category">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={claimCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {claimCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-4">
            <Col md={24} xs={24}>
              <Card title="Recent Claims">
                <Table dataSource={recentClaims} columns={columns} rowKey="id" pagination={false} />
              </Card>
            </Col>        
          </Row>
        </div>
        <Row gutter={[16,16]}>
        <Col md={8} xs={24}>
        <Row gutter={[24,24]} className="mt-4">
        <Col xs={24}>
            <Card>
              <Statistic
                title="Total Projects"
                className="font-bold"
                value={projectStats}
                prefix={<ProjectOutlined style={{ color: "#2196f3" }} />}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card>
              <Statistic
                title="Ongoing Projects"
                className="font-bold"
                value={projectStats}
                prefix={<CheckCircleOutlined style={{ color: "#ded26a" }} />}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card>
              <Statistic
                title="Completed Projects"
                className="font-bold"
                value={projectStats}
                prefix={<CheckOutlined style={{ color: "#53d459" }} />}
              />
            </Card>
          </Col>
        </Row>
        </Col>
        {/* Project Trends Chart */}
        <Col md={16} xs={24}>
        <div className="mt-4">
          <Card title="Monthly Newly Started Project" className="text-3xl">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#555" }} />
                <YAxis tick={{ fontSize: 14, fill: "#555" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="projects" fill="#4caf50" barSize={40} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div> 
        </Col>
        </Row> 
        <div className="mt-4">
              <Card title="Recent Activities">
                <List dataSource={recentActivities} renderItem={(item: any) => (
                  <List.Item><List.Item.Meta title={item.activity} description={item.time} />
                  </List.Item>
                )} />
              </Card>
            </div>
      </div>
      </div>
  );
};

export default AdminDashboard;
