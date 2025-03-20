import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Button, Modal, Form, Input,   message, Spin, Empty, Select } from 'antd';
import {  ArrowLeftOutlined, SearchOutlined,  } from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../../services/project.service';
import { userService } from '../../services/user.service';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';
import {  ProjectData } from '../../models/ProjectModel';
import { getProjectColumns } from '../../components/admin/ProjectColumns';
import ProjectModal from '../../components/admin/ProjectModal';
import { departmentService } from '../../services/Department.service';
import { debounce } from 'lodash';
import AdminSidebar from '../../components/admin/AdminSidebar';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); // Set default timezone to UTC+7

// Thêm interface để định nghĩa kiểu dữ liệu


const AdminProjectManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{userId: string, role: string}>>([]);
  const [editTeamMembers, setEditTeamMembers] = useState<Array<{userId: string, role: string}>>([]);
  const [departments, setDepartments] = useState<Array<{
    value: string;
    label: string;
  }>>([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatusProject, setSelectedStatusProject] = useState<ProjectData | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const handleSearch = debounce((value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1 
    }));
  }, 2000);

  const disabledStartDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    const endDate = editForm.getFieldValue('endDate') || createForm.getFieldValue('endDate');
    return (
      current < dayjs().startOf('day') || // Không cho chọn ngày trong quá khứ
      (endDate && current.isAfter(endDate)) // Không cho chọn startDate sau endDate
    );
  };

  // Hàm kiểm tra endDate
  const disabledEndDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    const startDate = editForm.getFieldValue('startDate') || createForm.getFieldValue('startDate');
    return (
      current < dayjs().startOf('day') || // Không cho chọn ngày trong quá khứ
      (startDate && current.isBefore(startDate)) // Không cho chọn endDate trước startDate
    );
  };

  // Hàm xử lý thay đổi ngày bắt đầu cho form tạo mới
  const handleCreateStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const endDate = createForm.getFieldValue('endDate');
      if (endDate && date.isAfter(endDate)) {
        createForm.setFieldValue('endDate', null);
        message.warning('Start date cannot be after end date');
      }
    }
    createForm.setFieldValue('startDate', date);
  };

  // Hàm xử lý thay đổi ngày bắt đầu cho form chỉnh sửa
  const handleEditStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const endDate = editForm.getFieldValue('endDate');
      if (endDate && date.isAfter(endDate)) {
        editForm.setFieldValue('endDate', null);
        message.warning('Start date cannot be after end date');
      }
    }
    editForm.setFieldValue('startDate', date);
  };

  // Thêm hàm xử lý thay đổi endDate cho form tạo mới
  const handleCreateEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const startDate = createForm.getFieldValue('startDate');
      if (startDate && date.isBefore(startDate)) {
        message.warning('End date cannot be before start date');
        createForm.setFieldValue('endDate', null);
      } else {
        createForm.setFieldValue('endDate', date);
      }
    }
  };

  // Thêm hàm xử lý thay đổi endDate cho form chỉnh sửa
  const handleEditEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const startDate = editForm.getFieldValue('startDate');
      if (startDate && date.isBefore(startDate)) {
        message.warning('End date cannot be before start date');
        editForm.setFieldValue('endDate', null);
      } else {
        editForm.setFieldValue('endDate', date);
      }
    }
  };

  // Thêm useEffect để fetch data khi component mount
  useEffect(() => {
    console.log('Component mounted or dependencies changed');
    fetchProjects();
  }, [pagination.current, pagination.pageSize, searchText]); // Thêm dependencies

  // Cập nhật lại hàm fetchProjects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      ;

      const response = await projectService.searchProjects({
        searchCondition: {
          keyword: searchText || "",
          is_delete: false
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          totalItems: 0,
          totalPages: 0
        }
      });



      // Kiểm tra cấu trúc response và cập nhật state
      if (response && response.data) {
        setProjects(response.data.pageData || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo?.totalItems || 0
        }));
        console.log('Updated projects:', response.data.pageData);
      } else {
        message.error(' Cannot load project data');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error(' An error occurred while fetching the project data');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý phân trang
  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setLoading(true);
      await projectService.deleteProject(projectToDelete);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('An error occurred while deleting the project');
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);
    }
  };

  const handleViewDetails = async (record: ProjectData) => {
    try {
      setLoading(true);
      
      // Lấy thông tin chi tiết của project bao gồm cả thông tin member
      const projectDetail = await projectService.getProjectById(record._id);
      
      if (projectDetail && projectDetail.data) {
        setSelectedProject(projectDetail.data);
      }
      
      setIsModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin dự án:', error);
      message.error('Đã xảy ra lỗi khi lấy thông tin dự án');
    } finally {
      setLoading(false);
    }
  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEdit = async (record: ProjectData) => {
    try {
      setLoading(true);
      setSelectedProject(record);

      // Khởi tạo team members từ project_members
      const initialTeamMembers = record.project_members.map(member => ({
        userId: member.user_id,
        role: member.project_role
      }));
      setEditTeamMembers(initialTeamMembers);
      setIsEditModalVisible(true);

    } catch (error) {
      console.error('Error in handleEdit:', error);
      message.error('Có lỗi xảy ra khi mở form chỉnh sửa');
    } finally {
      setLoading(false);
    }
  };



  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProject(null);

  };

  // Đổi tên hàm validateTeamMembers thành validateTeamMembersData để tránh conflict
  const validateTeamMembersData = (members: Array<{userId: string, role: string}>) => {
    if (members.length === 0) {
      message.error('Please add at least one member to the project');
      return false;
    }

    const isValid = members.every(member => member.userId && member.role);
    if (!isValid) {
      message.error('Please fill in all member information and roles');
      return false;
    }

    // Kiểm tra có đúng 1 PM và tối đa 1 QA
    const pmCount = members.filter(m => m.role === 'Project Manager').length;
    const qaCount = members.filter(m => m.role === 'Quality Analytics').length;

    if (pmCount !== 1) {
      message.error('Project must have exactly one Project Manager');
      return false;
    }

    if (qaCount > 1) {
      message.error('Project can have at most one Quality Analytics');
      return false;
    }

    return true;
  };

  // Sửa lại hàm handleEditSubmit
  const handleEditSubmit = async (values: any) => {
    try {
      if (!selectedProject?._id) {
        message.error('Project ID not found');
        return;
      }

      if (!validateTeamMembersData(editTeamMembers)) {
        return;
      }

      setLoading(true);

      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department,
        project_description: values.project_description,
        project_status: values.project_status,
        project_start_date: dayjs(values.startDate).format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate).format('YYYY-MM-DD'),
        project_members: editTeamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role,
          employee_id: '',
          user_name: '',
          full_name: ''
        }))
      };

      const response = await projectService.updateProject(selectedProject._id, projectData);
      if (response) {
        toast.success('Project updated successfully');
        setIsEditModalVisible(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      message.error('An error occurred while updating the project');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (projectId: string) => {
    setFavoriteProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      }
      return [...prev, projectId];
    });
  };

  const handleCreateModalClose = () => {
    createForm.resetFields();
    setTeamMembers([]); // Reset team members khi đóng modal
    setIsCreateModalVisible(false);
  };

  // Sửa lại hàm handleCreateSubmit
  const handleCreateSubmit = async (values: any) => {
    try {
      if (!validateTeamMembersData(teamMembers)) {
        return;
      }

      setLoading(true);
      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department,
        project_description: values.project_description,
        project_status: values.project_status,
        project_start_date: dayjs(values.startDate).utc().format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate).utc().format('YYYY-MM-DD'),
        project_members: teamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role,
          employee_id: '',
          user_name: '',
          full_name: ''
        }))
      };

      const response = await projectService.createProject(projectData);
      if (response.success) {
        toast.success('Project created successfully');
        setIsCreateModalVisible(false);
        createForm.resetFields();
        setTeamMembers([]); // Reset team members
        fetchProjects(); // Refresh danh sách
      }
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm để fetch users
  const fetchUsers = async (searchText: string = '') => {
    try {
      const response = await userService.searchUsers({
        searchCondition: {
          keyword: searchText,
          is_delete: false,
          is_blocked: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100 // Lấy nhiều user để có đủ lựa chọn
        }
      });

      if (response && response.data.pageData) {
        // Format data cho Select options
        const formattedUsers = response.data.pageData.map((user: any) => ({
          value: user._id,
          label: `${user.full_name || user.user_name} (${user.email})`,
          role_code: user.role_code
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    }
  };

  // Thêm useEffect để fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm useEffect để fetch departments khi component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Thêm hàm để fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      if (response && response.data) {
        const formattedDepartments = response.data.map(dept => ({
          value: dept.department_code,
          label: dept.department_name
        }));
        setDepartments(formattedDepartments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Không thể tải danh sách phòng ban');
    }
  };

  // Thêm hàm xử lý mở modal change status
  const handleChangeStatus = (record: ProjectData) => {
    setSelectedStatusProject(record);
    setNewStatus(record.project_status);
    setIsStatusModalVisible(true);
  };

  // Thêm hàm xử lý submit change status
  const handleStatusSubmit = async () => {
    if (!selectedStatusProject || !newStatus) return;

    try {
      setLoading(true);
      await projectService.changeProjectStatus({
        _id: selectedStatusProject._id,
        project_status: newStatus,
      });
      
      message.success('Project status updated successfully');
      setIsStatusModalVisible(false);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project status:', error);
      message.error('An error occurred while updating the project status');
    } finally {
      setLoading(false);
    }
  };

  // Di chuyển khai báo columns xuống sau khi đã định nghĩa đầy đủ các hàm xử lý
  const columns = getProjectColumns({
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleToggleFavorite,
    handleChangeStatus,
    favoriteProjects,
  });

  return (
    <div className="flex min-h-screen bg-sky-50">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <div className="mb-8">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
          </div>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Projects Overview</h1>
              <Input
                placeholder="Tìm kiếm dự án..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            
            <div className="overflow-auto custom-scrollbar">
              <Table
                columns={columns}
                dataSource={projects}
                rowKey="_id"
                loading={loading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Tổng ${total} dự án`
                }}
                onChange={handleTableChange}
                className="overflow-hidden"
              />
            </div>
          </Card>

          {/* Modal Project Details */}
          <Modal
            title={<h2 className="text-2xl font-bold mb-0">Project Details</h2>}
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={800}
            className="custom-modal"
          >
            {loading ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : selectedProject ? (
              <div className="mt-4">
                {/* Header - Key Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedProject.project_name}</h3>
                      <p className="text-gray-500 mt-1">Code: {selectedProject.project_code}</p>
                    </div>
                    <div className="text-right">
                      <Tag color={
                        selectedProject.project_status === 'New' ? 'blue' :
                          selectedProject.project_status === 'Pending' ? 'orange' :
                            'green'
                      } className="text-base px-4 py-1">
                        {selectedProject.project_status}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Main Content - Two Columns */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    {/* Timeline */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Start</p>
                          <p className="font-medium">{dayjs(selectedProject.project_start_date).format('DD/MM/YYYY')}</p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <p className="text-sm text-gray-500">End</p>
                          <p className="font-medium">{dayjs(selectedProject.project_end_date).format('DD/MM/YYYY')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Department & Description */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Department</h3>
                      <p className="text-gray-700 mb-4">{selectedProject.project_department}</p>

                      <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                      <p className="text-gray-700">{selectedProject.project_description}</p>
                    </div>
                  </div>

                  {/* Right Column - Project Members */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Project Members</h3>
                    <div className="space-y-3">
                      {[
                        { role: 'Project Manager', color: 'gold' },
                        { role: 'Quality Analytics', color: 'green' },
                        { role: 'Technical Leader', color: 'blue' },
                        { role: 'Business Analytics', color: 'purple' },
                        { role: 'Developer', color: 'cyan' },
                        { role: 'Tester', color: 'magenta' },
                        { role: 'Technical Consultant', color: 'geekblue' }
                      ].map(({ role, color }) => {
                        const members = selectedProject.project_members.filter(
                          member => member.project_role === role
                        );

                        return (
                          <div key={role} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                            <Tag color={color} className="min-w-[140px]">{role}</Tag>
                            <span className="text-gray-700 text-right">
                              {members.length > 0
                                ? members.map(m => m.full_name || m.user_name).join(', ')
                                : <span className="text-gray-400 italic">No information available</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer - Metadata */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Created: {dayjs(selectedProject.created_at).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
                    <span>Last updated: {dayjs(selectedProject.updated_at).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
                    <span>By: {selectedProject.updated_by}</span>
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="No data available" />
            )}
          </Modal>

          <ProjectModal
            visible={isCreateModalVisible}
            onCancel={handleCreateModalClose}
            onSubmit={handleCreateSubmit}
            isEditMode={false}
            users={users}
            departments={departments}
            disabledStartDate={disabledStartDate}
            disabledEndDate={disabledEndDate}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            handleStartDateChange={(date: dayjs.Dayjs | null) => handleCreateStartDateChange(date)}
            handleEndDateChange={(date: dayjs.Dayjs | null) => handleCreateEndDateChange(date)}
          />

          <ProjectModal
            visible={isEditModalVisible}
            onCancel={handleEditModalClose}
            onSubmit={handleEditSubmit}
            initialValues={selectedProject || undefined}
            isEditMode={true}
            users={users}
            departments={departments}
            disabledStartDate={disabledStartDate}
            disabledEndDate={disabledEndDate}
            teamMembers={editTeamMembers}
            setTeamMembers={setEditTeamMembers}
            handleStartDateChange={(date: dayjs.Dayjs | null) => handleEditStartDateChange(date)}
            handleEndDateChange={(date: dayjs.Dayjs | null) => handleEditEndDateChange(date)}
          />

          <Modal
            title="Confirm Delete Project"
            open={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalVisible(false);
              setProjectToDelete(null);
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <p>Are you sure you want to delete this project?</p>
            <p>This action cannot be undone.</p>
          </Modal>

          <Modal
            title="Change Project Status"
            open={isStatusModalVisible}
            onOk={handleStatusSubmit}
            onCancel={() => setIsStatusModalVisible(false)}
            okText="Update"
            cancelText="Cancel"
          >
            <div className="mb-4">
              <p>Current Status: <Tag color={
                selectedStatusProject?.project_status === 'New' ? 'blue' :
                selectedStatusProject?.project_status === 'Active' ? 'green' :
                selectedStatusProject?.project_status === 'Pending' ? 'orange' :
                selectedStatusProject?.project_status === 'Closed' ? 'red' :
                'default'
              }>{selectedStatusProject?.project_status}</Tag></p>
            </div>
            <div>
              <p className="mb-2">Select New Status:</p>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: '100%' }}
              >
                <Select.Option value="New">New</Select.Option>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Closed">Closed</Select.Option>
              </Select>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectManager;