
import { Modal, Form, Input, Select, Button } from "antd";
import { userService } from "../../services/userService";
import { message } from "antd";
import { toast } from "react-toastify";
import { InputVaild } from "../../constants/InputVaild";

interface AddUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  roleOptions: { label: string; value: string }[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  roleOptions,
}) => {
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

      if (
        !userData.email ||
        !userData.password ||
        !userData.user_name ||
        !userData.role_code
      ) {
        loadingMessage();
        message.error("Please fill in all required fields");
        return;
      }

      const response = await userService.createUser(userData);
      loadingMessage();

      if (response) {
        toast.success("User created successfully");
        form.resetFields();
        onSuccess();
      }
    } catch (apiError: any) {
      loadingMessage();
      if (apiError.response?.status === 400) {
        toast.error(
          apiError.response?.data?.message ||
            "Invalid user data. Please check your inputs."
        );
      } else {
        toast.error("An error occurred while creating the user.");
      }
    }
  };

  return (
    <Modal
      title={<h2 className="text-2xl font-bold">Add Account Staff</h2>}
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
       
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
       
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full max-w-md">
            <Form.Item
              name="user_name"
              label="Username"
              rules={[{ required: true, message: "Please input username!" }]}
              validateDebounce={500}
            >
              <Input onBlur={() => form.validateFields(["user_name"])} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              validateDebounce={1000}
            >
              <Input onBlur={() => form.validateFields(["email"])} />
            </Form.Item>

            <Form.Item
              name="role_code"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select placeholder="Select role" options={roleOptions} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
                {
                  pattern: InputVaild.password,
                  message: "Password must contain at least one uppercase & one special character!",
                },
              ]}
              validateDebounce={500}
              validateFirst={true}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The passwords do not match!")
                    );
                  },
                }),
              ]}
              validateDebounce={500}
            >
              <Input.Password />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUserModal;