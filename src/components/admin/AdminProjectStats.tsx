import { useEffect, useState } from 'react'
import { Project } from '../../models/ProjectModel';
import projectService from '../../services/project.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { Col, Row, Card, Statistic, Select, Radio } from "antd";
import { ProjectOutlined, CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const { Option } = Select;

export default function AdminProjectStats() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [, setSelectedRange] = useState<string | null>(null);
  const [, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [filterType, setFilterType] = useState<'relative' | 'static' | 'year'>('relative');
  const [selectedYear, setSelectedYear] = useState<number | null>(dayjs().year());
  const [, setDataLoaded] = useState({
    projects: false,
    ongoingProjects: false,
    completedProjects: false,
  });

  // const recentActivities = [
  //   { activity: "User John approved a claim", time: "2 hours ago" },
  //   { activity: "Project Alpha was completed", time: "5 hours ago" },
  //   { activity: "User Sarah submitted a claim", time: "Yesterday" },
  //   { activity: "Admin assigned a user to Project Beta", time: "2 days ago" },
  // ];
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setFilterType('year');
    setSelectedRange(null);
    setDateRange(null);

    const startDate = dayjs().year(year).startOf('year');
    const endDate = dayjs().year(year).endOf('year');

    filterProjectsByDateRange(startDate, endDate);
  };

  const getAvailableYears = () => {
    const years = new Set<number>();

    projects.forEach(project => {
      if (project.project_start_date) {
        const year = new Date(project.project_start_date).getFullYear();
        years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  };


  const processProjectData = (projects: Project[]) => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts: Record<string, number> = {};

    monthOrder.forEach(month => {
      counts[month] = 0;
    });

    projects.forEach(({ project_start_date }) => {
      if (!project_start_date) return;
      const date = new Date(project_start_date);
      const month = date.toLocaleString("en-US", { month: "short" });

      counts[month] = (counts[month] || 0) + 1;
    });

    return monthOrder.map(month => ({ month, projects: counts[month] }));
  };

  const [filteredCompletedProjects, setFilteredCompletedProjects] = useState<Project[]>([]);
  const [filteredActiveProjects, setFilteredActiveProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);



  const fetchProjects = async (status = '', pageSize = 10000) => {
    let allProjects: Project[] = [];
    let pageNum = 1;
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

    const response = await projectService.searchProjects(params)

    allProjects = [...allProjects, ...response.data.pageData];
    return allProjects;
  };

  const loadAllData = async () => {
    const [
      allProjects,
    ] = await Promise.all([
      fetchProjects(),
    ]);
    const ongoingProjects = allProjects.filter(item => item.project_status === "Active");
    const completedProjects = allProjects.filter(item => item.project_status === "Closed");
    // Update states
    setProjects(allProjects);
    setOngoingProjects(ongoingProjects);
    setCompletedProjects(completedProjects);

    // Set initial filtered projects
    setFilteredProjects(allProjects);
    setFilteredActiveProjects(ongoingProjects);
    setFilteredCompletedProjects(completedProjects);

    // Update data loaded status
    setDataLoaded({
      projects: true,
      ongoingProjects: true,
      completedProjects: true,
    });
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const createCombinedChartData = () => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Create counts for both project types
    const activeCounts: Record<string, number> = {};
    const completedCounts: Record<string, number> = {};

    // Initialize all months with zero
    monthOrder.forEach(month => {
      activeCounts[month] = 0;
      completedCounts[month] = 0;
    });

    // Count active projects by month
    filteredActiveProjects.forEach(({ project_start_date }) => {
      if (!project_start_date) return;
      const date = new Date(project_start_date);
      const month = date.toLocaleString("en-US", { month: "short" });
      activeCounts[month] = (activeCounts[month] || 0) + 1;
    });

    // Count completed projects by month
    filteredCompletedProjects.forEach(({ project_start_date }) => {
      if (!project_start_date) return;
      const date = new Date(project_start_date);
      const month = date.toLocaleString("en-US", { month: "short" });
      completedCounts[month] = (completedCounts[month] || 0) + 1;
    });

    // Combine into a single dataset
    return monthOrder.map(month => ({
      month,
      activeProjects: activeCounts[month],
      completedProjects: completedCounts[month]
    }));
  };

  // Calculate combined data
  const combinedChartData = createCombinedChartData();
  const projectTrendData = processProjectData(filteredProjects);


  const filterProjectsByDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    // Filter projects based on start date
    const filtered = projects.filter((project) => {
      if (!project.project_start_date) return false;
      const projectDate = dayjs(project.project_start_date);
      return projectDate.isAfter(startDate) && projectDate.isBefore(endDate);
    });

    const filteredActive = ongoingProjects.filter((project) => {
      if (!project.project_start_date) return false;
      const projectDate = dayjs(project.project_start_date);
      return projectDate.isAfter(startDate) && projectDate.isBefore(endDate);
    });

    const filteredCompleted = completedProjects.filter((project) => {
      if (!project.project_start_date) return false;
      const projectDate = dayjs(project.project_start_date);
      return projectDate.isAfter(startDate) && projectDate.isBefore(endDate);
    });

    setFilteredProjects(filtered);
    setFilteredActiveProjects(filteredActive);
    setFilteredCompletedProjects(filteredCompleted);
  };

  const resetFilters = () => {
    setFilteredProjects(projects);
    setFilteredActiveProjects(ongoingProjects);
    setFilteredCompletedProjects(completedProjects);
  };

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
                  value={filteredProjects.length}
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
                  value={filteredActiveProjects.length}
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
                  value={filteredCompletedProjects.length}
                  prefix={<CheckOutlined style={{ color: "#53d459" }} />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Monthly Newly Started Projects Chart */}
        <Col lg={16} md={24}>
          <div className="mt-4">
            <Card
              title="Monthly Newly Started Project"
              style={{
                boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
              }}
              className="text-3xl"
              extra={
                <div className="flex flex-col gap-2 p-5">
                  <Radio.Group
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      // Clear filters when switching
                      if (e.target.value === 'relative') {
                        setDateRange(null);
                        setSelectedYear(null);
                        resetFilters();
                      } else if (e.target.value === 'static') {
                        setSelectedRange(null);
                        setSelectedYear(null);
                        resetFilters();
                      } else if (e.target.value === 'year') {
                        setSelectedRange(null);
                        setDateRange(null);
                        resetFilters();
                      }
                    }}
                    style={{ marginBottom: 8 }}
                  >
                  </Radio.Group>

                  <Select
                    placeholder="Select year"
                    style={{ width: '100%' }}
                    onChange={handleYearChange}
                    value={selectedYear}
                  >
                    {getAvailableYears().map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>

                </div>
              }
            >
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
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activeProjects" stroke="#FF7300" name="Active Projects" />
              <Line type="monotone" dataKey="completedProjects" stroke="#00C49F" name="Completed Projects" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}