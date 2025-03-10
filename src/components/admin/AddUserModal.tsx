import { Modal, Form, Button } from "antd";
import { userService } from "../../services/user.service";
import { message } from "antd";
import { toast } from "react-toastify";
import { InputVaild } from "../../constants/InputVaild";
import CommonField from "./CommonFieldAddUser";

interface AddUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  roleOptions: { label: string; value: string }[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onCancel, onSuccess, roleOptions }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSave = async (values: any) => {
    const loadingMessage = message.loading("Creating user...", 0);

    try {
      const userData = {
        email: values.email.trim(),
        password: values.password,
        user_name: values.user_name.trim(),
        role_code: values.role_code.trim(),
      };

      const response = await userService.createUser(userData);
      loadingMessage();

      if (response) {
        toast.success("User created successfully");
        form.resetFields();
        onSuccess();
      }
    } catch (apiError: any) {
      loadingMessage();
      toast.error(apiError.response?.data?.message || "An error occurred while creating the user.");
    }
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
