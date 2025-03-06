import {useEffect, useState} from 'react'
import { Project } from '../../models/ProjectModel';

import projectService from '../../services/projectService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { Col, Row, Card, Statistic,List, Pagination, Select} from "antd";
import {ProjectOutlined,CheckCircleOutlined, CheckOutlined} from '@ant-design/icons';

const { Option } = Select
export default function AdminProjectStats() {
    const [projects, setProjects] = useState<Project[]>([]);
      const [ongoingProjects, setOngoingProjects] = useState<Project[]>([])
      const [completedProjects, setCompletedProjects] = useState<Project[]>([])
      const [dataLoaded, setDataLoaded] = useState({
        projects: false,
        ongoingProjects: false,
        completedProjects: false,
      });
      console.log(dataLoaded)
      const recentActivities = [
        { activity: "User John approved a claim", time: "2 hours ago" },
        { activity: "Project Alpha was completed", time: "5 hours ago" },
        { activity: "User Sarah submitted a claim", time: "Yesterday" },
        { activity: "Admin assigned a user to Project Beta", time: "2 days ago" },
      ];

      const processProjectData = (projects: Project[]) => {
          const counts: Record<string, number> = {};
      
          projects.forEach(({ project_start_date }) => {
            const date = new Date(project_start_date);
            const month = date.toLocaleString("en-US", { month: "short" });
      
            counts[month] = (counts[month] || 0) + 1;
          });
      
          return Object.entries(counts).map(([month, projects]) => ({ month, projects }));
        };

        const completedProjectData = processProjectData(completedProjects)
        const activeProjectData = processProjectData(ongoingProjects)
        const projectTrendData = processProjectData(projects);
    useEffect(() => {
        const fetchData = async () => {
          try {
      
            const fetchProjects = async (status = '', pageSize = 10) => {
              let allProjects: Project[] = [];
              let pageNum = 1;
      
              while (true) {
                const params = {
                  searchCondition: {
                    project_status: status,
                    is_deleted: false,
                  },
                  pageInfo: {
                    pageNum,
                    pageSize,
                    totalItems: 0,
                    totalPages: 0
                  },
                };
      
                const response = await projectService.searchProjects(params);
                
                if (!response || !response.data.pageData || response.data.pageData.length === 0) break;
      
                allProjects = [...allProjects, ...response.data.pageData];
                pageNum++;
              }
      
              return allProjects;
            };
      
            const [
              allProjects,
              ongoingProjects,
              completedProjects,
            ] = await Promise.all([
              fetchProjects(),
              fetchProjects('Active'),
              fetchProjects('Closed'),
            ]);
      
            // Update states
            setProjects(allProjects);
            setOngoingProjects(ongoingProjects);
            setCompletedProjects(completedProjects);
            
      
            // Update data loaded status
            setDataLoaded({
              projects: true,
              ongoingProjects: true,
              completedProjects: true,
            });
      
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);
  return (
    <>
    <Row gutter={[16, 16]}>
              <Col lg={8} md={24}>
                <Row gutter={[24, 24]} className="mt-4">
                  <Col xs={24}>
                    <Card style={{
                      boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
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
                      boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                      <Statistic
                        title="Ongoing Projects"
                        className="font-bold"
                        value={ongoingProjects.length}
                        prefix={<CheckCircleOutlined style={{ color: "#ded26a" }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card style={{
                      boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                      <Statistic
                        title="Completed Projects"
                        className="font-bold"
                        value={completedProjects.length}
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
                    boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                  }} className="text-3xl" extra={
                    <Select defaultValue="this_month" style={{ width: 150 }}>
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
                  boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                }}
                extra={
                  <Select defaultValue="this_month" style={{ width: 150 }}>
                    <Option value="this_week">This Week</Option>
                    <Option value="this_month">This Month</Option>
                    <Option value="this_year">This Year</Option>
                  </Select>
                }>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Active Projects Line */}
                    <Line type="monotone" data={activeProjectData} dataKey="projects" stroke="#FF7300" name="Active Projects" />

                    {/* Completed Projects Line */}
                    <Line type="monotone" data={completedProjectData} dataKey="projects" stroke="#00C49F" name="Completed Projects" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <div className="mt-5">
              <Card title="Recent Activities" style={{
                boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
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
    </>
  )
}
