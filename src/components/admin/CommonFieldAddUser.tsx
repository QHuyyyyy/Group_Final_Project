import { Form, Input, Select } from "antd";

interface CommonFieldProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "select";
  rules?: any[];
  options?: { label: string; value: string }[];
}

const CommonField: React.FC<CommonFieldProps> = ({ name, label, type = "text", rules , options }) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      {type === "select" ? (
        <Select placeholder={`Select ${label}`} options={options} />
      ) : type === "password" ? (
        <Input.Password />
      ) : (
        <Input />
      )}
    </Form.Item>
  );
};

export default CommonField;
