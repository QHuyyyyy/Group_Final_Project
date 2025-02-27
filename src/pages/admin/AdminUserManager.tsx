import React, { useState, useEffect } from 'react';
import { Card, Table, Button,Input,Space, Tag, Select, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import SideBarAdminUser from '../../components/admin/SideBarAdminUser';  
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined,  
  EyeOutlined, 
  ArrowLeftOutlined,
  
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import StaffDetails from '../../components/admin/StaffDetails';
import { userService } from '../../services/userService';
import { message } from 'antd';
import { roleService } from '../../services/roleService';

import AddUserModal from '../../components/admin/AddUserModal';
import DeleteUserButton from '../../components/admin/DeleteUserButton';
import EditUserModal from '../../components/admin/EditUserModal';
import { debounce } from 'lodash';
import BlockUserButton from '../../components/admin/BlockUserButton';

interface StaffMember {
  _id: string;
  user_name: string;
  email: string;
  role_code: string;  // A001, A002, A003, A004
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
    totalItems: 0,
    totalPages: 0
  });
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBlockedFilter, setIsBlockedFilter] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [pagination.current, pagination.pageSize, searchText, isBlockedFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        searchCondition: {
          keyword: searchText || "",
          role_code: "",
          is_blocked: isBlockedFilter !== undefined ? isBlockedFilter : false,
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
          totalItems: response.pageInfo.totalItems,
          totalPages: response.pageInfo.totalPages
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
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  }, 2000);

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setEditingRecord(record);
    setIsEditModalVisible(true);
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
          role === 'A001' ? 'red' :
          role === 'A002' ? 'blue' :
          role === 'A003' ? 'yellow' :
           'default'
        }>
          {role === 'A001' ? 'Administrator' :
           role === 'A002' ? 'Finance' :
           role === 'A003' ? 'BUL, PM' :
           role === 'A004' ? 'All Members' : role}
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
          <DeleteUserButton
            userId={record._id}
            isBlocked={record.is_blocked}
            onSuccess={() => {
              fetchUsers();
            }}
          />
          <BlockUserButton
            userId={record._id}
            isBlocked={record.is_blocked}
            onSuccess={fetchUsers}
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
          
          
        </div>

        <Card className="shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Staff Information</h1>
            <div>
            <Space>
              <span>Blocked: </span>
              <Switch 
                checked={isBlockedFilter === true} 
                onChange={(checked) => {
                  setIsBlockedFilter(checked);
                  setPagination(prev => ({ ...prev, current: 1 }));
                }} 
              />
            </Space>
            <Input
            placeholder="Search by name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            className="ml-4"
          />
            </div>
           
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
                total: pagination.totalItems,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                  fetchUsers();
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

        <EditUserModal
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingRecord(null);
          }}
          onSuccess={() => {
            setIsEditModalVisible(false);
            fetchUsers();
          }}
          editingRecord={editingRecord}
          roleOptions={roleOptions}
        />

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
            