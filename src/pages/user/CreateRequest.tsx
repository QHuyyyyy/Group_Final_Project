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
import { employeeService } from "../../services/employee.service";
import { Employee } from "../../models/EmployeeModel";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [approvers, setApprovers] = useState<User[]>([]);
    const [fetchingProjects, setFetchingProjects] = useState<boolean>(false);
    const [fetchingApprovers, setFetchingApprovers] = useState<boolean>(false);
    const [employeeInfo, setEmployeeInfo] = useState<Employee>({
        _id: '',
        user_id: '',
        job_rank: '',
        contract_type: '',
        account: '',
        address: '',
        phone: '',
        full_name: '',
        avatar_url: '',
        department_code: '',
        salary: 0,
        start_date: '',
        end_date: '',
        created_at: '',
        updated_at: '',
        is_deleted: false,
        __v: 0
    });
    const [projectInfo, setProjectInfo] = useState<ProjectData>({
        _id: '',
        project_name: '',
        project_code: '',
        project_department: '',
        project_description: '',
        project_members: [],
        project_status: '',
        project_start_date: '',
        project_end_date: '',
        project_comment: '',
        updated_by: '',
        is_deleted: false,
        created_at: '',
        updated_at: '',
        __v: 0
    });
    const [totalWorkHours, setTotalWorkHours] = useState<number>(0);
    const userId = useUserStore((state) => state.id);

    useEffect(() => {
        if (visible) {
            fetchProjects();
            fetchApprovers();
        }
        if (visible && userId) {
            fetchEmployeeInfo();
        }
    }, [visible, userId]);

    const fetchProjects = async () => {
        try {
            setFetchingProjects(true);
            const response = await projectService.searchProjects({
                searchCondition: {
                    is_delete: false,
                    user_id: userId,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                    totalItems: 0,
                    totalPages: 0
                }
            });
            if (response.success && response.data.pageData.length > 0) {
                setProjects(response.data.pageData);                
                const firstProject = response.data.pageData[0];
                setProjectInfo(firstProject);
            }
        } catch (error: any) {
            toast.error("Failed to fetch projects. Please try again.");
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
            toast.error("Failed to fetch approvers. Please try again.");
        } finally {
            setFetchingApprovers(false);
        }
    };

    const fetchEmployeeInfo = async () => {
        try {
            const response = await employeeService.getEmployeeById(userId);
            if (response.success) {
                setEmployeeInfo(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch employee information");
        }
    };

    const calculateWorkHours = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        const days = end.diff(start, 'day') + 1;
        const hours = days * 8;
        return hours;
    };

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        if (!date) return;
        
        setStartDate(date);
        const endDate = form.getFieldValue('claim_end_date');
        
        if (endDate && dayjs(endDate).isBefore(date)) {
            form.setFieldValue('claim_end_date', null);
            form.setFieldValue('total_work_time', 0);
            setTotalWorkHours(0);
            return;
        }

        if (endDate) {
            const hours = calculateWorkHours(date, dayjs(endDate));
            setTotalWorkHours(hours);
            form.setFieldValue('total_work_time', hours);
        }
    };

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        if (!date || !startDate) {
            form.setFieldValue('total_work_time', 0);
            setTotalWorkHours(0);
            return;
        }
        
        const hours = calculateWorkHours(startDate, date);
        setTotalWorkHours(hours);
        form.setFieldsValue({
            total_work_time: hours
        });
    };

    const handleSubmit = async (values: CreateClaim) => {
        try {
            setLoading(true);
            
            // Chỉ gửi những thông tin cần thiết
            const newRequest = {
                project_id: values.project_id,
                approval_id: values.approval_id,
                claim_name: values.claim_name,
                claim_start_date: dayjs(values.claim_start_date).format("YYYY-MM-DD"),
                claim_end_date: dayjs(values.claim_end_date).format("YYYY-MM-DD"),
                total_work_time: Number(values.total_work_time)
            };

            const response = await claimService.createClaim(newRequest);
            
            if (response.success) {
                toast.success("Claim created successfully");
                form.resetFields();
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create claim");
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
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                    {/* Left side - Information */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'start' }}>
                        <Card 
                            className="mb-3" 
                            size="small" 
                            title="Staff Information" 
                            style={{ height: 'fit-content' }}
                            styles={{
                                header: {
                                    backgroundColor: '#f5f5f5',
                                    padding: '8px 12px'
                                }
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Staff Name:</span>
                                    <span>{employeeInfo.full_name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Staff ID:</span>
                                    <span>{employeeInfo.user_id}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Department:</span>
                                    <span>{employeeInfo.department_code}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Job Rank:</span>
                                    <span>{employeeInfo.job_rank}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Contract Type:</span>
                                    <span>{employeeInfo.contract_type}</span>
                                </div>
                            </div>
                        </Card>
                        <Card 
                            size="small" 
                            title="Project Information"
                            styles={{
                                header: {
                                    backgroundColor: '#f5f5f5',
                                    padding: '8px 12px'
                                }
                            }}
                            style={{ height: 'fit-content', marginBottom: 0 }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Project Name:</span>
                                    <span>{projectInfo.project_name || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>Project Code:</span>
                                    <span>{projectInfo.project_code || 'N/A'}</span>
                                </div>
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
                                    <span style={{ fontWeight: 500 }}>Status:</span>
                                    <span>{projectInfo.project_status || 'N/A'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right side - Create Form */}
                    <div>
                        <Card 
                            size="small" 
                            title="Create Claim"
                            styles={{
                                header: {
                                    backgroundColor: '#f5f5f5',
                                    padding: '8px 12px'
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
                                        onChange={handleEndDateChange}
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
                                    <Input 
                                        type="number" 
                                        placeholder="Enter total hours worked"
                                        value={totalWorkHours}
                                    />
                                </Form.Item>
                                
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading} 
                                        block
                                        style={{ height: '36px' }}
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