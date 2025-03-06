import React from 'react';
import { Modal,  Tag } from 'antd';

interface Staff {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  verification_token: string;
  verification_token_expires: string;
  token_version: number;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  __v: number;
}

interface StaffDetailsProps {
  visible: boolean;
  staff: Staff;
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
      title={<h3 className="text-lg font-medium text-gray-800">Staff Details</h3>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="custom-modal"
    >
      <div className="py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Username</h4>
            <p>{staff?.user_name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Email</h4>
            <p>{staff?.email}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Role</h4>
            <Tag color={roleMap[staff?.role_code]?.color || 'default'}>
              {roleMap[staff?.role_code]?.name || staff?.role_code}
            </Tag>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Verification Status</h4>
            <Tag color={staff?.is_verified ? 'success' : 'error'}>
              {staff?.is_verified ? 'Verified' : 'Unverified'}
            </Tag>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Account Status</h4>
            <Tag color={staff?.is_blocked ? 'error' : 'success'}>
              {staff?.is_blocked ? 'Blocked' : 'Active'}
            </Tag>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Created At</h4>
            <p>{staff?.created_at ? formatDate(staff.created_at) : ''}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Updated At</h4>
            <p>{staff?.updated_at ? formatDate(staff.updated_at) : ''}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold">Version</h4>
            <p>{staff?.__v}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StaffDetails; 