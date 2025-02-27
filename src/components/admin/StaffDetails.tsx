import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface Staff {
  username: string;
  fullName: string; 
  role: string;
  email: string;
  phone: string;
  department: string;
  jobRank: string;
  salary: number;
  createdAt: string;
  updated_at: string;
  address: string;
}

interface StaffDetailsProps {
  visible: boolean;
  staff: Staff;
  onClose: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ visible, staff, onClose }) => {
  const roleMap: { [key: string]: string } = {
    A001: 'Admin',
    A002: 'Finance',
    A003: 'Approval',
    A004: 'Member',
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
            {staff?.username}
          </Descriptions.Item>
          <Descriptions.Item label="Full Name" span={1}>
            {staff?.fullName}  {/* Changed from staffName */}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={1}>
            <Tag color={
              staff?.role === 'A001' ? 'blue' :
              staff?.role === 'A002' ? 'green' :
              staff?.role === 'A003' ? 'purple' :
              staff?.role === 'A004' ? 'orange' : 'default'
            }>
              {roleMap[staff?.role] || staff?.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={1}>
            {staff?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={1}>
            {staff?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Department" span={1}>
            {staff?.department}
          </Descriptions.Item>
          <Descriptions.Item label="Job Rank" span={1}>
            {staff?.jobRank}
          </Descriptions.Item>
          <Descriptions.Item label="Salary" span={1}>
            ${staff?.salary?.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={1}>
            {staff?.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={1}>
            {staff?.updated_at}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {staff?.address}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default StaffDetails; 