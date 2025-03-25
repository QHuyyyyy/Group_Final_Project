import React from 'react';
import { Button } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { toast } from 'react-toastify';

interface BlockUserButtonProps {
  userId: string;
  isBlocked: boolean;
  onSuccess: () => void;
}

const BlockUserButton: React.FC<BlockUserButtonProps> = ({ userId, isBlocked, onSuccess }) => {
  const handleBlockToggle = async () => {
    try {
      await userService.changeStatus({
        user_id: userId,
        is_blocked: !isBlocked
      }, {showSpinner:false});
      
      toast.success(`User successfully ${isBlocked ? 'unblocked' : 'blocked'}`);
      onSuccess();
    } catch (error) {
      toast.error('Failed to change user status');
    }
  };

  return (
    <Button
      type="text"
      icon={isBlocked ? <LockOutlined /> : <UnlockOutlined />}
      onClick={handleBlockToggle}
      className={isBlocked ? 'text-red-500' : 'text-green-500'}
    />
  );
};

export default BlockUserButton; 