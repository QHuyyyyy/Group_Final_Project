import { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Form, Button, Tag, message } from "antd";
import dayjs from 'dayjs';
import React, { useMemo } from "react";
import { UpdateClaimRequest, ClaimById } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import projectService from "../../services/project.service";
import type { ProjectData } from "../../models/ProjectModel";
import {
    ClockCircleOutlined,
    ProjectOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

interface UpdateRequestProps {
    visible: boolean;
    claim: ClaimById;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormValues {
    claim_name: string;
    project_id: string;
    claim_start_date: dayjs.Dayjs;
    claim_end_date: dayjs.Dayjs;
    total_work_time: number;
}

const UpdateRequest: React.FC<UpdateRequestProps> = ({ visible, claim, onClose, onSuccess }) => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [projectDetails, setProjectDetails] = useState<ProjectData | null>(null);

    // Fetch project details
    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (claim?.project_id) {
                try {
                    const response = await projectService.getProjectById(claim.project_id, {showSpinner:false});
                    if (response.success && response.data) {
                        setProjectDetails(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching project details:", error);
                    message.error("Failed to fetch project details");
                }
            }
        };

        fetchProjectDetails();
    }, [claim?.project_id]);

    // Initialize form with claim data
    React.useEffect(() => {
        if (claim) {
            const start = dayjs(claim.claim_start_date);
            form.setFieldsValue({
                claim_name: claim.claim_name,
                project_id: claim.project_id,
                claim_start_date: start,
                claim_end_date: dayjs(claim.claim_end_date),
                total_work_time: claim.total_work_time,
            });
        }
    }, [claim, form]);

    const getStatusColor = (status: string) => {
        if (status === "Draft") return "#faad14";
        if (status === "Pending Approval") return "#1890ff";
        if (status === "Approved") return "#52c41a";
        return "#f5222d";
    };

    const modalTitle = useMemo(
        () => (
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold m-0">Update Claim</h2>
                <Tag
                    color={getStatusColor(claim.claim_status)}
                    className="px-3 py-1 text-sm uppercase font-medium"
                >
                    {claim.claim_status}
                </Tag>
            </div>
        ),
        [claim.claim_status]
    );

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const updatedRequest: UpdateClaimRequest = {
                project_id: values.project_id,
                claim_name: values.claim_name,
                claim_start_date: values.claim_start_date.format("YYYY-MM-DD"),
                claim_end_date: values.claim_end_date.format("YYYY-MM-DD"),
                total_work_time: values.total_work_time,
                approval_id: claim.approval_id,
            };

            await claimService.updateClaim(claim._id, updatedRequest, {showSpinner:false});
            message.success("Claim updated successfully");
            onSuccess();
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message || "Failed to update claim");
            } else {
                message.error("Failed to update claim");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={modalTitle}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="claims-modal"
        >
            <div className="px-2 -mt-2 mb-4">
                <p className="text-gray-400 text-sm">ID: {claim._id}</p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Basic Information */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-4">
                        <InfoCircleOutlined />
                        <span className="font-semibold">Basic Information</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <Form.Item
                            label="Claim Name"
                            name="claim_name"
                            rules={[{ required: true, message: "Please enter claim name!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Total Hours"
                            name="total_work_time"
                            rules={[{ required: true, message: "Please enter total hours!" }]}
                        >
                            <Input type="number" prefix={<ClockCircleOutlined className="text-blue-500" />} />
                        </Form.Item>
                    </div>
                </div>

                {/* Project Details */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                        <ProjectOutlined />
                        <span className="font-semibold">Project Details</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <Form.Item
                            label="Project ID"
                            name="project_id"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Project Name"
                        >
                            <Input
                                value={projectDetails?.project_name || 'N/A'}
                                disabled
                            />
                        </Form.Item>

                        <Form.Item
                            label="Project Comment"
                        >
                            <Input.TextArea
                                value={projectDetails?.project_comment || 'No comment'}
                                disabled
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* Time Period */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-purple-600 mb-4">
                        <CalendarOutlined />
                        <span className="font-semibold">Time Period</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <Form.Item
                            label="Start Date"
                            name="claim_start_date"
                            rules={[{ required: true, message: "Please select start date!" }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>

                        <Form.Item
                            label="End Date"
                            name="claim_end_date"
                            rules={[{ required: true, message: "Please select end date!" }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Update Claim
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateRequest;
