import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Button } from "antd";
import { Link } from "react-router-dom";

const requestDetails = [
    {
        id: 1,
        name: "John Doe",
        project: "Project A",
        totalHours: 40,
        status: "Draft",
        createdDate: "2025-02-10",
        startDate: "2025-02-01", // Thêm startDate
        endDate: "2025-02-05",   // Thêm endDate
        description: "Worked on the initial phase of Project A", // Thêm description
    },
    {
        id: 2,
        name: "Jane Smith",
        project: "Project B",
        totalHours: 35,
        status: "Pending Approval",
        createdDate: "2025-02-08",
        startDate: "2025-02-02", // Thêm startDate
        endDate: "2025-02-07",   // Thêm endDate
        description: "Assisted in completing the final deliverables", // Thêm description
    },
];

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();

    const request = requestDetails.find((req) => req.id.toString() === id);

    if (!request) {
        return <div>Request not found!</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Request Details</h2>
            <Card title={`Request ID: ${request.id}`} style={{ width: "100%" }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Employee Name">{request.name}</Descriptions.Item>
                    <Descriptions.Item label="Project">{request.project}</Descriptions.Item>
                    <Descriptions.Item label="Total Hours Worked">{request.totalHours}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <span
                            style={{
                                color:
                                    request.status === "Draft"
                                        ? "orange"
                                        : request.status === "Pending Approval"
                                            ? "blue"
                                            : "green",
                            }}
                        >
                            {request.status}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created Date">{request.createdDate}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{request.startDate}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{request.endDate}</Descriptions.Item>
                    <Descriptions.Item label="Description">{request.description}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: "20px" }}>
                    <Link to="/dashboard/claimrequest">
                        <Button type="primary">Back to Requests</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default RequestDetails;
