import { Col, Row, Card, Statistic, Table, Pagination, Select, Tag } from "antd"
import { UserOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { User } from "../../models/UserModel";
import { Claim } from "../../models/ClaimModel";
import dayjs from "dayjs"
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell  } from "recharts";
import { userService } from "../../services/user.service";
import { claimService } from "../../services/claim.service";
interface ClaimStatus {
    id: number;
    name: string;
    status: "Pending" | "Approved" | "Rejected" | "Paid";
    claimer: string;
}
interface ClaimData {
    status: string;
    count: number;
    date?: string;
}
const { Option } = Select
export default function AdminClaimStats() {
    const [users, setUsers] = useState<User[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);
    const [approvedClaims, setApprovedClaims] = useState<Claim[]>([]);
    const [rejectedClaims, setRejectedClaims] = useState<Claim[]>([]);
    const [paidClaims, setPaidClaims] = useState<Claim[]>([]);
    const [draftClaims, setDraftClaims] = useState<Claim[]>([]);
    const [canceledClaims, setCanceledClaims] = useState<Claim[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [dataLoaded, setDataLoaded] = useState({
        claims: false,
        pendingClaims: false,
        approvedClaims: false,
        rejectedClaims: false,
        paidClaims: false,
        draftClaims: false,
        canceledClaims: false,
        users: false
      });
    useEffect(() => {
        const fetchData = async () => {
          try {
    
            const fetchClaims = async (status = '', pageSize = 200) => {
              let allItems: Claim[] = [];
              let pageNum = 1;
      
              while (true) {
                const params = {
                  searchCondition: {
                    keyword: "",
                    claim_status: status,
                    is_delete: false,
                  },
                  pageInfo: {
                    pageNum,
                    pageSize,
                  },
                };
      
                const response = await claimService.searchClaims(params);
                
                if (!response || !response.data.pageData || response.data.pageData.length === 0) break;
      
                allItems = [...allItems, ...response.data.pageData];
                pageNum++;
              }
      
              return allItems;
            };
            const fetchUsers = async (pageSize = 200) => {
              let allUsers: User[] = [];
              let pageNum = 1;
      
              while (true) {
                const params = {
                  searchCondition: {
                    keyword: "",
                    is_delete: false,
                  },
                  pageInfo: {
                    pageNum,
                    pageSize,
                  },
                };
      
                const response = await userService.searchUsers(params);
                
                if (!response || !response.data.pageData || response.data.pageData.length === 0) break;
      
                allUsers = [...allUsers, ...response.data.pageData];
                pageNum++;
              }
      
              return allUsers;
            };
      
            const [
              allClaims,
              pendingClaims,
              approvedClaims,
              rejectedClaims,
              paidClaims,
              draftClaims,
              canceledClaims,
              allUsers,
            ] = await Promise.all([
              fetchClaims(),
              fetchClaims('Pending Approval'),
              fetchClaims('Approved'),
              fetchClaims('Rejected'),
              fetchClaims('Paid'),
              fetchClaims('Draft'),
              fetchClaims('Canceled'),
              fetchUsers()
            ]);
      
            // Update states
            setClaims(allClaims);
            setPendingClaims(pendingClaims);
            setApprovedClaims(approvedClaims);
            setRejectedClaims(rejectedClaims);
            setPaidClaims(paidClaims);
            setDraftClaims(draftClaims);
            setCanceledClaims(canceledClaims);
            
            
            setUsers(allUsers);
      
            // Update data loaded status
            setDataLoaded({
              claims: true,
              pendingClaims: true,
              approvedClaims: true,
              rejectedClaims: true,
              paidClaims: true,
              draftClaims: true,
              canceledClaims: true,
              users: true
            });
      
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);
    const claimsData: ClaimData[] = [
        { status: "Pending", count: pendingClaims.length, date: "2024-03-25" },
        { status: "Approved", count: approvedClaims.length, date: "2024-03-24" },
        { status: "Rejected", count: rejectedClaims.length, date: "2024-03-23" },
        { status: "Paid", count: paidClaims.length, date: "2024-03-22" },
        { status: "Draft", count: draftClaims.length, date: "2024-03-22" },
        { status: "Canceled", count: canceledClaims.length, date: "2024-03-22" }
    ];

    const recentClaims = [
        { id: 1, name: "Overtime Payment", status: "Pending", claimer: "John Doe" },
        { id: 2, name: "Travel Reimbursement", status: "Approved", claimer: "Jane Smith" },
        { id: 3, name: "Project Bonus", status: "Rejected", claimer: "Alice Johnson" },
        { id: 4, name: "Meal Allowance", status: "Paid", claimer: "Bob Brown" },
      ];
     
      
      const claimCategories = [
          { 
            name: "Department 01", 
            value: claims.filter((claim) => claim.employee_info?.department_name === "Department 01").length 
          },
          { 
            name: "Department 02", 
            value: claims.filter((claim) => claim.employee_info?.department_name === "Department 02").length 
          },
          { 
            name: "Department 03", 
            value: claims.filter((claim) => claim.employee_info?.department_name === "Department 03").length 
          },
          { 
            name: "Department 04", 
            value: claims.filter((claim) => claim.employee_info?.department_name === "Department 04").length 
          },
        ];

    const [filteredClaimData, setFilteredClaimData] = useState<ClaimData[]>(claimsData);
    console.log(filteredClaimData)
    console.log(dataLoaded)
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

    const statusColors: Record<ClaimStatus["status"], string> = {
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
            render: (status: ClaimStatus["status"]) => (
                <Tag color={statusColors[status] || "default"}>{status}</Tag>
            ),
        },
        { title: "Claimer", dataIndex: "claimer", key: "claimer" },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // colors for pie chart

    return (
        <>
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
                            prefix={<UserOutlined style={{
                                color: "white",
                                backgroundColor: "#126896",
                                padding: "8px",
                                borderRadius: "50%"
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
                            prefix={<FileTextOutlined style={{
                                color: "white",
                                backgroundColor: "#c7920e",
                                padding: "9px",
                                borderRadius: "50%"
                            }} />}
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
                            prefix={<ClockCircleOutlined style={{
                                color: "white",
                                backgroundColor: "#ba3a3a",
                                padding: "9px",
                                borderRadius: "50%"
                            }} />}
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
                        boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}>
                    <Row gutter={[16, 16]}>
                        <Col lg={12} md={24}>
                            <Card title="Claim Request Overview">
                                <ResponsiveContainer width="100%" height={300} >
                                    <BarChart data={claimsData}>
                                        <XAxis dataKey="status" />
                                        <YAxis />
                                        <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }} />
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
                                boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                            }}>
                            <Table dataSource={recentClaims} columns={columns} rowKey="id" pagination={false} />
                            <Pagination align="center" defaultCurrent={1} total={50} style={{
                                marginTop: "2%"
                            }} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}
