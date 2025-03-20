import React from 'react';
import { Modal, Form, Input, Button} from 'antd';
import { userService } from '../../services/user.service';
import { UserData } from '../../models/UserModel';
import { toast } from 'react-toastify';

interface EditUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingRecord: UserData | null;
  roleOptions: { label: string; value: string }[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingRecord,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        email: editingRecord.email,
        user_name: editingRecord.user_name,
      });
    }
  }, [editingRecord, form]);

  const handleSave = async (values: any) => {
    try {
      if (!editingRecord?._id) {
        throw new Error('User ID is required for updating.');
      }

      const userInfo = {
        email: values.email,
        user_name: values.user_name,
      };
      
      await userService.updateUser(editingRecord._id, userInfo, {showSpinner:false});
      
      toast.success('Staff updated successfully');
      onSuccess();
      form.resetFields();
    } catch (error) {
      toast.error('Failed to update staff. Please try again.');
    }
  };

  return (
    <Modal
      title={<h2 className="text-2xl font-bold">Edit Staff Information</h2>}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={form.submit}
        >
          Save
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="user_name"
            label="Username"
          >
            <Input className="bg-gray-100" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;