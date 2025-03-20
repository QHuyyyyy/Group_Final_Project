import React, { useState, useEffect } from 'react';
import { Card, Table, Button,Input,Space, Tag, Switch} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined,  
  EyeOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import StaffDetails from '../../components/admin/StaffDetails';
import { userService } from '../../services/user.service';
import { message } from 'antd';
import { roleService } from '../../services/role.service';
import { UserData } from '../../models/UserModel';

import AddUserModal from '../../components/admin/AddUserModal';
import DeleteUserButton from '../../components/admin/DeleteUserButton';
import EditUserModal from '../../components/admin/EditUserModal';
import { debounce } from 'lodash';
import BlockUserButton from '../../components/admin/BlockUserButton';
import { SearchParams } from '../../models/UserModel';
import EmployeeDetailModal from '../../components/admin/EmployeeDetailModal';
import UserRoleDropdown from '../../components/admin/UserRoleDropdown';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');
const AdminUserManager: React.FC = () => {
  const navigate = useNavigate();
  const [editingRecord, setEditingRecord] = useState<UserData | null>(null);
  const [staffData, setStaffData] = useState<UserData[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<UserData | null>(null);
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
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  useEffect(() => {
    fetchUsers(pagination.current);
    fetchRoles();
  }, [pagination.current, pagination.pageSize, searchText, isBlockedFilter]);

  const fetchUsers = async (pageNum: number) => {
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
          pageNum: pageNum,
          pageSize: pagination.pageSize
        }
      };

      const response = await userService.searchUsers(params);
    
      
      if (response && response.data) {
        setStaffData(response.data.pageData as UserData[]);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages,
          current: pageNum
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
      const options = roles.data.map(role => ({
        label: role.role_name,
        value: role.role_code
      }));
      setRoleOptions(options);
    } catch (error) {
      console.error('Error fetching roles:', error);
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

  const handleEdit = (record: UserData) => {
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

  const handleEmployeeClick = (userId: string) => {
    setSelectedEmployeeId(userId);
    setIsEmployeeModalVisible(true);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || 10
    }));
    fetchUsers(page);
  };

  const handleRoleChange = async (userId: string, newRoleCode: string) => {
    try {
      setLoading(true);
      await userService.changeRole({
        user_id: userId,
        role_code: newRoleCode
      });
      
      message.success('User role updated successfully');
      fetchUsers(pagination.current);
    } catch (error) {
      console.error('Error changing user role:', error);
      message.error('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<UserData> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => pagination.pageSize * (pagination.current - 1) + index + 1,
      width: '70px',
    },
    {
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
      width: '180px',
    },
    {
      title: 'Role',
      dataIndex: 'role_code',
      key: 'role_code',
      width: '140px',
      render: (_, record: UserData) => (
        <UserRoleDropdown 
          record={record}
          roleOptions={roleOptions}
          onRoleChange={handleRoleChange}
        />
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '180px',
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '180px',
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
    },
    {
      title: 'Verified',
      dataIndex: 'is_verified',
      key: 'is_verified',
      width: '100px',
      render: (verified: boolean) => (
        <Tag color={verified ? 'success' : 'error'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '150px',
      render: (_, record: UserData) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="px-1.5"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="px-1.5"
          />
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => handleEmployeeClick(record._id)}
            className="px-1.5"
          />
          <DeleteUserButton
            userId={record._id}
            onSuccess={() => fetchUsers(pagination.current)}
            isBlocked={record.is_blocked}
          />
          <BlockUserButton
            userId={record._id}
            isBlocked={record.is_blocked}
            onSuccess={() => fetchUsers(pagination.current)}
          />
        </Space>
      ),
    }
  ];

  return (
    <div className="flex min-h-screen bg-sky-50">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
            
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
          
          <Card className="shadow-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Staff Information</h1>
            </div>
            <div className="overflow-auto custom-scrollbar">
              <Table
                columns={columns}
                dataSource={staffData}
                loading={loading}
                rowKey="_id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.totalItems,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} staff members`,
                  onChange: (page: number, pageSize: number) => {
                    handleTableChange(page, pageSize);
                  }
                }}
              />
            </div>
          </Card>
        </div>

        <AddUserModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          onSuccess={() => {
            setIsAddModalVisible(false);
            fetchUsers(pagination.current);
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
            fetchUsers(pagination.current);
          }}
          editingRecord={editingRecord}
          roleOptions={roleOptions}
        />

        <StaffDetails 
          visible={isDetailsModalVisible}
          staff={selectedStaff}
          onClose={handleDetailsModalClose}
        />

        {isEmployeeModalVisible && (
          <EmployeeDetailModal
            visible={isEmployeeModalVisible}
            employeeId={selectedEmployeeId}
            onClose={() => setIsEmployeeModalVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserManager;
            