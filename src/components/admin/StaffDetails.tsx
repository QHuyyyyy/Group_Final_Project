import React, { useEffect, useState } from 'react';
import { Modal, Tag, Spin, Avatar, Switch, Tooltip } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BankOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  FileProtectOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { UserData } from '../../models/UserModel';
import { Employee } from '../../models/EmployeeModel';
import { employeeService } from '../../services/employee.service';
import { message } from 'antd';

interface StaffDetailsProps {
  visible: boolean;
  staff: UserData | null;
  onClose: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ visible, staff, onClose }) => {
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'employee'>('account');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [hiddenFields, setHiddenFields] = useState<Record<string, boolean>>({
    userId: true,
    email: false,
    phone: true,
    address: true,
  });

  const roleMap: { [key: string]: { name: string; color: string } } = {
    A001: { name: 'Administrator', color: 'red' },
    A002: { name: 'Finance', color: 'blue' },
    A003: { name: 'BUL, PM', color: 'yellow' },
    A004: { name: 'All Members', color: 'default' }
  };

  useEffect(() => {
    if (visible && staff && staff._id) {
      fetchEmployeeData(staff._id);
    }
  }, [visible, staff]);

  const fetchEmployeeData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployeeById(userId, {showSpinner: false});
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const toggleFieldVisibility = (field: string) => {
    setHiddenFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success(`${fieldName} đã được sao chép vào clipboard`);
      })
      .catch(() => {
        message.error('Không thể sao chép. Vui lòng thử lại.');
      });
  };

  // Hiển thị thông tin ẩn/hiện
  const renderSensitiveField = (value: string | undefined, fieldName: string, fieldKey: string) => {
    if (!value) return 'N/A';
    
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 truncate">
          {hiddenFields[fieldKey] ? '••••••••••••' : value}
        </div>
        <div className="flex items-center ml-2">
          <Tooltip title={hiddenFields[fieldKey] ? "Hiện thông tin" : "Ẩn thông tin"}>
            <button
              onClick={() => toggleFieldVisibility(fieldKey)}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
            >
              {hiddenFields[fieldKey] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </Tooltip>
          <Tooltip title={`Sao chép ${fieldName}`}>
            <button
              onClick={() => copyToClipboard(value, fieldName)}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors ml-1"
            >
              <CopyOutlined />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={<h3 className="text-xl font-semibold text-blue-600">Account Details</h3>}
      open={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      }
      width={900}
      className="custom-modal"
    >
      <div className="py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Profile Header with Avatar */}
            <div className="flex flex-col items-center mb-6">
              <Avatar 
                size={120} 
                src={employeeData?.avatar_url}
                icon={!employeeData?.avatar_url && <UserOutlined />}
                className="mb-4 border-2 border-blue-200 shadow-md"
              />
              <h2 className="text-xl font-bold text-blue-600">
                {employeeData?.full_name || staff?.user_name}
              </h2>
              <div className="flex items-center mt-2">
                <BankOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{employeeData?.job_rank || 'N/A'}</span>
              </div>
              <div className="flex items-center mt-1">
                <TeamOutlined className="text-blue-500 mr-2" />
                <span className="text-gray-600">{employeeData?.department_code || 'N/A'}</span>
              </div>
            </div>
            
            {/* Tab Selector */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'account' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('account')}
                >
                  <IdcardOutlined className="mr-2" />
                  Account Info
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'employee' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('employee')}
                >
                  <TeamOutlined className="mr-2" />
                  Employee Info
                </button>
              </div>
            </div>
            
            {/* Information Sections */}
            <div className="grid grid-cols-1 gap-6">
              {/* Account Information Card */}
              {activeTab === 'account' && (
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                  <div className="bg-blue-50 py-3 px-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <IdcardOutlined className="text-blue-600 mr-2 text-lg" />
                      <h4 className="text-base font-semibold text-gray-700">Account Information</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Hiện tất cả thông tin</span>
                      <Switch 
                        size="small" 
                        checked={showSensitiveInfo}
                        onChange={(checked) => {
                          setShowSensitiveInfo(checked);
                          setHiddenFields({
                            userId: !checked,
                            email: !checked,
                            phone: !checked,
                            address: !checked,
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <SearchOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">User ID</span>
                      </div>
                      <div className="w-2/3 px-4 text-gray-800 font-mono text-sm overflow-x-auto">
                        {renderSensitiveField(staff?._id, 'User ID', 'userId')}
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <UserOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Username</span>
                      </div>
                      <div className="w-2/3 px-4 text-gray-800">{staff?.user_name}</div>
                    </div>
                    
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <MailOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Email</span>
                      </div>
                      <div className="w-2/3 px-4 text-gray-800">
                        {renderSensitiveField(staff?.email, 'Email', 'email')}
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <ApartmentOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Role</span>
                      </div>
                      <div className="w-2/3 px-4">
                        <Tag color={roleMap[staff?.role_code || '']?.color || 'default'} className="px-3 py-1 rounded-full">
                          {roleMap[staff?.role_code || '']?.name || staff?.role_code}
                        </Tag>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <SafetyCertificateOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Status</span>
                      </div>
                      <div className="w-2/3 px-4">
                        <Tag color={staff?.is_verified ? 'success' : 'error'} className="px-3 py-1 rounded-full">
                          {staff?.is_verified ? 'Verified' : 'Unverified'}
                        </Tag>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-1/3 px-4 flex items-center">
                        <LockOutlined className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Account</span>
                      </div>
                      <div className="w-2/3 px-4">
                        <Tag color={staff?.is_blocked ? 'error' : 'success'} className="px-3 py-1 rounded-full">
                          {staff?.is_blocked ? 'Blocked' : 'Unlocked'}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Employee Information Card */}
              {activeTab === 'employee' && (
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                  <div className="bg-blue-50 py-3 px-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <TeamOutlined className="text-blue-600 mr-2 text-lg" />
                      <h4 className="text-base font-semibold text-gray-700">Employee Information</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Hiện tất cả thông tin</span>
                      <Switch 
                        size="small" 
                        checked={showSensitiveInfo}
                        onChange={(checked) => {
                          setShowSensitiveInfo(checked);
                          setHiddenFields({
                            userId: !checked,
                            email: !checked,
                            phone: !checked,
                            address: !checked,
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  {employeeData ? (
                    <div className="divide-y divide-gray-100">
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <UserOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Full Name</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">{employeeData.full_name}</div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <PhoneOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Phone</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">
                          {renderSensitiveField(employeeData.phone, 'Phone', 'phone')}
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <HomeOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Address</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">
                          {renderSensitiveField(employeeData.address, 'Address', 'address')}
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <FileProtectOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Contract</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">{employeeData.contract_type}</div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <CalendarOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Start Date</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">
                          {employeeData.start_date ? formatDate(employeeData.start_date).split(',')[0] : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <CalendarOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">End Date</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">
                          {employeeData.end_date ? formatDate(employeeData.end_date).split(',')[0] : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <ApartmentOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Department</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">{employeeData.department_code}</div>
                      </div>
                      
                      <div className="flex items-center py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-1/3 px-4 flex items-center">
                          <TrophyOutlined className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Job Rank</span>
                        </div>
                        <div className="w-2/3 px-4 text-gray-800">{employeeData.job_rank}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                      No employee information available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StaffDetails; 