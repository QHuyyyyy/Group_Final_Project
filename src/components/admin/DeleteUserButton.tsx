import React from 'react';
import { Button, Popconfirm} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { toast } from 'react-toastify';

interface DeleteUserButtonProps {
  userId: string;
  isBlocked: boolean;
  onSuccess?: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, isBlocked, onSuccess }) => {
  const handleDelete = async () => {
    try {
      await userService.deleteUser(userId);
      toast.success('User deleted successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to delete user');
      
    }
  };

  return (
    <Popconfirm
      title="Do you want to delete this User member?"
      onConfirm={handleDelete}
      okText="Yes"
      cancelText="No"
      disabled={isBlocked}
      okButtonProps={{ loading: false }}
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