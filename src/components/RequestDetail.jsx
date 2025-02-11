import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Divider } from "antd";

const RequestDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { request } = location.state || {};

    if (!request) {
        return <div>Request not found!</div>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <Card title={`Request Detail - ${request.name}`}>
                <Divider />
                <p><strong>Employee Name:</strong> {request.name}</p>
                <p><strong>Project:</strong> {request.project}</p>
                <p><strong>Total Hours Worked:</strong> {request.totalHours}</p>
                <p><strong>Status:</strong>
                    <span style={{ color: request.status === "Draft" ? "orange" : request.status === "Pending Approval" ? "blue" : "green" }}>
                        {request.status}
                    </span>
                </p>
                <p><strong>Created Date:</strong> {request.createdDate}</p>
                <p><strong>Description:</strong> {request.description || "No description provided"}</p>
                <Button type="primary" onClick={() => navigate("/my-requests")}>Back to My Requests</Button>
            </Card>
        </div>
    );
};

export default RequestDetail;
