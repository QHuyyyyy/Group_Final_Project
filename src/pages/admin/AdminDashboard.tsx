import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Cell, LineChart, Line } from "recharts";
import { Col, Row, Card, Statistic, Tag, Table, List, Pagination,  Select, Dropdown } from "antd"
import { UserOutlined, ProjectOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CheckOutlined, LogoutOutlined } from '@ant-design/icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import dayjs from "dayjs"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import avatar from "../../assets/avatar.png";
import { claimService } from "../../services/claimService";
import { projectService } from "../../services/projectService";
import { userService } from "../../services/userService";

interface Claim {
  id: number;
  name: string;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
  claimer: string;
}

interface Claims {
  _id: string;
  user_id: string;
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}


interface ProjectMember {
  user_id: string;
  project_role: string;
}


interface Projects{
  project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
}

interface ClaimData {
  status: string;
  count: number;
  date?: string;
}

const { Option } = Select
const AdminDashboard: React.FC = () => {
  
  const claimCategories = [
    { name: "HR", value: 40 },
    { name: "IT", value: 30 },
    { name: "Finance", value: 20 },
    { name: "Sales", value: 10 },
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

  const financialData = [
    { month: "Jan", Projects: 50 },
    { month: "Feb", Projects: 70 },
    { month: "Mar", Projects: 80 },
    { month: "Apr", Projects: 75 },
    { month: "May", Projects: 90 },
    { month: "Jun", Projects: 85 },
  ];

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

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menu = [
    {
      key: "1",
      label: (
        <Link to="/dashboard/profile">
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

  
  const [claims, setClaims] = useState<Claims[]>([]);
  const [pendingClaims, setPendingClaims] = useState<Claims[]>([]);

  const claimsData: ClaimData[] = [
    { status: "Pending", count: pendingClaims.length, date: "2024-03-25" },
    { status: "Approved", count: 84, date: "2024-03-24" },
    { status: "Rejected", count: 32, date: "2024-03-23" },
    { status: "Paid", count: 58, date: "2024-03-22" },
  ];

  const [projects, setProjects] = useState<Projects[]>([]);
  const [users, setUsers] = useState([])
  const [filteredClaimData, setFilteredClaimData] = useState<ClaimData[]>(claimsData);
  console.log(filteredClaimData)
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  {/*lấy data của claims*/}
  useEffect(() => {   
    const fetchClaims = async () => {
      try {
        const params = {
          searchCondition: {
            keyword: "",
            claim_start_date: "",
            claim_end_date: "",
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        };
        const data = await claimService.getAllClaims(params);
        setClaims(data.pageData);      
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
    fetchClaims();

    const fetchPendingClaims = async () => {
      try {
        const params = {
          searchCondition: {
            keyword: "",
            claim_status: "Pending Approval",
            claim_start_date: "",
            claim_end_date: "",
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        };
        const data = await claimService.getAllClaims(params);
        setPendingClaims(data.pageData);      
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
    fetchPendingClaims();


  }, []);
  console.log(claims)



  console.log(pendingClaims)
  
  {/*lấy data của Projects*/}
  useEffect(() => {   
    const fetchProjects = async () => {
      try {
        const params = {
          searchCondition: {
            keyword: "",
            claim_start_date: "",
            claim_end_date: "",
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        };
        const data = await projectService.searchProjects(params);
        setProjects(data.pageData);      
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
    fetchProjects();
  }, []);

  console.log(projects)

  {/*lấy data của Users*/}
  useEffect(() => {   
    const fetchUsers = async () => {
      try {
        const params = {
          searchCondition: {
            keyword: "",
            claim_start_date: "",
            claim_end_date: "",
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        };
        const data = await userService.searchUsers(params);
        console.log(data)
        setUsers(data.pageData);      
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
    fetchUsers();
  }, []);

  console.log(users)
  const handleFilterChange = (value: string) => {
    setSelectedRange(value);

    let startDate, endDate;
    const today = dayjs();

    switch (value) {
      case "this_week":
        startDate = today.startOf("week");
        endDate = today.endOf("week");
        break;
      case "this_month":
        startDate = today.startOf("month");
        endDate = today.endOf("month");
        break;
      case "this_year":
        startDate = today.startOf("year");
        endDate = today.endOf("year");
        break;
      default:
        setFilteredClaimData(claimsData);
        return;
    }

    const filtered = claimsData.filter((item) => {
      if (!item.date) return false;
      const itemDate = dayjs(item.date);
      return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
    });
    
    setFilteredClaimData(filtered);
  };
  
  return (
    <>
    <div className="flex items-center justify-between p-5">
    <div className="flex items-center gap-5 justify-end w-full">
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
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 ml-64  bg-sky-50">
          <div className="p-8 mt-1">
            <p className="text-2xl font-bold mb-4 font-mono" >Dashboard Overview</p>
            {/* Stats Section */}
            <Row gutter={[16, 16]}>
              <Col lg={8} md={24} xs={24}>
                <Card style={{
                  backgroundColor: "#138dcf",
                  
                }}
                className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#1a6b96] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <div className="absolute top-0 right-0 w-14 h-14 bg-[#266b90] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <Statistic
                    title={<span style={{ color: "white" }}>Total Users</span>}
                    className="font-bold"
                    value={users.length}
                    prefix={<UserOutlined style={{ color: "white", 
                      backgroundColor:"#126896",
                      padding:"8px",
                      borderRadius:"50%"
                     }} />}
                    valueStyle={{ color: "white" }}
                  />
                </Card>
              </Col>

              <Col lg={8} md={24} xs={24}>
                <Card style={{
                  backgroundColor: "#f2b00c"
                }}
                className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#b1861a] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <div className="absolute top-0 right-0 w-14 h-14 bg-[#b08519] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <Statistic
                    title={<span style={{ color: "white" }}>Total Claims</span>}
                    className="font-bold"
                    value={claims.length}
                    prefix={<FileTextOutlined style={{ color: "white", 
                      backgroundColor:"#c7920e",
                      padding:"9px",
                      borderRadius:"50%" }} />}
                    valueStyle={{ color: "white" }}
                  />
                </Card>
              </Col>

              <Col lg={8} md={24} xs={24}>
                <Card style={{
                  backgroundColor: "#f25050"
                }}
                className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#b83535] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <div className="absolute top-0 right-0 w-14 h-14 bg-[#8f3232] opacity-50 rounded-full transform translate-x-4 -translate-y-4"></div>
                  <Statistic
                    title={<span style={{ color: "white" }}>Pending Claims</span>}
                    className="font-bold"
                    value={pendingClaims.length}
                    prefix={<ClockCircleOutlined style={{ color: "white", 
                      backgroundColor:"#ba3a3a",
                      padding:"9px",
                      borderRadius:"50%" }} />}
                    valueStyle={{ color: "white" }}
                  />
                </Card>
              </Col>
            </Row>
   
            <div className="mt-4">
              <Card
              title={
                <div className="flex justify-between items-center">
                  <span>Claim Request Charts</span>
                </div>
              }
              extra={
                <Select 
                  defaultValue="this_month" 
                  style={{ width: 150 }} 
                  onChange={handleFilterChange}
                  value={selectedRange}
                >
                  <Option value="this_week">This Week</Option>
                  <Option value="this_month">This Month</Option>
                  <Option value="this_year">This Year</Option>
                </Select>
              }
              style={{
                boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
              }}>
              <Row gutter={[16, 16]}>
                <Col lg={12} md={24}>
                  <Card title="Claim Request Overview">
                    <ResponsiveContainer width="100%" height={300} >
                      <BarChart data={claimsData}>
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}/>
                        <Bar dataKey="count" fill="#4faadb" barSize={40} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col lg={12} md={24}>
                  <Card title="Claims By Department">
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
              </Card>
              <Row gutter={[16, 16]} className="mt-4">
                <Col md={24} xs={24}>
                  <Card title="Recent Claims"
                  style={{
                    boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
                  }}>
                    <Table dataSource={recentClaims} columns={columns} rowKey="id" pagination={false} />
                    <Pagination align="center" defaultCurrent={1} total={50} style={{
                      marginTop: "2%"
                    }} />
                  </Card>
                </Col>
              </Row>
            </div>

            
            <Row gutter={[16, 16]}>
              <Col lg={8} md={24}>
                <Row gutter={[24, 24]} className="mt-4">
                  <Col xs={24}>
                    <Card style={{
                      boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                      <Statistic
                        title="Total Projects"
                        className="font-bold"
                        value={projects.length}
                        prefix={<ProjectOutlined style={{ color: "#2196f3" }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card style={{
                      boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                      <Statistic
                        title="Ongoing Projects"
                        className="font-bold"
                        value={projects.length}
                        prefix={<CheckCircleOutlined style={{ color: "#ded26a" }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card style={{
                      boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                      <Statistic
                        title="Completed Projects"
                        className="font-bold"
                        value={projects.length}
                        prefix={<CheckOutlined style={{ color: "#53d459" }} />}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
              {/* Monthly Newly Started Projects Chart */}
              <Col lg={16} md={24}>
                <div className="mt-4">
                  <Card title="Monthly Newly Started Project" style={{
                boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
              }} className="text-3xl" extra={
                <Select defaultValue="this_month" style={{ width: 150 }} onChange={handleFilterChange}>
          <Option value="this_week">This Week</Option>
          <Option value="this_month">This Month</Option>
          <Option value="this_year">This Year</Option>
        </Select>
              }>
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
<div className="mt-5">
            <Card
            title="Project Workload"
            style={{
              boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
            }}
            extra={
              <Select defaultValue="this_month" style={{ width: 150 }} onChange={handleFilterChange}>
        <Option value="this_week">This Week</Option>
        <Option value="this_month">This Month</Option>
        <Option value="this_year">This Year</Option>
      </Select>
            }>
                       <ResponsiveContainer width="100%" height={300}>
  <LineChart data={financialData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis  />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="Projects" stroke="#8884d8" name="Projects" />
  </LineChart>
</ResponsiveContainer>
            </Card>
            </div>
            <div className="mt-5">
              <Card title="Recent Activities" style={{
                boxShadow:"10px 10px 25px -19px rgba(0,0,0,0.75)"
              }}>
                <List dataSource={recentActivities} renderItem={(item: any) => (
                  <List.Item><List.Item.Meta title={item.activity} description={item.time} />
                  </List.Item>
                )} />
                <Pagination align="center" defaultCurrent={1} total={50} style={{
                  marginTop: "2%"
                }} />
              </Card>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
