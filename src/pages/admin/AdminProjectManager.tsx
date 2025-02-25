import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarAdminProject from '../../components/admin/SideBarAdminProject';
import { Card, Table, Tag, Space, Button, Modal, Descriptions, Form, Input, Select, DatePicker, message, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../../services/projectService';

// Cập nhật lại danh sách nhân viên mẫu (chỉ có tên)
const mockEmployees = [
  { id: 1, name: 'Nguyễn Văn An' },
  { id: 2, name: 'Trần Thị Bình' },
  { id: 3, name: 'Lê Văn Cường' },
  { id: 4, name: 'Phạm Thị Dung' },
  { id: 5, name: 'Hoàng Văn Em' },
  { id: 6, name: 'Đỗ Thị Phương' },
  { id: 7, name: 'Vũ Đình Quang' },
  { id: 8, name: 'Ngô Thị Hương' },
  { id: 9, name: 'Bùi Văn Kiên' },
  { id: 10, name: 'Trịnh Thị Lan' },
];

// Thêm các hàm helper này vào trước component AdminProjectManager
const commonSelectProps = (role: string) => ({
  filterOption: (input: string, option: any) => 
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  style: { width: '100%' },
  'data-role': role,
  className: `select-${role}`
});

// Thêm interface để định nghĩa kiểu dữ liệu
interface SelectedEmployees {
  [key: string]: string[];
}

interface ProjectMember {
  project_role: string;
  user_id: string;
  employee_id: string;
  user_name: string;
  full_name: string;
}

interface Project {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  project_comment: string | null;
  project_members: ProjectMember[];
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const AdminProjectManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployees>({
    pm: [],
    qa: [],
    ba: [],
    technicalLead: [],
    technicalConsultant: [],
    developers: [],
    testers: []
  });
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

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

  // Xử lý khi startDate thay đổi
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    // Reset end date nếu end date nhỏ hơn start date mới
    const endDate = form.getFieldValue('endDate');
    if (date && endDate && endDate < date) {
      form.setFieldValue('endDate', null);
    }
  };

  // Thêm useEffect để fetch data
  useEffect(() => {
    console.log('Component mounted or dependencies changed');
    fetchProjects();
  }, [pagination.current, pagination.pageSize, searchText]);

  // Hàm fetch projects
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
          keyword: searchText,
          is_delete: false
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize
        }
      });

      console.log('API Response:', response);

      if (response.success) {
        setProjects(response.data.pageData);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo.totalItems
        }));
        console.log('Updated projects:', response.data.pageData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
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
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'To',
      dataIndex: 'project_end_date',
      key: 'project_end_date',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Project) => (
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

  const handleViewDetails = async (record: Project) => {
    try {
      setLoading(true);
      const response = await projectService.getProjectById(record._id);
      console.log('Project details response:', response);
      
      if (response) {
        setSelectedProject(response.data);
        setIsModalVisible(true);
      } else {
        message.error('Cannot get project details');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      message.error('Error occurred while getting project details');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEdit = (record: Project) => {
    setSelectedProject(record);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProject(null);
    setSelectedEmployees({
      pm: [],
      qa: [],
      ba: [],
      technicalLead: [],
      technicalConsultant: [],
      developers: [],
      testers: []
    });
  };

  const handleEditSubmit = (values: any) => {
    // Chuyển đổi đối tượng dayjs thành chuỗi ngày tháng
    const updatedValues = {
      ...values,
      from: values.from.format('YYYY-MM-DD'),
      to: values.to.format('YYYY-MM-DD'),
      details: {
        pm: values.pm,
        qa: values.qa,
        ba: values.ba,
        technicalLead: values.technicalLead,
        technicalConsultant: values.technicalConsultant,
        developers: values.developers.split(',').map((dev: string) => dev.trim()),
        testers: values.testers.split(',').map((tester: string) => tester.trim())
      }
    };

    // TODO: Thực hiện cập nhật dữ liệu
    console.log('Updated values:', updatedValues);
    setIsEditModalVisible(false);
    setSelectedProject(null);
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
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
    setSelectedEmployees({
      pm: [],
      qa: [],
      ba: [],
      technicalLead: [],
      technicalConsultant: [],
      developers: [],
      testers: []
    });
  };

  const handleCreateSubmit = (values: any) => {
    const newProject = {
      id: `PRJ${mockEmployees.length + 1}`.padStart(6, '0'),
      code: values.code,
      name: values.name,
      status: values.status,
      priority: values.priority,
      from: values.from.format('YYYY-MM-DD'),
      to: values.to.format('YYYY-MM-DD'),
      details: {
        pm: values.pm,
        qa: values.qa,
        ba: values.ba,
        technicalLead: values.technicalLead,
        technicalConsultant: values.technicalConsultant,
        developers: values.developers.split(',').map((dev: string) => dev.trim()),
        testers: values.testers.split(',').map((tester: string) => tester.trim())
      }
    };

    // TODO: Thực hiện thêm dự án mới
    console.log('New project:', newProject);
    setIsCreateModalVisible(false);
  };

  const handleEmployeeSelect = (value: string | string[], role: string) => {
    if (role === 'pm' || role === 'qa') {
      // Single select cho PM và QA
      const newValue = typeof value === 'string' ? [value] : [value[value.length - 1]];
      setSelectedEmployees(prev => ({
        ...prev,
        [role]: newValue
      }));
    } else {
      // Multiple select cho các role khác
      setSelectedEmployees(prev => ({
        ...prev,
        [role]: Array.isArray(value) ? value : [value]
      }));
    }
  };

  const renderEmployeeOptions = (role: string) => {
    return mockEmployees.map(emp => {
      const isDisabled = Object.entries(selectedEmployees).some(([currentRole, employees]) => 
        currentRole !== role && 
        employees.includes(emp.name)
      );
      
      return (
        <Select.Option 
          key={emp.id} 
          value={emp.name}
          disabled={isDisabled}
        >
          {emp.name} {isDisabled ? '(Đã được phân công)' : ''}
        </Select.Option>
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdminProject 
        favoriteProjects={favoriteProjects}
        projects={mockEmployees}
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
            placeholder="Search by project code..."
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
                ...pagination,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                }
              }}
              className="overflow-hidden"
            />
          </div>
        </Card>

        {/* Modal Chi tiết dự án */}
        <Modal
          title={<h2 className="text-2xl font-bold">Project Details</h2>}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          {loading ? (
            <div className="text-center py-4">
              <Spin />
            </div>
          ) : selectedProject ? (
            <Descriptions bordered column={2} className="mt-4">
              <Descriptions.Item label="Project Code" span={1}>
                {selectedProject.project_code}
              </Descriptions.Item>
              <Descriptions.Item label="Project Name" span={1}>
                {selectedProject.project_name}
              </Descriptions.Item>
              <Descriptions.Item label="Department" span={2}>
                {selectedProject.project_department}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedProject.project_description}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={1}>
                <Tag color={
                  selectedProject.project_status === 'New' ? 'blue' : 
                  selectedProject.project_status === 'Pending' ? 'orange' : 
                  selectedProject.project_status === 'Completed' ? 'green' : 'default'
                }>
                  {selectedProject.project_status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Start Date" span={1}>
                {dayjs(selectedProject.project_start_date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="End Date" span={1}>
                {dayjs(selectedProject.project_end_date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Comments" span={2}>
                {selectedProject.project_comment || 'No comments'}
              </Descriptions.Item>
              
              {/* Project Members Section */}
              <Descriptions.Item label="Project Members" span={2}>
                <div className="space-y-2">
                  {selectedProject.project_members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <span className="font-medium">{member.project_role}:</span>
                      <span>{member.full_name || member.user_name}</span>
                    </div>
                  ))}
                </div>
              </Descriptions.Item>

              {/* Additional Information */}
              <Descriptions.Item label="Created At" span={1}>
                {dayjs(selectedProject.created_at).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At" span={1}>
                {dayjs(selectedProject.updated_at).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Updated By" span={1}>
                {selectedProject.updated_by}
              </Descriptions.Item>
              <Descriptions.Item label="Project ID" span={1}>
                {selectedProject._id}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="No data available" />
          )}
        </Modal>

        {/* Modal Edit Project */}
        <Modal
          title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Project</h2>}
          open={isEditModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
          width={800}
          className="custom-modal"
        >
          {selectedProject && (
            <Form
              form={form}
              initialValues={{
                ...selectedProject,
                startDate: selectedProject?.project_start_date ? dayjs(selectedProject.project_start_date) : null,
                endDate: selectedProject?.project_end_date ? dayjs(selectedProject.project_end_date) : null,
              }}
              onFinish={handleEditSubmit}
              layout="vertical"
              className="bg-white p-4"
            >
              {/* Project Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Project Information</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Form.Item
                    name="project_code"
                    label="Project Code"
                    rules={[{ required: true, message: 'Please input project code!' }]}
                  >
                    <Input placeholder="Enter project code" className="rounded-md" />
                  </Form.Item>

                  <Form.Item
                    name="project_name"
                    label="Project Name"
                    rules={[{ required: true, message: 'Please input project name!' }]}
                  >
                    <Input placeholder="Enter project name" className="rounded-md" />
                  </Form.Item>

                  <Form.Item
                    name="project_status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                  >
                    <Select placeholder="Select status" className="rounded-md">
                      <Select.Option value="New">New</Select.Option>
                      <Select.Option value="Pending">Pending</Select.Option>
                      <Select.Option value="Completed">Completed</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select priority!' }]}
                  >
                    <Select placeholder="Select priority" className="rounded-md">
                      <Select.Option value="High">High</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="Low">Low</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: 'Please select start date!' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }}
                      disabledDate={disabledStartDate}
                      onChange={handleStartDateChange}
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

              {/* Team Members */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Project Manager - Single select */}
                  <Form.Item
                    name="project_members"
                    label="Project Manager"
                    rules={[{ required: true, message: 'Please select Project Manager!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select project manager"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* QA - Single select */}
                  <Form.Item
                    name="project_members"
                    label="Quality Assurance"
                    rules={[{ required: true, message: 'Please select QA!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select QA"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* Technical Lead - Multiple select */}
                  <Form.Item
                    name="project_members"
                    label="Technical Lead"
                    rules={[{ required: true, message: 'Please select Technical Lead!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select technical lead"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* BA - Multiple select */}
                  <Form.Item
                    name="project_members"
                    label="Business Analyst"
                    rules={[{ required: true, message: 'Please select BA!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select business analyst"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* Developers - Multiple select */}
                  <Form.Item
                    name="project_members"
                    label="Developers"
                    rules={[{ required: true, message: 'Please select developers!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select developers"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* Testers - Multiple select */}
                  <Form.Item
                    name="project_members"
                    label="Testers"
                    rules={[{ required: true, message: 'Please select testers!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select testers"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>

                  {/* Technical Consultant - Multiple select */}
                  <Form.Item
                    name="project_members"
                    label="Technical Consultancy"
                    rules={[{ required: true, message: 'Please select technical consultant!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select technical consultant"
                      {...commonSelectProps('project_members')}
                      onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                    >
                      {renderEmployeeOptions('project_members')}
                    </Select>
                  </Form.Item>
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
                  className="px-6 rounded-md"
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
          className="custom-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSubmit}
            className="bg-white p-4"
          >
            {/* Project Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Project Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  name="project_code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input placeholder="Enter project code" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  name="project_name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input placeholder="Enter project name" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  name="project_status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <Select placeholder="Select status" className="rounded-md">
                    <Select.Option value="New">New</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[{ required: true, message: 'Please select priority!' }]}
                >
                  <Select placeholder="Select priority" className="rounded-md">
                    <Select.Option value="High">High</Select.Option>
                    <Select.Option value="Medium">Medium</Select.Option>
                    <Select.Option value="Low">Low</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Start Date"
                  name="startDate"
                  rules={[{ required: true, message: 'Please select start date!' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    disabledDate={disabledStartDate}
                    onChange={handleStartDateChange}
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

            {/* Team Members */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Project Manager - Single select */}
                <Form.Item
                  name="project_members"
                  label="Project Manager"
                  rules={[{ required: true, message: 'Please select Project Manager!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select project manager"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* QA - Single select */}
                <Form.Item
                  name="project_members"
                  label="Quality Assurance"
                  rules={[{ required: true, message: 'Please select QA!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select QA"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* Technical Lead - Multiple select */}
                <Form.Item
                  name="project_members"
                  label="Technical Lead"
                  rules={[{ required: true, message: 'Please select Technical Lead!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select technical lead"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* BA - Multiple select */}
                <Form.Item
                  name="project_members"
                  label="Business Analyst"
                  rules={[{ required: true, message: 'Please select BA!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select business analyst"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* Developers - Multiple select */}
                <Form.Item
                  name="project_members"
                  label="Developers"
                  rules={[{ required: true, message: 'Please select developers!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select developers"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* Testers - Multiple select */}
                <Form.Item
                  name="project_members"
                  label="Testers"
                  rules={[{ required: true, message: 'Please select testers!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select testers"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>

                {/* Technical Consultant - Multiple select */}
                <Form.Item
                  name="project_members"
                  label="Technical Consultancy"
                  rules={[{ required: true, message: 'Please select technical consultant!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select technical consultant"
                    {...commonSelectProps('project_members')}
                    onChange={(value) => handleEmployeeSelect(value, 'project_members')}
                  >
                    {renderEmployeeOptions('project_members')}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                onClick={handleCreateModalClose}
                className="px-6 rounded-md"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="px-6 rounded-md"
              >
                Create Project
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProjectManager;