import React, { useState, useEffect } from 'react';
import { Card, Table, Button,Input,Space, Tag, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import SideBarAdminUser from '../../components/admin/SideBarAdminUser';  
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined,  
  EyeOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  SearchOutlined
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

      const response = await userService.searchUsers(params, {showSpinner:false});
    
      
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

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

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

  const columns: ColumnsType<UserData> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => pagination.pageSize * (pagination.current - 1) + index + 1,
      width: 50,
    },
    {
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 100,
    },
    {
      title: 'Role',
      dataIndex: 'role_code',
      key: 'role_code',
      width: 80,
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
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 120,
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss') 
    },
    {
      title: 'Verified',
      dataIndex: 'is_verified',
      key: 'is_verified',
      width: 60,
      render: (verified: boolean) => (
        <Tag color={verified ? 'success' : 'error'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_, record: UserData) => (
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
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => handleEmployeeClick(record._id)}
            className="text-green-600 hover:text-green-800"
          />
          <DeleteUserButton
            userId={record._id}
            isBlocked={record.is_blocked}
            onSuccess={() => {
              fetchUsers(pagination.current);
            }}
          />
          <BlockUserButton
            userId={record._id}
            isBlocked={record.is_blocked}
            onSuccess={() => fetchUsers(pagination.current)}
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
                  fetchUsers(page);
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

        <EmployeeDetailModal
          visible={isEmployeeModalVisible}
          employeeId={selectedEmployeeId}
          onClose={() => setIsEmployeeModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default AdminUserManager;
            