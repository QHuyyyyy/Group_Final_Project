import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Modal, Popconfirm, Select, Space, Tag } from 'antd';
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
import { userService } from '../../services/userService';
import { message } from 'antd';
import { roleService } from '../../services/roleService';

import AddUserModal from '../../components/admin/AddUserModal';

interface StaffMember {
  _id: string;
  user_name: string;
  email: string;
  role_code: string;
  is_blocked: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
interface SearchParams {
  searchCondition: {
    keyword: string;
    role_code: string;
    is_blocked: boolean;
    is_delete: boolean;
    is_verified: string;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

const AdminUserManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<StaffMember | null>(null);
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        searchCondition: {
          keyword: searchText || "",
          role_code: "",
          is_blocked: false,
          is_delete: false,
          is_verified: ""
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize
        }
      };

      const response = await userService.searchUsers(params);
      console.log('Search response:', response);
      
      if (response && response.pageData) {
        setStaffData(response.pageData);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const roles = await roleService.getAllRoles();
      const options = roles.map(role => ({
        label: role.role_name, // Hiển thị role_name
        value: role.role_code  // Giá trị thực sự là role_code
      }));
      setRoleOptions(options);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Không thể tải danh sách vai trò');
    }
  };

  // Add a debounced search handler
  const handleSearch = (value: string) => {
    setSearchText(value);
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.created_at)
    });
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editingRecord) {
        setStaffData(prev => prev.map(staff => 
          staff._id === editingRecord._id 
            ? { ...values, _id: staff._id, is_blocked: staff.is_blocked }
            : staff
        ));
      } else {
        const newStaff = {
          ...values,
          _id: Date.now().toString(),
          is_blocked: false,
          createdAt: dayjs().format('YYYY-MM-DD')
        };
        setStaffData(prev => [...prev, newStaff]);
      }
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error('Error saving staff member:', error);
      message.error('An error occurred while saving the staff member.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    const newData = staffData.filter(item => item._id !== key);
    setStaffData(newData);
  };

  const handleBlockToggle = (record: StaffMember) => {
    const newData = staffData.map(item =>
      item._id === record._id ? { ...item, is_blocked: !item.is_blocked } : item
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

  const columns: ColumnsType<StaffMember> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 120,
    },
    {
      title: 'Role',
      dataIndex: 'role_code',
      key: 'role_code',
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
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
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
      title: 'Verified',
      dataIndex: 'is_verified',
      key: 'is_verified',
      width: 100,
      render: (verified: boolean) => (
        <Tag color={verified ? 'success' : 'warning'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      )
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
            onConfirm={() => handleDelete(record._id)}
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
            onChange={(e) => handleSearch(e.target.value)}
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
              dataSource={staffData}
              rowKey="_id"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                },
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="overflow-hidden"
              scroll={{ x: 1000 }}
            />
          </div>
        </Card>

        <AddUserModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          onSuccess={() => {
            setIsAddModalVisible(false);
            fetchUsers();
          }}
          roleOptions={roleOptions}
        />

        <Modal
          title={<h2 className="text-2xl font-bold">Complete Staff Information</h2>}
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
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="user_name"
                label="Username"
              >
                <Input disabled className="bg-gray-100" />
              </Form.Item>

              <Form.Item
                name="role_code"
                label="Role"
              >
                <Select
                  placeholder="Select role"
                  options={roleOptions}
                />
              </Form.Item>

              <Form.Item
                name="createdAt"
                label="Created At"
              >
                <Input disabled className="bg-gray-100" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
              >
                <Input />
              </Form.Item>
            </div>
          </Form>
        </Modal>

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
            