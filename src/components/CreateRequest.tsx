import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, notification } from "antd";
import moment, { Moment } from "moment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const { Option } = Select;

interface RequestFormValues {
    name: string;
    project: string;
    startDate: Moment;
    endDate: Moment;
    totalHours: number;
    description: string;
}

const CreateRequest: React.FC = () => {
    const [form] = Form.useForm<RequestFormValues>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (values: RequestFormValues) => {
        setLoading(true);
        const newRequest = {
            ...values,
            startDate: moment(values.startDate).format("YYYY-MM-DD"),
            endDate: moment(values.endDate).format("YYYY-MM-DD"),
            status: "Draft",
        };

        setTimeout(() => {

            notification.success({
                message: "Request Created",
                description: "Your request has been created and saved as a Draft.",
            });

            form.resetFields();
            setLoading(false);

            navigate("/dashboard/claimrequest");
        }, 1000);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>

            {/* Nút "Back to Requests" nằm ở trên cùng */}
            <div style={{ marginBottom: "20px" }}>
                <Link to="/dashboard/claimrequest">
                    <Button type="default">
                        Back to Requests
                    </Button>
                </Link>
            </div>

            <h2>Create New Claim Request</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>

                <Form.Item
                    label="Employee Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the employee name!" }]}
                >
                    <Input placeholder="Enter employee name" />
                </Form.Item>

                <Form.Item
                    label="Project"
                    name="project"
                    rules={[{ required: true, message: "Please select the project!" }]}
                >
                    <Select placeholder="Select project">
                        <Option value="Project A">Project A</Option>
                        <Option value="Project B">Project B</Option>
                        <Option value="Project C">Project C</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: "Please select the start date!" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date!" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Total Hours Worked"
                    name="totalHours"
                    rules={[{ required: true, message: "Please enter total hours worked!" }]}
                >
                    <Input type="number" placeholder="Enter total hours worked" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter a description!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit Request
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
};

export default CreateRequest;
