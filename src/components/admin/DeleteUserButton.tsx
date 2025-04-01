import React from 'react';
import { Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { toast } from 'react-toastify';

interface DeleteUserButtonProps {
  userId: string;
  isBlocked: boolean;
  onSuccess?: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, isBlocked, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const handleDelete = async () => {
    try {
      await userService.deleteUser(userId);
      toast.success('User deleted successfully');
      if (onSuccess) {
        onSuccess();
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <>
      <Button 
        type="text" 
        danger 
        icon={<DeleteOutlined />}
        disabled={isBlocked}
        onClick={showModal}
      />
      
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" danger onClick={handleDelete}>
            Confirm
          </Button>
        ]}
        maskClosable={false}
        closable={true}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  );
};

export default DeleteUserButton; 