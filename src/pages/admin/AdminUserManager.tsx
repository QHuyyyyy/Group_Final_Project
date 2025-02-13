import React, { useState } from 'react';
import { Card, Table, Button, Form, Input, InputNumber, Modal, Popconfirm, DatePicker, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import NavbarAdminUser from '../../components/admin/SideBarAdminUser';  
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface StaffMember {
  key: string;
  staffName: string;
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
  const roles = ['Admin', 'Manager', 'Employee', 'HR', 'Developer'];
  const [staffData, setStaffData] = useState<StaffMember[]>([
    {
      key: '1',
      staffName: 'John Doe',
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
      staffName: 'Jane Smith',
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
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    if (editingRecord) {
      setStaffData(prev => prev.map(staff => 
        staff.key === editingRecord.key ? { ...values, key: staff.key, isLocked: staff.isLocked } : staff
      ));
    } else {
      const newStaff = {
        ...values,
        key: Date.now().toString(),
        isLocked: false,
        createdAt: dayjs().format('YYYY-MM-DD')
      };
      setStaffData(prev => [...prev, newStaff]);
    }
    setIsModalVisible(false);
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
    staff.staffName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<StaffMember> = [
    {
      title: 'Staff Name',
      dataIndex: 'staffName',
      key: 'staffName'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span className={`
          ${role === 'Admin' ? 'text-red-500' : ''}
          ${role === 'Manager' ? 'text-blue-500' : ''}
          ${role === 'Developer' ? 'text-green-500' : ''}
          ${role === 'HR' ? 'text-purple-500' : ''}
          ${role === 'Employee' ? 'text-gray-500' : ''}
          font-medium
        `}>
          {role}
        </span>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: 'Job Rank',
      dataIndex: 'jobRank',
      key: 'jobRank'
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => (
        <span>
          {salary.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: StaffMember) => (
        <div className="space-x-2">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showDetails(record)} 
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            disabled={record.isLocked}
          />
          <Popconfirm
            title="Are you sure you want to delete this staff member?"
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
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavbarAdminUser onAddUser={handleAdd} />
      <div className="flex-1 ml-64 p-8 overflow-hidden">
        <Card className="shadow-md h-[calc(100vh-4rem)]">
          <div className="flex justify-between mb-4 items-center">
            <Button 
              type="default"
              onClick={() => navigate('/dashboard')}
              className="bg-white hover:bg-gray-100 text-gray-800"
            >
              Back to Dashboard
            </Button>
            <Input.Search
              placeholder="Search by name"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table 
              columns={columns} 
              dataSource={filteredStaffData}
              pagination={{
                pageSize: 10,
                total: filteredStaffData.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="overflow-hidden"
            />
          </div>
        </Card>

        {/* Edit/Add Modal */}
        <Modal
          title={<h2 className="text-2xl font-bold">{isAdding ? "Add New User" : "Edit User Information"}</h2>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          style={{ top: 20 }}
               
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={editingRecord || {}}
            onFinish={handleSave}
          >
            <div className="grid grid-cols-2 gap-4">
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
                <Select placeholder="Select a role">
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
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  precision={2}
                  step={0.01}

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
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please input phone number!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Please enter a valid phone number!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="createdAt"
                label="Created At"
                initialValue={dayjs()}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabled={!!editingRecord}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                { required: true, message: 'Please input address!' },
                { min: 5, message: 'Address must be at least 5 characters!' }
              ]}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Enter full address"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-4">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form.Item>
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
                <p className="font-bold text-gray-600">Staff Name:</p>
                <p className="text-lg">{selectedRecord.staffName}</p>
              </div>
              <div>
                <p className="font-bold text-gray-600">Role:</p>
                <p className={`text-lg ${
                  selectedRecord.role === 'Admin' ? 'text-red-500' : 
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