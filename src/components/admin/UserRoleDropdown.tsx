import React from 'react';
import { Dropdown, MenuProps, Tag } from 'antd';
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
  const role = record.role_code;

  const items: MenuProps['items'] = roleOptions.map(option => ({
    key: option.value,
    label: option.label,
    onClick: () => onRoleChange(record._id, option.value),
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
  );
};

export default UserRoleDropdown; 