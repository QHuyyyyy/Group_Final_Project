import React, { useState } from 'react';
import NavbarAdminProject from '../components/NavbarAdminProject';
import { Card, Table, Tag, Space, Button, Modal, Descriptions, Form, Input, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

// Cập nhật mock data
const mockProjects = [
  {
    id: '1',
    code: 'PRJ001',
    name: 'Project Alpha',
    status: 'In Progress',
    from: '2024-01-01',
    to: '2024-04-01',
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
    from: '2024-01-15',
    to: '2024-03-15',
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

const AdminProjectManager: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavbarAdminProject 
        favoriteProjects={favoriteProjects}
        projects={mockProjects}
        onCreateProject={handleCreate}
      />
      <div className="flex-1 ml-64 p-8 overflow-hidden">
        <Card className="shadow-md h-[calc(100vh-4rem)]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Projects Overview</h1>
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table 
              columns={columns} 
              dataSource={mockProjects}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: mockProjects.length,
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
          title={<h2 className="text-2xl font-bold">Edit Project</h2>}
          open={isEditModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ 
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            paddingRight: '20px'
          }}
        >
          {selectedProject && (
            <Form
              initialValues={{
                code: selectedProject.code,
                name: selectedProject.name,
                status: selectedProject.status,
                priority: selectedProject.priority,
                from: dayjs(selectedProject.from),
                to: dayjs(selectedProject.to),
                pm: selectedProject.details.pm,
                qa: selectedProject.details.qa,
                ba: selectedProject.details.ba,
                technicalLead: selectedProject.details.technicalLead,
                technicalConsultant: selectedProject.details.technicalConsultant,
                developers: selectedProject.details.developers.join(', '),
                testers: selectedProject.details.testers.join(', ')
              }}
              onFinish={handleEditSubmit}
              layout="vertical"
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <Select>
                    <Select.Option value="In Progress">In Progress</Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[{ required: true, message: 'Please select priority!' }]}
                >
                  <Select>
                    <Select.Option value="High">High</Select.Option>
                    <Select.Option value="Medium">Medium</Select.Option>
                    <Select.Option value="Low">Low</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="from"
                  label="From"
                  rules={[{ required: true, message: 'Please select start date!' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  name="to"
                  label="To"
                  rules={[{ required: true, message: 'Please select end date!' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Form.Item
                  name="pm"
                  label="Project Manager"
                  rules={[{ required: true, message: 'Please input project manager!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="qa"
                  label="Quality Assurance"
                  rules={[{ required: true, message: 'Please input QA!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="ba"
                  label="Business Analyst"
                  rules={[{ required: true, message: 'Please input BA!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="technicalLead"
                  label="Technical Lead"
                  rules={[{ required: true, message: 'Please input technical lead!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="technicalConsultant"
                  label="Technical Consultant"
                  rules={[{ required: true, message: 'Please input technical consultant!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="developers"
                  label="Developers"
                  rules={[{ required: true, message: 'Please input developers!' }]}
                >
                  <Input.TextArea placeholder="Separate developers with commas" />
                </Form.Item>

                <Form.Item
                  name="testers"
                  label="Testers"
                  rules={[{ required: true, message: 'Please input testers!' }]}
                >
                  <Input.TextArea placeholder="Separate testers with commas" />
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <div className="flex justify-end space-x-4">
                  <Button onClick={handleEditModalClose}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Modal Create Project */}
        <Modal
          title={<h2 className="text-2xl font-bold">Create New Project</h2>}
          open={isCreateModalVisible}
          onCancel={handleCreateModalClose}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ 
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            paddingRight: '20px'
          }}
        >
          <Form
            onFinish={handleCreateSubmit}
            layout="vertical"
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="code"
                label="Project Code"
                rules={[{ required: true, message: 'Please input project code!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="name"
                label="Project Name"
                rules={[{ required: true, message: 'Please input project name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority!' }]}
              >
                <Select>
                  <Select.Option value="High">High</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="Low">Low</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="from"
                label="From"
                rules={[{ required: true, message: 'Please select start date!' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                name="to"
                label="To"
                rules={[{ required: true, message: 'Please select end date!' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                name="pm"
                label="Project Manager"
                rules={[{ required: true, message: 'Please input project manager!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="qa"
                label="Quality Assurance"
                rules={[{ required: true, message: 'Please input QA!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="ba"
                label="Business Analyst"
                rules={[{ required: true, message: 'Please input BA!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="technicalLead"
                label="Technical Lead"
                rules={[{ required: true, message: 'Please input technical lead!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="technicalConsultant"
                label="Technical Consultant"
                rules={[{ required: true, message: 'Please input technical consultant!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="developers"
                label="Developers"
                rules={[{ required: true, message: 'Please input developers!' }]}
              >
                <Input.TextArea placeholder="Separate developers with commas" />
              </Form.Item>

              <Form.Item
                name="testers"
                label="Testers"
                rules={[{ required: true, message: 'Please input testers!' }]}
              >
                <Input.TextArea placeholder="Separate testers with commas" />
              </Form.Item>
            </div>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-4">
                <Button onClick={handleCreateModalClose}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Create Project
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProjectManager;
