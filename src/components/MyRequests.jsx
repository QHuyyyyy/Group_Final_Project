import React, { useState } from "react";
import { Table, Button, Tag, notification } from "antd";
import { useNavigate } from "react-router-dom";

const MyRequests = () => {
    const [requests, setRequests] = useState([
        {
            id: 1,
            name: "John Doe",
            project: "Project A",
            totalHours: 40,
            status: "Draft",
            createdDate: "2025-02-10",
        },
        {
            id: 2,
            name: "Jane Smith",
            project: "Project B",
            totalHours: 35,
            status: "Pending Approval",
            createdDate: "2025-02-08",
        },
    ]);

    const navigate = useNavigate();

    const handleViewDetails = (record) => {
        navigate(`/request-detail/${record.id}`, { state: { request: record } });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Employee Name", dataIndex: "name", key: "name" },
        { title: "Project", dataIndex: "project", key: "project" },
        { title: "Total Hours Worked", dataIndex: "totalHours", key: "totalHours" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "Draft" ? "orange" : status === "Pending Approval" ? "blue" : "green"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <>
                    <Button onClick={() => handleViewDetails(record)} style={{ marginRight: 8 }}>View Details</Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Requests</h2>
            <Table dataSource={requests} columns={columns} rowKey="id" />
        </div>
    );
};

export default MyRequests;
