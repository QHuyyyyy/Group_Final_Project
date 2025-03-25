import { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Form, Button, Tag,  Card } from "antd";
import dayjs from 'dayjs';
import React, { useMemo } from "react";
import { UpdateClaimRequest, ClaimById } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import projectService from "../../services/project.service";
import type { ProjectData } from "../../models/ProjectModel";
import { ClockCircleOutlined } from "@ant-design/icons";
import { userService } from "../../services/user.service";
import type { User } from "../../models/UserModel";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [approver, setApprover] = useState<User | null>(null);

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
                  
                    toast.error("Failed to fetch project details");
                }
            }
        };

        fetchProjectDetails();
    }, [claim?.project_id]);

    // Fetch approver details
    useEffect(() => {
        const fetchApproverInfo = async () => {
            if (claim?.approval_id) {
           
                    const response = await userService.getUserById(claim.approval_id, {showSpinner:false});
                    if (response.success && response.data) {
                        setApprover(response.data);
                    }
                
            }
        };

        fetchApproverInfo();
    }, [claim?.approval_id]);

    // Initialize form with claim data
    useEffect(() => {
        if (claim && projectDetails) {
            form.setFieldsValue({
                claim_name: claim.claim_name,
                project_id: claim.project_id,
                claim_start_date: dayjs(claim.claim_start_date),
                claim_end_date: dayjs(claim.claim_end_date),
                total_work_time: claim.total_work_time,
            });
        }
    }, [claim, projectDetails, form]);

    const handleDateChange = (field: 'claim_start_date' | 'claim_end_date', value: dayjs.Dayjs | null) => {
        if (field === 'claim_start_date') {
            const endDate = form.getFieldValue('claim_end_date');
            if (endDate && value && endDate.isBefore(value)) {
                form.setFieldValue('claim_end_date', value);
            }
        }
    };

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
                project_id: claim.project_id,
                claim_name: values.claim_name,
                claim_start_date: values.claim_start_date.format("YYYY-MM-DD"),
                claim_end_date: values.claim_end_date.format("YYYY-MM-DD"),
                total_work_time: values.total_work_time,
                approval_id: claim.approval_id,
            };

            await claimService.updateClaim(claim._id, updatedRequest, {showSpinner:false});
            toast.success("Claim updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            
            toast.error('Failed to update claim');
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
            width={900}
            className="claims-modal"
        >
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                {/* Left side - Read-only Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'start' }}>
                    <Card 
                        size="small" 
                        title="Project Information"
                        styles={{
                            header: {
                                backgroundColor: '#808080',
                                padding: '8px 16px',
                                fontSize: '16px',
                                color: 'white',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                            }
                        }}
                        style={{ height: 'fit-content', marginBottom: 0 }}
                    >
                        {projectDetails ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Department:</span>
                                    <span>{projectDetails.project_department || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Role:</span>
                                    <span>{projectDetails.project_members.find(member => member.user_id === claim.user_id)?.project_role || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Duration:</span>
                                    <span>{`${dayjs(projectDetails.project_start_date).format('DD/MM/YYYY')} - ${dayjs(projectDetails.project_end_date).format('DD/MM/YYYY')}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Project Description:</span>
                                    <span>{projectDetails.project_description || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999' }}>
                                Loading project information...
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right side - Editable Form */}
                <div>
                    <Card 
                        size="small" 
                        title="Update Claim"
                        styles={{
                            header: {
                                backgroundColor: '#808080',
                                padding: '8px 16px',
                                fontSize: '16px',
                                color: 'white',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                            }
                        }}
                    >
                        <Form 
                            form={form} 
                            layout="vertical" 
                            onFinish={handleSubmit}
                            style={{ maxWidth: '100%' }}
                            initialValues={{
                                project_id: claim.project_id
                            }}
                        >
                            <Form.Item
                                name="project_id"
                                hidden
                            >
                                <Input type="hidden" />
                            </Form.Item>

                            <Form.Item
                                label="Claim Name"
                                name="claim_name"
                                style={{ marginBottom: '16px' }}
                                rules={[{ required: true, message: "Please enter claim name!" }]}
                            >
                                <Input placeholder="Enter claim name" />
                            </Form.Item>

                            <Form.Item
                                label="Project Name"
                                style={{ marginBottom: '12px' }}
                            >
                                <Input 
                                    value={projectDetails?.project_name || 'N/A'}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item
                                label="Approval Name"
                                style={{ marginBottom: '12px' }}
                            >
                                <Input 
                                    value={approver?.user_name || 'N/A'}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item
                                label="Start Date"
                                name="claim_start_date"
                                rules={[{ required: true, message: "Please select start date!" }]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD"
                                    onChange={(date) => handleDateChange('claim_start_date', date)}
                                    disabledDate={(current) => {
                                        if (!projectDetails) return false;
                                        return current && (
                                            current.isBefore(dayjs(projectDetails.project_start_date), 'day') ||
                                            current.isAfter(dayjs(projectDetails.project_end_date), 'day')
                                        );
                                    }}
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
                                    disabledDate={(current) => {
                                        if (!projectDetails) return false;
                                        const startDate = form.getFieldValue('claim_start_date');
                                        return current && (
                                            (startDate && current.isBefore(startDate, 'day')) ||
                                            current.isBefore(dayjs(projectDetails.project_start_date), 'day') ||
                                            current.isAfter(dayjs(projectDetails.project_end_date), 'day')
                                        );
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Total Hours Worked"
                                name="total_work_time"
                                rules={[
                                    { required: true, message: "Please enter total hours worked!" },
                                ]}
                            >
                                <Input 
                                    type="number" 
                                    placeholder="Enter total hours worked"
                                    prefix={<ClockCircleOutlined className="text-blue-500" />}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading} 
                                    block
                                    style={{ 
                                        height: '40px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        backgroundColor: '#808080',

                                    }}             
                                >
                                    Update Claim
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateRequest;