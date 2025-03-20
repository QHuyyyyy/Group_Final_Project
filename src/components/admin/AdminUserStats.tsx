import {useEffect, useState } from 'react'
import { User } from '../../models/UserModel';
import { userService } from '../../services/user.service';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Col, Row, Card } from "antd";
export default function AdminUserStats() {
    const [users,setUsers] = useState<User[]>([]);
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
        setUsers(allUsers)
                return allUsers;
    }
    useEffect(()=>{
        fetchUsers()
    },[])
    console.log(users)
    const verifiedUsers = users.filter(user => user.is_verified).length;
const unverifiedUsers = users.filter(user => !user.is_verified).length;
const verificationData = [
    { name: 'Verified', value: verifiedUsers, color: '#4CAF50' },
    { name: 'Unverified', value: unverifiedUsers, color: '#FFC107' }
];

    const roleData = [
        { name: 'Admin', value: users.filter(user => user.role_code==="A001").length, color: '#3F51B5' },
        { name: 'Finance', value: users.filter(user => user.role_code==="A002").length, color: '#2196F3' },
        { name: 'BUL, PM', value: users.filter(user => user.role_code==="A003").length, color: '#03A9F4' },
        { name: 'Others', value: users.filter(user => user.role_code==="A004").length, color: '#00BCD4' }
    ];

    return (
        <>
        <div className='mt-4'>
            <Card title="User Charts Overview"  style={{
                            boxShadow: "10px 10px 25px -19px rgba(0,0,0,0.75)"
                        }}>
        
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
