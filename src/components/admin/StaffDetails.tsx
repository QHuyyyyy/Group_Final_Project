import React from 'react';
import { Modal, Tag } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  LockOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  NumberOutlined
} from '@ant-design/icons';
import { UserData } from '../../models/UserModel';

interface StaffDetailsProps {
  visible: boolean;
  staff: UserData | null;
  onClose: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ visible, staff, onClose }) => {
  const roleMap: { [key: string]: { name: string; color: string } } = {
    A001: { name: 'Administrator', color: 'red' },
    A002: { name: 'Finance', color: 'blue' },
    A003: { name: 'BUL, PM', color: 'yellow' },
    A004: { name: 'All Members', color: 'default' }
  };

  const formatDate = (dateString: string) => {
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
      title={<h3 className="text-lg font-semibold text-gray-800">Staff Details</h3>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="custom-modal"
    >
      <div className="py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-blue-600 uppercase mb-1">
              <UserOutlined className="mr-2 text-blue-500" />
              Username
            </h4>
            <p className="text-sm text-gray-700">{staff?.user_name}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-purple-600 uppercase mb-1">
              <MailOutlined className="mr-2 text-purple-500" />
              Email
            </h4>
            <p className="text-sm text-gray-700">{staff?.email}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-green-600 uppercase mb-1">
              <TeamOutlined className="mr-2 text-green-500" />
              Role
            </h4>
            <Tag color={roleMap[staff?.role_code || '']?.color || 'default'} className="text-xs">
              {roleMap[staff?.role_code || '']?.name || staff?.role_code}
            </Tag>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-yellow-600 uppercase mb-1">
              <SafetyCertificateOutlined className="mr-2 text-yellow-500" />
              Verification Status
            </h4>
            <Tag color={staff?.is_verified ? 'success' : 'error'} className="text-xs">
              {staff?.is_verified ? 'Verified' : 'Unverified'}
            </Tag>
          </div>
          <div className="bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-red-600 uppercase mb-1">
              <LockOutlined className="mr-2 text-red-500" />
              Account Status
            </h4>
            <Tag color={staff?.is_blocked ? 'error' : 'success'} className="text-xs">
              {staff?.is_blocked ? 'Blocked' : 'Active'}
            </Tag>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-indigo-600 uppercase mb-1">
              <ClockCircleOutlined className="mr-2 text-indigo-500" />
              Created At
            </h4>
            <p className="text-sm text-gray-700">{staff?.created_at ? formatDate(staff.created_at) : ''}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg hover:bg-pink-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-pink-600 uppercase mb-1">
              <SyncOutlined className="mr-2 text-pink-500" />
              Updated At
            </h4>
            <p className="text-sm text-gray-700">{staff?.updated_at ? formatDate(staff.updated_at) : ''}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg hover:bg-teal-100 transition-colors duration-200">
            <h4 className="text-xs font-medium text-teal-600 uppercase mb-1">
              <NumberOutlined className="mr-2 text-teal-500" />
              Version
            </h4>
            <p className="text-sm text-gray-700">{staff?.__v}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StaffDetails; 