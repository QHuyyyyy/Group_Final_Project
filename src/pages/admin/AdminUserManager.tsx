import React, { useState } from 'react';
import { Card, Table, Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import NavbarAdminUser from '../../components/admin/SideBarAdminUser';  
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  LockOutlined,
  UnlockOutlined,
  ArrowLeftOutlined,
  
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface StaffMember {
  key: string;
  username: string;
  staffName: string;
  password: string;
  confirmPassword: string;
  department: string;
  jobRank: string;
  salary: number;
  email: string;
  phone: string;
  address: string;
  isLocked: boolean;
  createdAt: string;
  role: string;
}

const AdminUserManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<StaffMember | null>(null);
  const { Option } = Select;
  const roles = ['Manager', 'Employee', 'HR', 'Developer'];
  const [staffData, setStaffData] = useState<StaffMember[]>([
    {
      key: '1',
      username: 'johndoe',
      staffName: 'John Doe',
      password: 'password123',
      confirmPassword: 'password123',
      department: 'IT',
      jobRank: 'Senior Developer',
      salary: 5000,
      email: 'john.doe@example.com',
      phone: '0123456789',
      address: '123 Main St, City',
      isLocked: false,
      createdAt: '2025-02-13',
      role: 'Developer'
    },
    {
      key: '2',
      username: 'janesmith',
      staffName: 'Jane Smith',
      password: 'password456',
      confirmPassword: 'password456',
      department: 'HR',
      jobRank: 'Manager',
      salary: 6000,
      email: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Park Ave, Town',
      isLocked: false,
      createdAt: '2025-02-13',
      role: 'Manager'
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StaffMember | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleAdd = () => {
    setIsAdding(true);
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setIsAdding(false);
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt)
    });
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    const formattedValues = {
      ...values,
      department: isAdding ? '' : values.department,
      jobRank: isAdding ? '' : values.jobRank,
      salary: isAdding ? 0 : Number(values.salary),
      email: isAdding ? '' : values.email,
      phone: isAdding ? '' : values.phone,
      address: isAdding ? '' : values.address,
      role: isAdding ? 'Employee' : values.role,
      createdAt: values.createdAt ? dayjs(values.createdAt).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      confirmPassword: values.confirmPassword
    };

    if (editingRecord) {
      setStaffData(prev => prev.map(staff => 
        staff.key === editingRecord.key 
          ? { ...formattedValues, key: staff.key, isLocked: staff.isLocked }
          : staff
      ));
    } else {
      const newStaff = {
        ...formattedValues,
        key: Date.now().toString(),
        isLocked: false,
        createdAt: dayjs().format('YYYY-MM-DD')
      };
      setStaffData(prev => [...prev, newStaff]);
    }
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    setIsAdding(false);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    const newData = staffData.filter(item => item.key !== key);
    setStaffData(newData);
  };

  const handleLockToggle = (record: StaffMember) => {
    const newData = staffData.map(item =>
      item.key === record.key ? { ...item, isLocked: !item.isLocked } : item
    );
    setStaffData(newData);
  };

  const showDetails = (record: StaffMember) => {
    setSelectedRecord(record);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedRecord(null);
  };

  const filteredStaffData = staffData.filter(staff => 
    staff.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<StaffMember> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 130,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color={
          role === 'Manager' ? 'blue' :
          role === 'Developer' ? 'green' :
          role === 'HR' ? 'purple' :
          'default'
        }>
          {role}
        </Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Job Rank',
      dataIndex: 'jobRank',
      key: 'jobRank',
      width: 150,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_, record: StaffMember) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.isLocked}
            className="text-gray-600 hover:text-gray-800"
          />
          <Popconfirm
            title="Do you want to delete this staff member?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
            disabled={record.isLocked}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
          <Button
            type="text"
            icon={record.isLocked ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleLockToggle(record)}
            className={record.isLocked ? 'text-red-500' : 'text-green-500'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavbarAdminUser onAddUser={handleAdd} />
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
            placeholder="Search by name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            className="ml-4"
          />
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Staff Information</h1>
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table 
              columns={columns} 
              dataSource={filteredStaffData}
              rowKey="key"
              pagination={{
                pageSize: 10,
                total: filteredStaffData.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="overflow-hidden"
              scroll={{ x: 1000 }}
            />
          </div>
        </Card>

        {/* Edit/Add Modal */}
        <Modal
          title={<h2 className="text-2xl font-bold">{isAdding ? "Add Account Staff" : "Complete Staff Information"}</h2>}
          open={isModalVisible}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={form.submit}>
              Save
            </Button>
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              role: 'Employee',
              salary: '',
              createdAt: dayjs(),
            }}
          >
            {isAdding ? (
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: 'Please input username!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="username"
                  label="Username"
                >
                  <Input disabled className="bg-gray-100" />
                </Form.Item>

                <Form.Item
                  name="staffName"
                  label="Staff Name"
                  rules={[{ required: true, message: 'Please input staff name!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: 'Please select a role!' }]}
                >
                  <Select>
                    {roles.map(role => (
                      <Option key={role} value={role}>{role}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true, message: 'Please input department!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="jobRank"
                  label="Job Rank"
                  rules={[{ required: true, message: 'Please input job rank!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="salary"
                  label="Salary"
                  rules={[{ required: true, message: 'Please input salary!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please input phone number!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please input address!' }]}
                >
                  <Input />
                </Form.Item>
              </div>
            )}
          </Form>
        </Modal>

        {/* Details Modal */}
        <Modal
          title={<h2 className="text-2xl font-bold">Staff Details</h2>}
          open={isDetailsModalVisible}
          onCancel={handleDetailsModalClose}
          footer={null}
          width={800}
        >
          {selectedRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-gray-600">Username:</p>
                <p className="text-lg">{selectedRecord.username}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Role:</p>
                <p className={`text-lg ${
                  selectedRecord.role === 'Manager' ? 'text-blue-500' :
                  selectedRecord.role === 'Developer' ? 'text-green-500' :
                  selectedRecord.role === 'HR' ? 'text-purple-500' :
                  'text-gray-500'
                } font-medium`}>
                  {selectedRecord.role}
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Email:</p>
                <p className="text-lg">{selectedRecord.email}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Phone:</p>
                <p className="text-lg">{selectedRecord.phone}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Department:</p>
                <p className="text-lg">{selectedRecord.department}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Job Rank:</p>
                <p className="text-lg">{selectedRecord.jobRank}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Salary:</p>
                <p className="text-lg">{selectedRecord.salary.toLocaleString('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Created At:</p>
                <p className="text-lg">{dayjs(selectedRecord.createdAt).format('DD/MM/YYYY')}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold text-gray-600">Address:</p>
                <p className="text-lg">{selectedRecord.address}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminUserManager;
            