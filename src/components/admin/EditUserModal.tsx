import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import dayjs from 'dayjs';
import { userService } from '../../services/userService';

interface StaffMember {
  _id: string;
  email: string;
  role_code: string;
  user_name: string;
  created_at: string;
}

interface EditUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingRecord: StaffMember | null;
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
  const [isRoleEdit, setIsRoleEdit] = useState(false);

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

      if (isRoleEdit) {
        // Only update role
        await userService.changeRole(editingRecord._id, values.role_code);
      } else {
        // Only update user info
        await userService.updateUser(editingRecord._id, {
          email: values.email,
          user_name: values.user_name,
        });
      }

      console.log('Staff member updated:', values);
      onSuccess();
      form.resetFields();
      setIsRoleEdit(false);
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
      title={
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Staff Information</h2>
          <Select
            value={isRoleEdit ? "role" : "info"}
            onChange={(value) => setIsRoleEdit(value === "role")}
            style={{ width: 150 }}
          >
            <Select.Option value="info">Edit Info</Select.Option>
            <Select.Option value="role">Edit Role</Select.Option>
          </Select>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
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
          {!isRoleEdit && (
            <>
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
            </>
          )}

          <Form.Item
            name="createdAt"
            label="Created At"
          >
            <Input disabled className="bg-gray-100" />
          </Form.Item>

          {isRoleEdit && (
            <Form.Item
              name="role_code"
              label="Role"
            >
              <Select options={roleOptions} className="w-full" />
            </Form.Item>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal; 