import React, { useState } from 'react';
import { Card, Table, Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import SideBarAdminUser from '../../components/admin/SideBarAdminUser';  
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
import StaffDetails from '../../components/admin/StaffDetails';

interface StaffMember {
  key: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  department: string;
  jobRank: string;
  salary: number;
  email: string;
  phone: string;
  address: string;
  is_blocked: boolean;
  createdAt: string;
  updated_at: string;
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
      fullName: 'John Doe',
      password: 'password123',
      confirmPassword: 'password123',
      department: 'IT',
      jobRank: 'Senior Developer',
      salary: 5000,
      email: 'john.doe@example.com',
      phone: '0123456789',
      address: '123 Main St, City',
      is_blocked: false,
      createdAt: '2025-02-13',
      updated_at: '2025-02-13',
      role: 'Developer'
    },
    {
      key: '2',
      username: 'janesmith',
      fullName: 'Jane Smith',
      password: 'password456',
      confirmPassword: 'password456',
      department: 'HR',
      jobRank: 'Manager',
      salary: 6000,
      email: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Park Ave, Town',
      is_blocked: false,
      createdAt: '2025-02-13',
      updated_at: '2025-02-13',
      role: 'Manager'
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
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
          ? { ...formattedValues, key: staff.key, is_blocked: staff.is_blocked }
          : staff
      ));
    } else {
      const newStaff = {
        ...formattedValues,
        key: Date.now().toString(),
        is_blocked: false,
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

  const handleBlockToggle = (record: StaffMember) => {
    const newData = staffData.map(item =>
      item.key === record.key ? { ...item, is_blocked: !item.is_blocked } : item
    );
    setStaffData(newData);
  };

  const handleViewDetails = (staff: any) => {
    setSelectedStaff(staff);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedStaff(null);
  };

  const filteredStaffData = staffData.filter(staff => 
    staff.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<StaffMember> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
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
      width: 100,
    },
    {
      title: 'Job Rank',
      dataIndex: 'jobRank',
      key: 'jobRank',
      width: 130,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
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
            onClick={() => handleViewDetails(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.is_blocked}
            className="text-gray-600 hover:text-gray-800"
          />
          <Popconfirm
            title="Do you want to delete this staff member?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
            disabled={record.is_blocked}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
          <Button
            type="text"
            icon={record.is_blocked ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleBlockToggle(record)}
            className={record.is_blocked ? 'text-red-500' : 'text-green-500'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdminUser onAddUser={handleAdd} />
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
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full max-w-md">
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input username!' }]}
                  >
                    <Input />
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
                    name="role_code"
                    label="Role Code"
                    rules={[{ required: true, message: 'Please input role code!' }]}
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
                  name="fullName"
                  label="Full Name"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Role"
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
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="jobRank"
                  label="Job Rank"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="salary"
                  label="Salary"
                  
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
                  // rules={[
                  //   { required: true, message: 'Please input email!' },
                  //   { type: 'email', message: 'Please enter a valid email!' }
                  // ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                >
                  <Input />
                </Form.Item>
              </div>
            )}
          </Form>
        </Modal>

        {/* Details Modal */}
        <StaffDetails 
          visible={isDetailsModalVisible}
          staff={selectedStaff}
          onClose={handleDetailsModalClose}
        />
      </div>
    </div>
  );
};

export default AdminUserManager;
            