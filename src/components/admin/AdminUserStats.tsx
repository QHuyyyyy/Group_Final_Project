import { useEffect, useState } from 'react'
import { User } from '../../models/UserModel';
import { userService } from '../../services/user.service';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Col, Row, Card, Select, DatePicker, Radio, Button } from "antd";
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AdminUserStats() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [filterType, setFilterType] = useState<'relative' | 'static'>('relative');

    const fetchUsers = async(pageSize=10000) => {
        let allUsers: User[] = [];
        let pageNum = 1;
        const params = {
            searchCondition: {
                keyword: "",
                role_code: "",
                is_blocked: false,
                is_delete: false,
                is_verified: "",
            },
            pageInfo: {
                pageNum,
                pageSize,
            },
        };
        const response = await userService.searchUsers(params);
        allUsers = [...allUsers, ...response.data.pageData];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        return allUsers;
    }

    useEffect(() => {
        fetchUsers();
    }, []);

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
                startDate = today.subtract(3, "month");
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
            setFilteredUsers(users);
        }
    };

    const applyFilters = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null) => {
        if (startDate && endDate) {
            const filtered = users.filter((user) => {
                if (!user.created_at) return false;
                const createDate = dayjs(user.created_at);
                return createDate.isAfter(startDate) && createDate.isBefore(endDate);
            });
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const resetDateFilters = () => {
        setDateRange(null);
        setSelectedRange(null);
        setFilteredUsers(users);
    };

    const resetFilters = () => {
        setFilteredUsers(users);
        setDateRange(null);
        setSelectedRange(null);
    };

    // Prepare chart data based on filtered users
    const verifiedUsers = filteredUsers.filter(user => user.is_verified).length;
    const unverifiedUsers = filteredUsers.filter(user => !user.is_verified).length;
    const verificationData = [
        { name: 'Verified', value: verifiedUsers, color: '#4CAF50' },
        { name: 'Unverified', value: unverifiedUsers, color: '#FFC107' }
    ];

    const roleData = [
        { name: 'Admin', value: filteredUsers.filter(user => user.role_code === "A001").length, color: '#3F51B5' },
        { name: 'Finance', value: filteredUsers.filter(user => user.role_code === "A002").length, color: '#2196F3' },
        { name: 'BUL, PM', value: filteredUsers.filter(user => user.role_code === "A003").length, color: '#03A9F4' },
        { name: 'Others', value: filteredUsers.filter(user => user.role_code === "A004").length, color: '#00BCD4' }
    ];

    return (
        <>
            <div className='mt-4'>
                <Card 
                    title="User Charts Overview" 
                    style={{
                        boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                    }}
                    extra={
                        <div className="flex flex-col gap-2 p-5">
                            <Radio.Group
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    if (e.target.value === 'relative') {
                                        setDateRange(null);
                                    } else {
                                        setSelectedRange(null);
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
                >
                    <Row gutter={[16, 16]}>
                        <Col lg={12} md={24}>
                            <div className="mt-4">
                                <Card title="Verified and Unverified Users">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={verificationData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {verificationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} users`, null]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </div>
                        </Col>
                        <Col lg={12} md={24}>
                            <div className='mt-4'>
                                <Card title="Distribution of User Roles">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={roleData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            barCategoryGap={30}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                                            <Bar dataKey="value" name="Users" radius={[4, 4, 0, 0]}>
                                                {roleData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    )
}