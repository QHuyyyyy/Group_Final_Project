import React from "react";
import { Link } from "react-router-dom";
import { Table, Tag, Button } from "antd";


const requests = [
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
];

const Request = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Requests</h2>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/dashboard/create-request">
          <Button type="primary">Create Request</Button>
        </Link>
      </div>

      <Table
        dataSource={requests}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Employee Name", dataIndex: "name", key: "name" },
          { title: "Project", dataIndex: "project", key: "project" },
          { title: "Total Hours Worked", dataIndex: "totalHours", key: "totalHours" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
              <Tag color={status === "Draft" ? "orange" : status === "Pending Approval" ? "blue" : "green"}>
                {status}
              </Tag>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (text: string, record: any) => (
              <Link to={`/dashboard/request-detail/${record.id}`}>
                <Button type="primary">View Details</Button>
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Request;
