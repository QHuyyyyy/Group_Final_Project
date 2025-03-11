import React from 'react';
import { Form, Input, Button, Modal, FormInstance } from 'antd';
import { userService } from '../../services/user.service';
import { InputVaild } from '../../constants/InputVaild';
import { KeyOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChangePasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  form: FormInstance;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onCancel, onSuccess, form }) => {
  const [loading, setLoading] = React.useState(false);

  const handleChangePassword = async (values: { old_password: string; new_password: string }) => {
    setLoading(true);
    try {
      await userService.changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      });
      toast.success('Password changed successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Change Password"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
    >
      <ToastContainer />
      <Form form={form} onFinish={handleChangePassword}>
        <Form.Item
          name="old_password"
          label={<span><SecurityScanOutlined /> Current Password</span>}
          rules={InputVaild.oldPassword}
        >
          <Input.Password placeholder="Enter your old password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="new_password"
          label={<span><KeyOutlined /> New Password</span>}
          rules={InputVaild.newPassword(form.getFieldValue)}
        >
          <Input.Password placeholder="Enter your new password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label={<span><KeyOutlined /> Confirm Password</span>}
          rules={InputVaild.confirmNewPassword(form.getFieldValue)}
        >
          <Input.Password placeholder="Confirm your new password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal; 