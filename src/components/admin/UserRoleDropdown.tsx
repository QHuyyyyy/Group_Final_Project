import React, { useState } from 'react';
import { Dropdown, MenuProps, Tag, Modal, Form} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserData } from '../../models/UserModel';

interface UserRoleDropdownProps {
  record: UserData;
  roleOptions: { label: string; value: string }[];
  onRoleChange: (userId: string, newRoleCode: string) => Promise<void>;
}

const UserRoleDropdown: React.FC<UserRoleDropdownProps> = ({ 
  record, 
  roleOptions, 
  onRoleChange 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [form] = Form.useForm();
  const role = record.role_code;

  const handleRoleSelect = (roleCode: string) => {
    setSelectedRole(roleCode);
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      await form.validateFields();
      await onRoleChange(record._id, selectedRole!);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Form validation error handled automatically
    }
  };

  const items: MenuProps['items'] = roleOptions.map(option => ({
    key: option.value,
    label: option.label,
    onClick: () => handleRoleSelect(option.value),
  }));

  const getRoleLabel = (roleCode: string): string => {
    switch(roleCode) {
      case 'A001': return 'Administrator';
      case 'A002': return 'Finance';
      case 'A003': return 'BUL, PM';
      case 'A004': return 'Members';
      default: return roleCode;
    }
  };

  const getRoleColor = (roleCode: string): string => {
    switch(roleCode) {
      case 'A001': return 'red';
      case 'A002': return 'blue';
      case 'A003': return 'yellow';
      default: return 'default';
    }
  };

  return (
    <>
      <Dropdown 
        menu={{ items }}
        trigger={['click']}
      >
        <a onClick={e => e.preventDefault()} className="cursor-pointer">
          <Tag color={getRoleColor(role)}>
            {getRoleLabel(role)}
            <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
          </Tag>
        </a>
      </Dropdown>

      <Modal
        title="Confirm Role Change"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Form form={form}>
          <p>Are you sure you want to change the role of user "{record.user_name}" to {getRoleLabel(selectedRole || '')}?</p> 
        </Form>
      </Modal>
    </>
  );
};

export default UserRoleDropdown; 