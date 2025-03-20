import React, { useEffect, useState } from 'react';
import { Modal, Tag, Spin, Avatar } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  LockOutlined,
  PhoneOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import { UserData } from '../../models/UserModel';
import { Employee } from '../../models/EmployeeModel';
import { employeeService } from '../../services/employee.service';
import { motion } from 'framer-motion';

interface StaffDetailsProps {
  visible: boolean;
  staff: UserData | null;
  onClose: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ visible, staff, onClose }) => {
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-400 via-blue-500 to-purple-600 rounded-full"></div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Account Details
          </h3>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      }
      width={900}
      className="custom-modal"
      bodyStyle={{ background: 'linear-gradient(to bottom right, #f0f7ff, #f5f3ff)' }}
    >
      <div className="py-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Account Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {/* Animated rings */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-blue-400 to-purple-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-blue-400 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 animate-spin-slow"></div>
                  
                  <Avatar 
                    size={120} 
                    src={employeeData?.avatar_url}
                    icon={!employeeData?.avatar_url && <UserOutlined />}
                    className="mb-4 border-2 border-blue-200 ring-4 ring-blue-50 shadow-xl group-hover:scale-105 transition-all duration-500 relative z-10"
                  />
                </div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 bg-clip-text text-transparent"
                >
                  {employeeData?.full_name || staff?.user_name}
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex items-center mt-2"
                >
                  <BankOutlined className="text-blue-500 mr-2" />
                  <span className="text-gray-600">{employeeData?.job_rank || 'N/A'}</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="flex items-center mt-1"
                >
                  <TeamOutlined className="text-blue-500 mr-2" />
                  <span className="text-gray-600">{employeeData?.department_code || 'N/A'}</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <div 
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    {roleMap[staff?.role_code || '']?.name || staff?.role_code}
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 via-blue-500 to-purple-600 rounded-full"></div>
                <h4 className="text-base font-semibold text-gray-700">Account Information</h4>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <UserOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User ID:</p>
                    <p className="text-sm font-medium">{staff?._id}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <UserOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Username:</p>
                    <p className="text-sm font-medium">{staff?.user_name}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <MailOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email:</p>
                    <p className="text-sm font-medium">{staff?.email}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <TeamOutlined className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Role:</p>
                    <Tag 
                      color={roleMap[staff?.role_code || '']?.color || 'default'} 
                      className="mt-1 animate-pulse-slow"
                    >
                      {roleMap[staff?.role_code || '']?.name || staff?.role_code}
                    </Tag>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <SafetyCertificateOutlined className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Status:</p>
                    <Tag 
                      color={staff?.is_verified ? 'success' : 'error'} 
                      className="mt-1 animate-pulse-slow"
                    >
                      {staff?.is_verified ? 'Verified' : 'Unverified'}
                    </Tag>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <LockOutlined className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500">Account:</p>
                    <Tag 
                      color={staff?.is_blocked ? 'error' : 'success'} 
                      className="mt-1 animate-pulse-slow"
                    >
                      {staff?.is_blocked ? 'Blocked' : 'Unlocked'}
                    </Tag>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right Column - Employee Information */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 via-blue-500 to-purple-600 rounded-full"></div>
                <h4 className="text-base font-semibold text-gray-700">Employee Information</h4>
              </div>
              
              {employeeData ? (
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <UserOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Full Name:</p>
                      <p className="text-sm font-medium">{employeeData.full_name}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <PhoneOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone:</p>
                      <p className="text-sm font-medium">{employeeData.phone}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <EnvironmentOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address:</p>
                      <p className="text-sm font-medium">{employeeData.address}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <FileProtectOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contract:</p>
                      <p className="text-sm font-medium">{employeeData.contract_type}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <CalendarOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date:</p>
                      <p className="text-sm font-medium">
                        {employeeData.start_date ? formatDate(employeeData.start_date).split(',')[0] : 'N/A'}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <CalendarOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date:</p>
                      <p className="text-sm font-medium">
                        {employeeData.end_date ? formatDate(employeeData.end_date).split(',')[0] : 'N/A'}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <TeamOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department:</p>
                      <p className="text-sm font-medium">{employeeData.department_code}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.3 }}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <BankOutlined className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Job Rank:</p>
                      <p className="text-sm font-medium">{employeeData.job_rank}</p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col justify-center items-center h-64 text-gray-500"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4 shadow-inner">
                    <UserOutlined className="text-blue-300 text-3xl" />
                  </div>
                  <p className="text-blue-500 font-medium">No employee information available</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StaffDetails; 