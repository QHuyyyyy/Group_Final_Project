import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

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
    // A004: { name: 'All Members', color: ' purple' },
    A004: { name: 'All Members', color: 'default' }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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
      width={700}
      className="custom-modal"
    >
      <div className="py-4">
        <Descriptions column={2} bordered className="custom-descriptions">
          <Descriptions.Item label="Username" span={1}>
            {staff?.user_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={1}>
            {staff?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={1}>
            <Tag color={roleMap[staff?.role_code]?.color || 'default'}>
              {roleMap[staff?.role_code]?.name || staff?.role_code}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Verification Status" span={1}>
            <Tag color={staff?.is_verified ? 'success' : 'error'}>
              {staff?.is_verified ? 'Verified' : 'Unerified'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Account Status" span={1}>
            <Tag color={staff?.is_blocked ? 'error' : 'success'}>
              {staff?.is_blocked ? 'Blocked' : 'Active'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={1}>
            {staff?.created_at ? formatDate(staff.created_at) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={1}>
            {staff?.updated_at ? formatDate(staff.updated_at) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Version" span={1}>
            {staff?.__v}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default StaffDetails; 