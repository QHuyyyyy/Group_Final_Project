import {useEffect, useState} from 'react'
import { Project } from '../../models/ProjectModel';
import projectService from '../../services/project.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { Col, Row, Card, Statistic, List, Pagination, Select, DatePicker, Radio } from "antd";
import {ProjectOutlined, CheckCircleOutlined, CheckOutlined} from '@ant-design/icons';
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AdminProjectStats() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
    const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [filterType, setFilterType] = useState<'relative' | 'static'>('relative');
    const [, setDataLoaded] = useState({
        projects: false,
        ongoingProjects: false,
        completedProjects: false,
    });

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

    const [filteredCompletedProjects, setFilteredCompletedProjects] = useState<Project[]>([]);
    const [filteredActiveProjects, setFilteredActiveProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchProjects = async (status = '', pageSize = 200) => {
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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchData();
    }, []);

    // Process chart data with filtered projects
    const completedProjectData = processProjectData(filteredCompletedProjects);
    const activeProjectData = processProjectData(filteredActiveProjects);
    const projectTrendData = processProjectData(filteredProjects);

    const handleFilterChange = (value: string) => {
        setSelectedRange(value);
        setFilterType('relative');
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
            case "3_months":
                startDate = today.subtract(3, "month");
                endDate = today;
                break;
            case "6_months":
                startDate = today.subtract(6, "month");
                endDate = today;
                break;
            case "this_year":
                startDate = today.startOf("year");
                endDate = today.endOf("year");
                break;
            default:
                resetFilters();
                return;
        }
        filterProjectsByDateRange(startDate, endDate);
    };

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setDateRange(dates);
        setFilterType('static');
        setSelectedRange(null);
        
        if (dates && dates[0] && dates[1]) {
            filterProjectsByDateRange(dates[0], dates[1]);
        } else {
            resetFilters();
        }
    };
    
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
                                                resetFilters();
                                            } else {
                                                setSelectedRange(null);
                                                resetFilters();
                                            }
                                        }}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Radio.Button value="relative">Relative Date</Radio.Button>
                                        <Radio.Button value="static">Custom Date Range</Radio.Button>
                                    </Radio.Group>
                                    
                                    {filterType === 'relative' ? (
                                        <Select
                                            placeholder="Select date range"
                                            style={{ width: '100%' }}
                                            onChange={handleFilterChange}
                                            value={selectedRange}
                                        >
                                            <Option value="this_week">This Week</Option>
                                            <Option value="this_month">This Month</Option>
                                            <Option value="3_months">3 Months</Option>
                                            <Option value="6_months">6 Months</Option>
                                            <Option value="this_year">This Year</Option>
                                        </Select>
                                    ) : (
                                        <RangePicker 
                                            onChange={handleDateRangeChange}
                                            value={dateRange}
                                            style={{ width: '100%' }}
                                        />
                                    )}
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
                    <List 
                        dataSource={recentActivities} 
                        renderItem={(item: any) => (
                            <List.Item>
                                <List.Item.Meta title={item.activity} description={item.time} />
                            </List.Item>
                        )} 
                    />
                    <Pagination align="center" defaultCurrent={1} total={50} style={{
                        marginTop: "2%"
                    }} />
                </Card>
            </div>
        </>
    );
}