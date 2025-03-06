import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, notification, Select } from "antd";
import { Modal } from "antd";
import dayjs from 'dayjs';
import { claimService } from "../../services/claim.service";
import type { CreateClaimRequest } from "../../models/ClaimModel";
import type { ProjectData } from "../../models/ProjectModel";
import type { User } from "../../models/UserModel";
import { useUserStore } from "../../stores/userStore";

interface CreateRequestProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ 
    visible, 
    onClose, 
    onSuccess,
}) => {
    const [form] = Form.useForm<CreateClaimRequest>();
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [approvers, setApprovers] = useState<User[]>([]);
    const [fetchingProjects, setFetchingProjects] = useState<boolean>(false);
    const [fetchingApprovers, setFetchingApprovers] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            fetchProjects();
            fetchApprovers();
        }
    }, [visible]);

    const fetchProjects = async () => {
        try {
            setFetchingProjects(true);
            const id = useUserStore.getState().id;
            const response = await projectService.searchProjects({
                searchCondition: {
                    is_delete: false,
                    user_id: id,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                    totalItems: 0,
                    totalPages: 0
                }
            });
            if (response.success) {
                setProjects(response.data.pageData);
            }
        } catch (error: any) {
            notification.error({
                message: "Error",
                description: "Failed to fetch projects. Please try again.",
            });
        } finally {
            setFetchingProjects(false);
        }
    };

    const fetchApprovers = async () => {
        try {
            setFetchingApprovers(true);
            const response = await userService.searchUsers({
                searchCondition: {
                    role_code: 'A003',
                    is_delete: false
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100
                }
            });
            if (response.success) {
                setApprovers(response.data.pageData);
            }
        } catch (error: any) {
            notification.error({
                message: "Error",
                description: "Failed to fetch approvers. Please try again.",
            });
        } finally {
            setFetchingApprovers(false);
        }
    };

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
        const endDate = form.getFieldValue('claim_end_date'); 
        if (date && endDate && endDate < date) {
            form.setFieldValue('claim_end_date', null);
        }
    };
    

    const handleSubmit = async (values: CreateClaimRequest) => {
        try {
            setLoading(true);
            
            const newRequest: CreateClaimRequest = {
                project_id: values.project_id,
                approval_id: values.approval_id,
                claim_name: values.claim_name,
                claim_start_date: dayjs(values.claim_start_date).format("YYYY-MM-DD"),
                claim_end_date: dayjs(values.claim_end_date).format("YYYY-MM-DD"),
                total_work_time: Number(values.total_work_time),
                remark: values.remark || undefined
            };

            const response = await claimService.createClaim(newRequest);
            
            if (response.success) {
                notification.success({
                    message: "Claim Created",
                    description: "Your claim has been created successfully.",
                });
                form.resetFields();
                onSuccess();
                onClose();
            } else {
                throw new Error(response.message || 'Failed to create claim');
            }
        } catch (error: any) {
            notification.error({
                message: "Error",
                description: error.message || "Failed to create claim. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className="justify text-center"
            title="Create New Claim"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleSubmit}
                preserve={false}
            >
                <Form.Item
                    label="Claim Name"
                    name="claim_name"
                    rules={[{ required: true, message: "Please enter claim name!" }]}
                >
                    <Input placeholder="Enter claim name" />
                </Form.Item>

                <Form.Item
                    label="Project Name"
                    name="project_id"
                    rules={[{ required: true, message: "Please select the project!" }]}
                >
                    <Select
                        placeholder="Select project"
                        loading={fetchingProjects}
                        options={projects.map(project => ({
                            value: project._id,
                            label: project.project_name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Approval Name"
                    name="approval_id"
                    rules={[{ required: true, message: "Please select the approval!" }]}
                >
                    <Select
                        placeholder="Select approver"
                        loading={fetchingApprovers}
                        options={approvers.map(approver => ({
                            value: approver._id,
                            label: approver.user_name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name="claim_start_date"
                    rules={[{ required: true, message: "Please select the start date!" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        onChange={handleStartDateChange}
                    />
                </Form.Item>

                <Form.Item 
                    label="End Date"
                    name="claim_end_date"
                    rules={[{ required: true, message: "Please select the end date!" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        disabledDate={(current) => {
                            if (!startDate) return false;
                            return current && current < startDate;
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Total Hours Worked"
                    name="total_work_time"
                    rules={[{ required: true, message: "Please enter total hours worked!" }]}
                >
                    <Input type="number" placeholder="Enter total hours worked" />
                </Form.Item>

                <Form.Item
                    label="Remark"
                    name="remark"
                >
                    <Input.TextArea rows={4} placeholder="Enter remark (optional)" />
                </Form.Item>

                <Form.Item className="">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit 
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateRequest;