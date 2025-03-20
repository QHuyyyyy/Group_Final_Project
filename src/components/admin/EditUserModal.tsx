import React from 'react';
import { Modal, Form, Input, Button, Select} from 'antd';
import dayjs from 'dayjs';
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
  roleOptions,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        email: editingRecord.email,
        user_name: editingRecord.user_name,
        role_code: editingRecord.role_code,
        createdAt: dayjs(editingRecord.created_at).format('YYYY-MM-DD')
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
      
      if (values.role_code !== editingRecord.role_code) {
        await userService.changeRole({ 
          user_id: editingRecord._id, 
          role_code: values.role_code 
        }, {showSpinner:false});
      }

      toast.success('Staff member updated successfully');
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.error('Error saving staff member:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to update staff member. Please try again.',
      });
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

          <Form.Item
            name="role_code"
            label="Role"
          >
            <Select options={roleOptions} className="w-full" />
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Created At"
          >
            <Input disabled className="bg-gray-100" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;