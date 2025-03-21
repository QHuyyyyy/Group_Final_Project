import React, { useEffect, useState } from 'react';
import { Modal, Tag, Spin, Avatar } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BankOutlined,
} from '@ant-design/icons';
import { UserData } from '../../models/UserModel';
import { Employee } from '../../models/EmployeeModel';
import { employeeService } from '../../services/employee.service';

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
      title={<h3 className="text-xl font-semibold text-orange-500">Account Details</h3>}
      open={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
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
            <div className="flex flex-col items-center mb-4">
              <Avatar 
                size={120} 
                src={employeeData?.avatar_url}
                icon={!employeeData?.avatar_url && <UserOutlined />}
                className="mb-4 border-2 border-orange-200"
              />
              <h2 className="text-xl font-bold text-orange-500">{employeeData?.full_name || staff?.user_name}</h2>
              <div className="flex items-center mt-2">
                <BankOutlined className="text-orange-400 mr-2" />
                <span className="text-gray-600">{employeeData?.job_rank || 'N/A'}</span>
              </div>
              <div className="flex items-center mt-1">
                <TeamOutlined className="text-orange-400 mr-2" />
                <span className="text-gray-600">{employeeData?.department_code || 'N/A'}</span>
              </div>
            </div>
            
            {/* Tabs for different information sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-orange-50 py-2 px-4 border-b">
                  <h4 className="text-base font-semibold text-gray-700">Account Information</h4>
                </div>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50 w-1/3">User ID</td>
                      <td className="py-3 px-4">{staff?._id}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Username</td>
                      <td className="py-3 px-4">{staff?.user_name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Email</td>
                      <td className="py-3 px-4">{staff?.email}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Role</td>
                      <td className="py-3 px-4">
                        <Tag color={roleMap[staff?.role_code || '']?.color || 'default'}>
                          {roleMap[staff?.role_code || '']?.name || staff?.role_code}
                        </Tag>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Status</td>
                      <td className="py-3 px-4">
                        <Tag color={staff?.is_verified ? 'success' : 'error'}>
                          {staff?.is_verified ? 'Verified' : 'Unverified'}
                        </Tag>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Account</td>
                      <td className="py-3 px-4">
                        <Tag color={staff?.is_blocked ? 'error' : 'success'}>
                          {staff?.is_blocked ? 'Blocked' : 'Unlocked'}
                        </Tag>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Employee Information Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-orange-50 py-2 px-4 border-b">
                  <h4 className="text-base font-semibold text-gray-700">Employee Information</h4>
                </div>
                {employeeData ? (
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50 w-1/3">Full Name</td>
                        <td className="py-3 px-4">{employeeData.full_name}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Phone</td>
                        <td className="py-3 px-4">{employeeData.phone}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Address</td>
                        <td className="py-3 px-4">{employeeData.address}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Contract</td>
                        <td className="py-3 px-4">{employeeData.contract_type}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Start Date</td>
                        <td className="py-3 px-4">
                          {employeeData.start_date ? formatDate(employeeData.start_date).split(',')[0] : 'N/A'}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">End Date</td>
                        <td className="py-3 px-4">
                          {employeeData.end_date ? formatDate(employeeData.end_date).split(',')[0] : 'N/A'}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Department</td>
                        <td className="py-3 px-4">{employeeData.department_code}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-600 bg-gray-50">Job Rank</td>
                        <td className="py-3 px-4">{employeeData.job_rank}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No employee information available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StaffDetails; 