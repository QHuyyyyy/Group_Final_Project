import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { userService } from '../../services/user.service';
import { InputVaild } from '../../constants/InputVaild';
import { KeyOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

interface ChangePasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values: { old_password: string; new_password: string; confirm_password: string }) => {
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
   
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Modal
      title={<div style={{ textAlign: 'center', width: '100%' }}>Change Password</div>}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleChangePassword}>
        <Form.Item
          name="old_password"
          label={<span><SecurityScanOutlined /> Current Password</span>}
          rules={InputVaild.oldPassword}
          style={{ marginBottom: '16px', marginTop: '0', display: 'block' }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password placeholder="Enter your old password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="new_password"
          label={<span><KeyOutlined /> New Password</span>}
          rules={InputVaild.newPassword(form.getFieldValue)}
          style={{ marginBottom: '16px', marginTop: '0' }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password placeholder="Enter your new password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label={<span><KeyOutlined /> Confirm Password</span>}
          rules={InputVaild.confirmNewPassword(form.getFieldValue)}
          style={{ marginBottom: '16px', marginTop: '0' }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.Password placeholder="Confirm your new password" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};

export default ChangePasswordModal; 