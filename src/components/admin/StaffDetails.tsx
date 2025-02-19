import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface Staff {
  username: string;
  staffName: string;  // Thay đổi từ name thành staffName
  role: string;
  email: string;
  phone: string;
  department: string;
  jobRank: string;
  salary: number;
  createdAt: string;
  address: string;
}

interface StaffDetailsProps {
  visible: boolean;
  staff: Staff;
  onClose: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ visible, staff, onClose }) => {
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
          <Descriptions.Item label="Staff Name" span={1}>
            {staff?.staffName}  {/* Thay đổi từ name thành staffName */}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={1}>
            <Tag color={
              staff?.role === 'Manager' ? 'blue' :
              staff?.role === 'Developer' ? 'green' :
              staff?.role === 'HR' ? 'purple' : 'default'
            }>
              {staff?.role}
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
          <Descriptions.Item label="Created At" span={2}>
            {staff?.createdAt}
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