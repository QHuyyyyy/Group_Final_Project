import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

interface CommonFieldProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "select" | "textarea";
  rules?: any[];
  options?: { label: string; value: string }[];
  className?: string;
  disabled?: boolean;
}

const CommonField: React.FC<CommonFieldProps> = ({ 
  name, 
  label, 
  type = "text", 
  rules, 
  options,
  className,
  disabled 
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules} className={className}>
      {type === "select" ? (
        <Select placeholder={`Select ${label}`} options={options} disabled={disabled} />
      ) : type === "password" ? (
        <Input.Password disabled={disabled} />
      ) : type === "textarea" ? (
        <TextArea disabled={disabled} />
      ) : (
        <Input disabled={disabled} />
      )}
    </Form.Item>
  );
};

export default CommonField;
