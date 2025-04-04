import { Modal, Form, Button, FormInstance } from "antd";
import { InputVaild } from "../../constants/InputVaild";
import CommonField from "./CommonFieldAddUser";
import { useEffect } from "react";

interface AddUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: any) => void;
  roleOptions: Array<{label: string, value: string}>;
  formRef?: React.RefObject<FormInstance | null>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onCancel, onSuccess, roleOptions, formRef  }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
  }, [form, formRef]);
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSave = async (values: any) => {
      onSuccess(values);
    
  };

  return (
    <Modal
      title={<h2 className="text-2xl font-bold text-center">Add Account Staff</h2>}
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400">
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit} className="bg-blue-600 hover:bg-blue-700">
          Save
        </Button>,
      ]}
      className="rounded-lg shadow-lg"
    >
      <Form form={form} layout="vertical" onFinish={handleSave} className="space-y-4">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full max-w-md">
            <CommonField name="user_name" label="Username" rules={InputVaild.required("Please input username!")} />
            <CommonField name="email" label="Email" type="email" rules={InputVaild.email} />
            <CommonField name="role_code" label="Role" type="select" options={roleOptions} rules={InputVaild.required("Please select role!")} />
            <CommonField name="password" label="Password" type="password" rules={InputVaild.password} />
            <CommonField name="confirmPassword" label="Confirm Password" type="password" rules={InputVaild.confirmPassword(form.getFieldValue)} />
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
