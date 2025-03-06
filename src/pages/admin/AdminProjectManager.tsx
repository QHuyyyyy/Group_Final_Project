import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarAdminProject from '../../components/admin/SideBarAdminProject';
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined, SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../../services/project.service';
import { userService } from '../../services/user.service';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';
import { Project, ProjectData } from '../../models/ProjectModel';

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
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
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

  // Hàm disabledStartDate
  const disabledStartDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  // Hàm disabledEndDate
  const disabledEndDate = (current: dayjs.Dayjs) => {
    if (!startDate) {
      return current && current < dayjs().startOf('day');
    }
    return current && (current < dayjs().startOf('day') || current < startDate);
  };


  // Hàm xử lý thay đổi ngày bắt đầu cho form tạo mới
  const handleCreateStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    const endDate = createForm.getFieldValue('endDate');
    if (date && endDate && endDate < date) {
      createForm.setFieldValue('endDate', null);
    }
  };

  // Hàm xử lý thay đổi ngày bắt đầu cho form chỉnh sửa  
  const handleEditStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    const endDate = editForm.getFieldValue('endDate');
    if (date && endDate && endDate < date) {
      editForm.setFieldValue('endDate', null);
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
      console.log('Fetching projects with params:', {
        searchText,
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize
        }
      });

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
        message.error('Không thể tải dữ liệu dự án');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu dự án');
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
      message.success('Xóa dự án thành công');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Có lỗi xảy ra khi xóa dự án');
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);
    }
  };

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'project_code',
      key: 'project_code',
      width: 120,
    },
    {
      title: 'Project Name',
      dataIndex: 'project_name',
      key: 'project_name',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'project_status',
      key: 'project_status',
      width: 120,
      render: (status: string) => (
        <Tag color={
          status === 'New' ? 'blue' :
            status === 'Pending' ? 'orange' :
              'green'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'From',
      dataIndex: 'project_start_date',
      key: 'project_start_date',
      width: 150, // Tăng width để hiển thị thêm giờ
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
    },
    {
      title: 'To',
      dataIndex: 'project_end_date',
      key: 'project_end_date',
      width: 150, // Tăng width để hiển thị thêm giờ
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
    },
    {
      title: 'Favorite',
      key: 'favorite',
      width: 80,
      render: (_: any, record: Project) => (
        <Button
          type="text"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(record._id);
          }}
          icon={favoriteProjects.includes(record._id) ? <StarFilled className="text-yellow-400" /> : <StarOutlined />}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: ProjectData) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

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

      // Set các giá trị khác cho form
      editForm.setFieldsValue({
        project_name: record.project_name,
        project_code: record.project_code,
        project_department: record.project_department,
        project_description: record.project_description,
        project_status: record.project_status,
        startDate: dayjs(record.project_start_date),
        endDate: dayjs(record.project_end_date),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const handleEditSubmit = async (values: any) => {
    try {
      if (!selectedProject?._id) {
        message.error('Không tìm thấy project ID');
        return;
      }

      setLoading(true);

      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department || 'HR',
        project_description: values.project_description || '',
        project_status: values.project_status,
        project_start_date: dayjs(values.startDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
        project_members: editTeamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role,
          employee_id: '',
          user_name: '',
          full_name: ''
        })).filter(member => member.user_id && member.project_role)
      };

      const response = await projectService.updateProject(selectedProject._id, projectData);

      if (response) {
        toast.success('Cập nhật dự án thành công');
        setIsEditModalVisible(false);
        editForm.resetFields();
        fetchProjects();
        setEditTeamMembers([]);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Có lỗi xảy ra khi cập nhật dự án');
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

  const handleCreate = () => {
    createForm.setFieldsValue({
      technical_leader: [],
      business_analyst: [],
      developers: [],
      testers: [],
      technical_consultant: []
    });
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    createForm.resetFields();
    setTeamMembers([]); // Reset team members khi đóng modal
    setIsCreateModalVisible(false);
  };

  const handleCreateSubmit = async (values: any) => {
    try {
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
      toast.error('Failed to create project');
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


 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdminProject
        favoriteProjects={favoriteProjects}
        projects={projects}
        onCreateProject={handleCreate}
      />
      <div className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            Back to Dashboard
          </Button>

          <Input
            placeholder="Tìm kiếm dự án..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            className="ml-4"
          />
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Projects Overview</h1>
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

        {/* Modal Edit Project */}
        <Modal
          title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Project</h2>}
          open={isEditModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
          width={800}
          className="custom-modal"
        >
          {selectedProject && (
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleEditSubmit}
              initialValues={selectedProject}
            >
              {/* Project Information */}
              <div className="grid grid-cols-3 gap-x-6 mb-4">
                <Form.Item
                  name="project_code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input placeholder="Enter project code" />
                </Form.Item>

                <Form.Item
                  name="project_name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input placeholder="Enter project name" />
                </Form.Item>

                <Form.Item
                  name="project_department"
                  label="Department"
                  rules={[{ required: true, message: 'Please select department!' }]}
                >
                  <Select placeholder="Select department">
                    <Select.Option value="IT">IT Department</Select.Option>
                    <Select.Option value="HR">HR Department</Select.Option>
                    <Select.Option value="Marketing">Marketing Department</Select.Option>
                    <Select.Option value="Sales">Sales Department</Select.Option>
                    <Select.Option value="Finance">Finance Department</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="mb-4">
                <Form.Item
                  name="project_description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input project description!' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter project description"
                  />
                </Form.Item>
              </div>

              {/* Date Selection in 2 columns */}
              <div>
                <Form.Item
                  label="Start Date"
                  name="startDate"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    className="rounded-md"
                    disabledDate={disabledStartDate}
                    onChange={handleEditStartDateChange}
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="End Date"
                  name="endDate"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    className="rounded-md"
                    disabledDate={disabledEndDate}
                  />
                </Form.Item>
              </div>

              {/* Team Members Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {editTeamMembers.map((member, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-4 items-start">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thành viên
                        </label>
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn thành viên"
                          value={member.userId}
                          onChange={(value) => {
                            const newMembers = [...editTeamMembers];
                            newMembers[index].userId = value;
                            setEditTeamMembers(newMembers);
                          }}
                          options={users}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vai trò
                        </label>
                        <div className="flex gap-2">
                          <Select
                            style={{ width: '100%' }}
                            placeholder="Chọn vai trò"
                            value={member.role}
                            onChange={(value) => {
                              const newMembers = [...editTeamMembers];
                              newMembers[index].role = value;
                              setEditTeamMembers(newMembers);
                            }}
                            options={[
                              { value: 'Project Manager', label: 'Project Manager' },
                              { value: 'Quality Analytics', label: 'Quality Analytics' },
                              { value: 'Technical Leader', label: 'Technical Leader' },
                              { value: 'Business Analytics', label: 'Business Analytics' },
                              { value: 'Developer', label: 'Developer' },
                              { value: 'Tester', label: 'Tester' },
                              { value: 'Technical Consultant', label: 'Technical Consultant' }
                            ]}
                          />
                          <Button 
                            danger
                            onClick={() => {
                              setEditTeamMembers(editTeamMembers.filter((_, i) => i !== index));
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    block
                    onClick={() => {
                      setEditTeamMembers([...editTeamMembers, { userId: '', role: '' }]);
                    }}
                    className="mt-4"
                  >
                    + Thêm thành viên
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  onClick={handleEditModalClose}
                  className="px-6 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Update Project
                </Button>
              </div>
            </Form>
          )}
        </Modal>

        {/* Modal Create Project */}
        <Modal
          title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Project</h2>}
          open={isCreateModalVisible}
          onCancel={handleCreateModalClose}
          footer={null}
          width={800}
       
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateSubmit}
            className="bg-white p-4"
          >
            {/* Project Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Project Information</h3>
              <div className="grid grid-cols-3 gap-x-6 mb-4">
                <Form.Item
                  name="project_code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input placeholder="Enter project code" />
                </Form.Item>

                <Form.Item
                  name="project_name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input placeholder="Enter project name" />
                </Form.Item>

                <Form.Item
                  name="project_department"
                  label="Department"
                  rules={[{ required: true, message: 'Please select department!' }]}
                >
                  <Select placeholder="Select department">
                    <Select.Option value="IT">IT Department</Select.Option>
                    <Select.Option value="HR">HR Department</Select.Option>
                    <Select.Option value="Marketing">Marketing Department</Select.Option>
                    <Select.Option value="Sales">Sales Department</Select.Option>
                    <Select.Option value="Finance">Finance Department</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="mb-4">
                <Form.Item
                  name="project_description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input project description!' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter project description"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-x-6 mb-4">
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: 'Please select start date!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  className="rounded-md"
                  disabledDate={disabledStartDate}
                  onChange={handleCreateStartDateChange}
                />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: 'Please select end date!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={disabledEndDate}
                />
              </Form.Item>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {teamMembers.map((member, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4 items-start">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thành viên
                      </label>
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Chọn thành viên"
                        value={member.userId}
                        onChange={(value) => {
                          const newMembers = [...teamMembers];
                          newMembers[index].userId = value;
                          setTeamMembers(newMembers);
                        }}
                        options={users}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò
                      </label>
                      <div className="flex gap-2">
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Chọn vai trò"
                          value={member.role}
                          onChange={(value) => {
                            const newMembers = [...teamMembers];
                            newMembers[index].role = value;
                            setTeamMembers(newMembers);
                          }}
                          options={[
                            { value: 'Project Manager', label: 'Project Manager' },
                            { value: 'Quality Analytics', label: 'Quality Analytics' },
                            { value: 'Technical Leader', label: 'Technical Leader' },
                            { value: 'Business Analytics', label: 'Business Analytics' },
                            { value: 'Developer', label: 'Developer' },
                            { value: 'Tester', label: 'Tester' },
                            { value: 'Technical Consultant', label: 'Technical Consultant' }
                          ]}
                        />
                        <Button 
                          danger
                          onClick={() => {
                            setTeamMembers(teamMembers.filter((_, i) => i !== index));
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="dashed"
                  block
                  onClick={() => {
                    setTeamMembers([...teamMembers, { userId: '', role: '' }]);
                  }}
                  className="mt-4"
                >
                  + Thêm thành viên
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button onClick={handleCreateModalClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create Project</Button>
            </div>
          </Form>
        </Modal>

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
      </div>
    </div>
  );
};

export default AdminProjectManager;