import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdminProject from '../../components/admin/SideBarAdminProject';
import { Card, Table, Tag, Space, Button, Modal, Descriptions, Form, Input, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Cập nhật mock data
const mockProjects = [
  {
    id: '1',
    code: 'PRJ001',
    name: 'Project Alpha',
    status: 'In Progress',
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().add(3, 'month').format('YYYY-MM-DD'),
    priority: 'High',
    // Giữ lại thông tin chi tiết để dùng trong modal
    details: {
      pm: 'Nguyễn Văn A',
      qa: 'Trần Thị B',
      technicalLead: 'Lê Văn C',
      ba: 'Phạm Thị D',
      developers: ['Dev 1', 'Dev 2', 'Dev 3'],
      testers: ['Test 1', 'Test 2'],
      technicalConsultant: 'Hoàng Văn E',
    }
  },
  {
    id: '2',
    code: 'PRJ002',
    name: 'Project Beta',
    status: 'Completed',
    from: dayjs().add(1, 'week').format('YYYY-MM-DD'),
    to: dayjs().add(2, 'month').format('YYYY-MM-DD'),
    priority: 'Medium',
    details: {
      pm: 'Trần Văn X',
      qa: 'Nguyễn Thị Y',
      technicalLead: 'Phạm Văn Z',
      ba: 'Lê Thị W',
      developers: ['Dev 4', 'Dev 5'],
      testers: ['Test 3'],
      technicalConsultant: 'Vũ Văn K',
    }
  },
];

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

// Thêm hàm disabledDate để kiểm tra ngày
const disabledDate = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf('day');
};

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

const AdminProjectManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
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

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (_: string, record: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(record.id);
            }}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {favoriteProjects.includes(record.id) ? (
              <StarFilled className="text-yellow-500" />
            ) : (
              <StarOutlined />
            )}
          </button>
          <span>{record.code}</span>
        </div>
      ),
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'In Progress' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 120,
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      width: 120,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-gray-600 hover:text-gray-800"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  // Lọc dự án theo project code
  const filteredProjects = mockProjects.filter(project => 
    project.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewDetails = (record: any) => {
    setSelectedProject(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEdit = (record: any) => {
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
      id: `PRJ${mockProjects.length + 1}`.padStart(6, '0'),
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
      <NavbarAdminProject 
        favoriteProjects={favoriteProjects}
        projects={mockProjects}
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
              dataSource={filteredProjects}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: filteredProjects.length,
                showSizeChanger: true,
                showQuickJumper: true,
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
          {selectedProject && (
            <Descriptions bordered column={2} className="mt-4">
              <Descriptions.Item label="Project Code" span={1}>
                {selectedProject.code}
              </Descriptions.Item>
              <Descriptions.Item label="Project Name" span={1}>
                {selectedProject.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={1}>
                <Tag color={selectedProject.status === 'In Progress' ? 'blue' : 'green'}>
                  {selectedProject.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority" span={1}>
                <Tag color={selectedProject.priority === 'High' ? 'red' : selectedProject.priority === 'Medium' ? 'orange' : 'green'}>
                  {selectedProject.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="From" span={1}>
                {selectedProject.from}
              </Descriptions.Item>
              <Descriptions.Item label="To" span={1}>
                {selectedProject.to}
              </Descriptions.Item>
              <Descriptions.Item label="Project Manager" span={2}>
                {selectedProject.details.pm}
              </Descriptions.Item>
              <Descriptions.Item label="Quality Assurance" span={2}>
                {selectedProject.details.qa}
              </Descriptions.Item>
              <Descriptions.Item label="Business Analyst" span={2}>
                {selectedProject.details.ba}
              </Descriptions.Item>
              <Descriptions.Item label="Technical Lead" span={2}>
                {selectedProject.details.technicalLead}
              </Descriptions.Item>
              <Descriptions.Item label="Technical Consultant" span={2}>
                {selectedProject.details.technicalConsultant}
              </Descriptions.Item>
              <Descriptions.Item label="Developers" span={2}>
                {selectedProject.details.developers.join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Testers" span={2}>
                {selectedProject.details.testers.join(', ')}
              </Descriptions.Item>
            </Descriptions>
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
                startDate: selectedProject?.from ? dayjs(selectedProject.from) : null,
                endDate: selectedProject?.to ? dayjs(selectedProject.to) : null,
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
                    name="code"
                    label="Project Code"
                    rules={[{ required: true, message: 'Please input project code!' }]}
                  >
                    <Input placeholder="Enter project code" className="rounded-md" />
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label="Project Name"
                    rules={[{ required: true, message: 'Please input project name!' }]}
                  >
                    <Input placeholder="Enter project name" className="rounded-md" />
                  </Form.Item>

                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                  >
                    <Select placeholder="Select status" className="rounded-md">
                      <Select.Option value="In Progress">In Progress</Select.Option>
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
                    name="pm"
                    label="Project Manager"
                    rules={[{ required: true, message: 'Please select Project Manager!' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select project manager"
                      {...commonSelectProps('pm')}
                      onChange={(value) => handleEmployeeSelect(value, 'pm')}
                    >
                      {renderEmployeeOptions('pm')}
                    </Select>
                  </Form.Item>

                  {/* QA - Single select */}
                  <Form.Item
                    name="qa"
                    label="Quality Assurance"
                    rules={[{ required: true, message: 'Please select QA!' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select QA"
                      {...commonSelectProps('qa')}
                      onChange={(value) => handleEmployeeSelect(value, 'qa')}
                    >
                      {renderEmployeeOptions('qa')}
                    </Select>
                  </Form.Item>

                  {/* Technical Lead - Multiple select */}
                  <Form.Item
                    name="technicalLead"
                    label="Technical Lead"
                    rules={[{ required: true, message: 'Please select Technical Lead!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select technical lead"
                      {...commonSelectProps('technicalLead')}
                      onChange={(value) => handleEmployeeSelect(value, 'technicalLead')}
                    >
                      {renderEmployeeOptions('technicalLead')}
                    </Select>
                  </Form.Item>

                  {/* BA - Multiple select */}
                  <Form.Item
                    name="ba"
                    label="Business Analyst"
                    rules={[{ required: true, message: 'Please select BA!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select business analyst"
                      {...commonSelectProps('ba')}
                      onChange={(value) => handleEmployeeSelect(value, 'ba')}
                    >
                      {renderEmployeeOptions('ba')}
                    </Select>
                  </Form.Item>

                  {/* Developers - Multiple select */}
                  <Form.Item
                    name="developers"
                    label="Developers"
                    rules={[{ required: true, message: 'Please select developers!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select developers"
                      {...commonSelectProps('developers')}
                      onChange={(value) => handleEmployeeSelect(value, 'developers')}
                    >
                      {renderEmployeeOptions('developers')}
                    </Select>
                  </Form.Item>

                  {/* Testers - Multiple select */}
                  <Form.Item
                    name="testers"
                    label="Testers"
                    rules={[{ required: true, message: 'Please select testers!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select testers"
                      {...commonSelectProps('testers')}
                      onChange={(value) => handleEmployeeSelect(value, 'testers')}
                    >
                      {renderEmployeeOptions('testers')}
                    </Select>
                  </Form.Item>

                  {/* Technical Consultant - Multiple select */}
                  <Form.Item
                    name="technicalConsultant"
                    label="Technical Consultancy"
                    rules={[{ required: true, message: 'Please select technical consultant!' }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select technical consultant"
                      {...commonSelectProps('technicalConsultant')}
                      onChange={(value) => handleEmployeeSelect(value, 'technicalConsultant')}
                    >
                      {renderEmployeeOptions('technicalConsultant')}
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
                  name="code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input placeholder="Enter project code" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input placeholder="Enter project name" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <Select placeholder="Select status" className="rounded-md">
                    <Select.Option value="In Progress">In Progress</Select.Option>
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
                  name="pm"
                  label="Project Manager"
                  rules={[{ required: true, message: 'Please select Project Manager!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select project manager"
                    {...commonSelectProps('pm')}
                    onChange={(value) => handleEmployeeSelect(value, 'pm')}
                  >
                    {renderEmployeeOptions('pm')}
                  </Select>
                </Form.Item>

                {/* QA - Single select */}
                <Form.Item
                  name="qa"
                  label="Quality Assurance"
                  rules={[{ required: true, message: 'Please select QA!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select QA"
                    {...commonSelectProps('qa')}
                    onChange={(value) => handleEmployeeSelect(value, 'qa')}
                  >
                    {renderEmployeeOptions('qa')}
                  </Select>
                </Form.Item>

                {/* Technical Lead - Multiple select */}
                <Form.Item
                  name="technicalLead"
                  label="Technical Lead"
                  rules={[{ required: true, message: 'Please select Technical Lead!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select technical lead"
                    {...commonSelectProps('technicalLead')}
                    onChange={(value) => handleEmployeeSelect(value, 'technicalLead')}
                  >
                    {renderEmployeeOptions('technicalLead')}
                  </Select>
                </Form.Item>

                {/* BA - Multiple select */}
                <Form.Item
                  name="ba"
                  label="Business Analyst"
                  rules={[{ required: true, message: 'Please select BA!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select business analyst"
                    {...commonSelectProps('ba')}
                    onChange={(value) => handleEmployeeSelect(value, 'ba')}
                  >
                    {renderEmployeeOptions('ba')}
                  </Select>
                </Form.Item>

                {/* Developers - Multiple select */}
                <Form.Item
                  name="developers"
                  label="Developers"
                  rules={[{ required: true, message: 'Please select developers!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select developers"
                    {...commonSelectProps('developers')}
                    onChange={(value) => handleEmployeeSelect(value, 'developers')}
                  >
                    {renderEmployeeOptions('developers')}
                  </Select>
                </Form.Item>

                {/* Testers - Multiple select */}
                <Form.Item
                  name="testers"
                  label="Testers"
                  rules={[{ required: true, message: 'Please select testers!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select testers"
                    {...commonSelectProps('testers')}
                    onChange={(value) => handleEmployeeSelect(value, 'testers')}
                  >
                    {renderEmployeeOptions('testers')}
                  </Select>
                </Form.Item>

                {/* Technical Consultant - Multiple select */}
                <Form.Item
                  name="technicalConsultant"
                  label="Technical Consultancy"
                  rules={[{ required: true, message: 'Please select technical consultant!' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select technical consultant"
                    {...commonSelectProps('technicalConsultant')}
                    onChange={(value) => handleEmployeeSelect(value, 'technicalConsultant')}
                  >
                    {renderEmployeeOptions('technicalConsultant')}
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