import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';

interface DeleteUserButtonProps {
  userId: string;
  isBlocked: boolean;
  onSuccess?: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, isBlocked, onSuccess }) => {
  const handleDelete = async () => {
    try {
      await userService.deleteUser(userId, {showSpinner:false});
      message.success('User deleted successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  return (
    <Popconfirm
      title="Do you want to delete this User member?"
      onConfirm={handleDelete}
      okText="Yes"
      cancelText="No"
      disabled={isBlocked}
    >
      <Button 
        type="text" 
        danger 
        icon={<DeleteOutlined />}
      />
    </Popconfirm>
  );
};

export default DeleteUserButton; 