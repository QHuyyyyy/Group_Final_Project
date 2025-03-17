import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Card} from "antd";
import { Modal } from "antd";
import dayjs from 'dayjs';
import { claimService } from "../../services/claim.service";
import type { CreateClaim } from "../../models/ClaimModel";
import type { ProjectData } from "../../models/ProjectModel";
import type { User } from "../../models/UserModel";
import { useUserStore } from "../../stores/userStore";
import projectService from "../../services/project.service";
import { userService } from "../../services/user.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { CreateClaim_ProjectData } from "../../models/ProjectModel";

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
    const [form] = Form.useForm<CreateClaim>();
    const [loading, setLoading] = useState<boolean>(false);
    const [, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [approvers, setApprovers] = useState<User[]>([]);
    const [projectInfo, setProjectInfo] = useState<CreateClaim_ProjectData>({
        _id: '',
        project_name: '',
        project_department: '',
        project_members: [],
        project_start_date: '',
        project_end_date: '',
        project_description:'',
    });
    const userId = useUserStore((state) => state.id);

    useEffect(() => {
        if (visible && userId) {
            fetchInitialData();
        }
    }, [visible, userId]);

    const fetchInitialData = async () => {
        try {
            const [projectsResponse, approversResponse] = await Promise.all([
                projectService.searchProjects({
                    searchCondition: { is_delete: false, user_id: userId },
                    pageInfo: { pageNum: 1, pageSize: 100, totalItems: 0, totalPages: 0 }
                }),
                userService.searchUsers({
                    searchCondition: { role_code: 'A003', is_delete: false },
                    pageInfo: { pageNum: 1, pageSize: 100 }
                })
            ]);

            if (projectsResponse.success) {
                setProjects(projectsResponse.data.pageData);
            }
            if (approversResponse.success) {
                setApprovers(approversResponse.data.pageData);
            }
        } catch {
            toast.error("Failed to fetch initial data");
        }
    };

    const handleDateChange = (type: 'start' | 'end', date: dayjs.Dayjs | null) => {
        if (type === 'start') {
            setStartDate(date);
        }
    };

    const handleProjectChange = (projectId: string) => {
        if (projectId === 'none') {
            setProjectInfo({
                _id: '',
                project_name: '',
                project_department: '',
                project_members: [],
                project_start_date: '',
                project_end_date: '',
                project_description:'',
            });
            form.setFieldsValue({
                claim_start_date: undefined,
                claim_end_date: undefined,
                total_work_time: 0
            });
            setStartDate(null);
            return;
        }

        const selectedProject = projects.find(project => project._id === projectId);
        if (selectedProject) {
            const userMember = selectedProject.project_members.find(member => member.user_id === userId);
            if (!userMember) {
                toast.error("You are not a member of this project");
                form.setFieldValue('project_id', undefined);
                return;
            }
            setProjectInfo(selectedProject);
            form.setFieldsValue({
                claim_start_date: undefined,
                claim_end_date: undefined,
                total_work_time: 0
            });
            setStartDate(null);
        }
    };

    const handleSubmit = async (values: CreateClaim) => {
        try {
            setLoading(true);
            const response = await claimService.createClaim({
                ...values,
                claim_start_date: dayjs(values.claim_start_date).format("YYYY-MM-DD"),
                claim_end_date: dayjs(values.claim_end_date).format("YYYY-MM-DD"),
                total_work_time: Number(values.total_work_time)
            }, {showSpinner:false});
            
            if (response.success) {
                toast.success("Claim created successfully");
                form.resetFields();
                onSuccess();
                onClose();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create claim");
            } else {
                toast.error("Failed to create claim");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal
                className="justify text-center"
                title="Create New Claim"
                open={visible}
                onCancel={onClose}
                footer={null}
                destroyOnClose
                width={900}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left side - Information */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card 
                            size="small" 
                            title="Project Information"
                            style={{ height: 'fit-content', width: '100%' }}
                            styles={{
                                header: {
                                    backgroundColor: '#808080',
                                    padding: '8px 16px',
                                    fontSize: '16px',
                                    color: 'white',
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px'
                                },
                                body: {
                                    padding: '20px'
                                }
                            }}
                        >
                            {projectInfo._id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 500 }}>Department:</span>
                                        <span>{projectInfo.project_department || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 500 }}>Role:</span>
                                        <span>{projectInfo.project_members.find(member => member.user_id === userId)?.project_role || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 500 }}>Duration:</span>
                                        <span>{`${dayjs(projectInfo.project_start_date).format('DD/MM/YYYY')} - ${dayjs(projectInfo.project_end_date).format('DD/MM/YYYY')}`}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 500 }}>Project Description:</span>
                                        <span>{projectInfo.project_description || 'N/A'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#999' }}>
                                    Please select a project to view information
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right side - Create Form */}
                    <div>
                        <Card 
                            size="small" 
                            title="Create Claim"
                            style={{ height: 'fit-content', width: '100%' }}
                            styles={{
                                header: {
                                    backgroundColor: '#808080',
                                    padding: '8px 16px',
                                    fontSize: '16px',
                                    color: 'white',
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px'
                                },
                                body: {
                                    padding: '20px'
                                }
                            }}
                        >
                            <Form 
                                form={form} 
                                layout="vertical" 
                                onFinish={handleSubmit}
                                preserve={false}
                                style={{ maxWidth: '100%' }}
                            >
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
                                    name="project_id"
                                    style={{ marginBottom: '12px' }}
                                    rules={[{ required: true, message: "Please select the project!" }]}
                                >
                                    <Select
                                        placeholder="Select project"
                                        options={[
                                            { value: 'none', label: 'None' },
                                            ...projects.map(project => ({
                                                value: project._id,
                                                label: project.project_name
                                            }))
                                        ]}
                                        onChange={handleProjectChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Approval Name"
                                    name="approval_id"
                                    rules={[{ required: true, message: "Please select the approval!" }]}
                                >
                                    <Select
                                        placeholder="Select approver"
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
                                        onChange={(date) => handleDateChange('start', date)}
                                        disabled={!projectInfo._id}
                                        disabledDate={(current) => {
                                            if (!projectInfo._id) return false;
                                            return current && (
                                                current.isBefore(dayjs(projectInfo.project_start_date), 'day') ||
                                                current.isAfter(dayjs(projectInfo.project_end_date), 'day')
                                            );
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item 
                                    label="End Date"
                                    name="claim_end_date"
                                    rules={[{ required: true, message: "Please select the end date!" }]}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        onChange={(date) => handleDateChange('end', date)}
                                        disabled={!projectInfo._id}
                                        disabledDate={(current) => {
                                            if (!projectInfo._id) return false;
                                            const startDate = form.getFieldValue('claim_start_date');
                                            return current && (
                                                current.isBefore(startDate || projectInfo.project_start_date, 'day') ||
                                                current.isAfter(dayjs(projectInfo.project_end_date), 'day')
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
                                        Submit 
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CreateRequest; 