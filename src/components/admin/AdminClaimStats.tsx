import { Col, Row, Card, Statistic, Table, Pagination, Select, Tag, DatePicker, Radio, Button } from "antd"
import { UserOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { User } from "../../models/UserModel";
import { Claim } from "../../models/ClaimModel";
import dayjs from "dayjs"
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { userService } from "../../services/user.service";
import { claimService } from "../../services/claim.service";
import { toast } from "react-toastify";
interface ClaimStatus {
    id: number;
    name: string;
    status: "Pending" | "Approved" | "Rejected" | "Paid" | "Canceled";
    claimer: string;
}
interface ClaimData {
    status: string;
    count: number;
    date?: string;
}
const { Option } = Select
const { RangePicker } = DatePicker
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
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
    const [filteredPendingClaims, setFilteredPendingClaims] = useState<Claim[]>([]);
    const [filteredApprovedClaims, setFilteredApprovedClaims] = useState<Claim[]>([]);
    const [filteredRejectedClaims, setFilteredRejectedClaims] = useState<Claim[]>([]);
    const [filteredPaidClaims, setFilteredPaidClaims] = useState<Claim[]>([]);
    const [filteredDraftClaims, setFilteredDraftClaims] = useState<Claim[]>([]);
    const [filteredCanceledClaims, setFilteredCanceledClaims] = useState<Claim[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [, setDataLoaded] = useState({
        claims: false,
        users: false
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    

    const fetchClaims = async (status = '', pageSize = 10000) => {
        let allItems: Claim[] = [];
        let pageNum = 1;
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
            allItems = [...allItems, ...response.data.pageData];

        return allItems;
    };


    const fetchUsers = async (pageSize = 10000) => {
        let allUsers: User[] = [];
        let pageNum = 1;

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


            allUsers = [...allUsers, ...response.data.pageData];

        return allUsers;
    };

    const loadAllData = async () => {
        try {
            const [allClaims, allUsers] = await Promise.all([
                fetchClaims(),
                fetchUsers()
            ]);

            const pendingClaims = allClaims.filter(item => item.claim_status === "Pending Approval");
            const approvedClaims = allClaims.filter(item => item.claim_status === "Approved");
            const rejectedClaims = allClaims.filter(item => item.claim_status === "Rejected");
            const paidClaims = allClaims.filter(item => item.claim_status === "Paid");
            const draftClaims = allClaims.filter(item => item.claim_status === "Draft");
            const canceledClaims = allClaims.filter(item => item.claim_status === "Canceled");

            setClaims(allClaims);
                setPendingClaims(pendingClaims);
                setApprovedClaims(approvedClaims);
                setRejectedClaims(rejectedClaims);
                setPaidClaims(paidClaims);
                setDraftClaims(draftClaims);
                setCanceledClaims(canceledClaims);

                // Extract unique departments
                const uniqueDepartments = Array.from(new Set(
                    allClaims
                        .filter(claim => claim.employee_info?.department_code)
                        .map(claim => claim.employee_info?.department_code || "")
                ));
                setDepartments(uniqueDepartments);

                setUsers(allUsers);

                setDataLoaded({
                    claims: true,
                    users: true
                });

                setFilteredClaims(allClaims);
                setFilteredPendingClaims(pendingClaims);
                setFilteredApprovedClaims(approvedClaims);
                setFilteredRejectedClaims(rejectedClaims);
                setFilteredPaidClaims(paidClaims);
                setFilteredDraftClaims(draftClaims);
                setFilteredCanceledClaims(canceledClaims);
            
        } catch (error) {
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    useEffect(() => {
        const recentClaims = getRecentClaims();
        setTotalItems(recentClaims.length);
    }, [filteredClaims]);
    
    const claimsData: ClaimData[] = [
        { status: "Pending", count: filteredPendingClaims.length, date: "2024-03-25" },
        { status: "Approved", count: filteredApprovedClaims.length, date: "2024-03-24" },
        { status: "Rejected", count: filteredRejectedClaims.length, date: "2024-03-23" },
        { status: "Paid", count: filteredPaidClaims.length, date: "2024-03-22" },
        { status: "Draft", count: filteredDraftClaims.length, date: "2024-03-22" },
        { status: "Canceled", count: filteredCanceledClaims.length, date: "2024-03-22" }
    ];

    const getClaimsByDepartment = () => {
        const departmentCounts = departments.map(dept => {
            return {
                name: dept === "DE01" ? "Department 01" : 
                      dept === "DE02" ? "Department 02" : 
                      dept === "DE03" ? "Department 03" : 
                      dept === "DE04" ? "Department 04" : dept,
                value: filteredClaims.filter((claim) => claim.employee_info?.department_code === dept).length
            };
        }).filter(dept => dept.value > 0);

        return departmentCounts;
    };

    const claimCategories = getClaimsByDepartment();

    const [, setFilteredClaimData] = useState<ClaimData[]>(claimsData);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [filterType, setFilterType] = useState<'relative' | 'static'>('relative');
    
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
            case "3_months":
                startDate = today.subtract(3, "month")
                endDate = today;
                break;
            case "6_months":
                startDate = today.subtract(6, "month");
                endDate = today;
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
                resetDateFilters();
                return;
        }
        applyFilters(startDate, endDate);
    };


    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setDateRange(dates);
        setFilterType('static');
        setSelectedRange(null);

        if (dates && dates[0] && dates[1]) {
            applyFilters(dates[0], dates[1]);
        } else {
            setFilteredClaimData(claimsData);
        }
    };

    const applyFilters = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null) => {

        let filtered = [...claims];
        
        // Apply date filter if provided
        if (startDate && endDate) {
            filtered = filtered.filter((claim) => {
                if (!claim.claim_start_date) return false;
                const claimDate = dayjs(claim.claim_start_date);
                return claimDate.isAfter(startDate) && claimDate.isBefore(endDate);
            });
        }
        
        // Update all filtered states
        setFilteredClaims(filtered);
        setFilteredPendingClaims(filtered.filter(item => item.claim_status === "Pending Approval"));
        setFilteredApprovedClaims(filtered.filter(item => item.claim_status === "Approved"));
        setFilteredRejectedClaims(filtered.filter(item => item.claim_status === "Rejected"));
        setFilteredPaidClaims(filtered.filter(item => item.claim_status === "Paid"));
        setFilteredDraftClaims(filtered.filter(item => item.claim_status === "Draft"));
        setFilteredCanceledClaims(filtered.filter(item => item.claim_status === "Canceled"));
        setCurrentPage(1);
    };

    const getRecentClaims = () => {
        // Use filtered claims instead of all claims
        const sortedClaims = filteredClaims.sort((a, b) => {
            const dateA = dayjs(a.claim_start_date);
            const dateB = dayjs(b.claim_start_date);
            return dateB.valueOf() - dateA.valueOf();
        });
        
        const limitedClaims = sortedClaims.slice(0, 25);
        return limitedClaims.map(claim => ({
            name: claim.claim_name || "Unnamed Claim",
            status: claim.claim_status === "Pending Approval" ? "Pending" : claim.claim_status,
            claimer: claim.employee_info?.account || "Unknown",
            startDate: claim.claim_start_date ? dayjs(claim.claim_start_date).format('YYYY-MM-DD') : 'N/A',
            department: claim.employee_info?.department_code || 'N/A'
        }));
    };
    
    // Function to get paginated data
    const getPaginatedClaims = () => {
        const recentClaims = getRecentClaims();
        const startIndex = (currentPage - 1) * pageSize;
        return recentClaims.slice(startIndex, startIndex + pageSize);
    };
    
    // Handle page change
    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size && size !== pageSize) {
            setPageSize(size);
        }
    };

    const resetDateFilters = () => {
        setDateRange(null);
        setSelectedRange(null);
    };

    const resetFilters = () => {
        setFilteredClaims(claims);
        setFilteredPendingClaims(pendingClaims);
        setFilteredApprovedClaims(approvedClaims);
        setFilteredRejectedClaims(rejectedClaims);
        setFilteredPaidClaims(paidClaims);
        setFilteredDraftClaims(draftClaims);
        setFilteredCanceledClaims(canceledClaims);
        setSelectedDepartment(null);
        setDateRange(null);
        setSelectedRange(null);
        setCurrentPage(1);
    };

    const statusColors: Record<ClaimStatus["status"], string> = {
        Pending: "gold",
        Approved: "green",
        Rejected: "red",
        Canceled: "#808080",
        Paid: "blue",
    };
    
    const columns = [
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
        { title: "Department", dataIndex: "department", key: "department" },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            sorter: (a:any,b:any) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
        }
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]; // colors for pie chart

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
                            value={filteredClaims.length}
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
                            value={filteredPendingClaims.length}
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
                        <div className="flex flex-col gap-2 p-5">
                            
                            <Radio.Group
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    if (e.target.value === 'relative') {
                                        setDateRange(null);
                                        setFilteredClaimData(claimsData);
                                        if (selectedDepartment) {
                                            applyFilters(null, null);
                                        } else {
                                            resetDateFilters();
                                        }
                                    } else {
                                        setSelectedRange(null);
                                        setFilteredClaimData(claimsData);
                                        if (selectedDepartment) {
                                            applyFilters(null, null);
                                        } else {
                                            resetDateFilters();
                                        }
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
                                    allowClear
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
                            
                            <Button 
                                onClick={resetFilters} 
                                type="primary" 
                                danger
                                style={{ marginTop: 8 }}
                            >
                                Reset All Filters
                            </Button>
                        </div>
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
                            <Table 
                                dataSource={getPaginatedClaims()} 
                                columns={columns} 
                                rowKey="id" 
                                pagination={false} 
                            />
                            <Pagination 
                            style={{
                                marginTop:"15px"
                            }}
                                className="mt-4"
                                align="center" 
                                current={currentPage}
                                total={totalItems}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger
                                pageSizeOptions={['5', '10', '20', '50']}
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}