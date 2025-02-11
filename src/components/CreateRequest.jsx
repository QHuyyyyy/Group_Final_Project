import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, notification, Modal } from "antd";
import moment from "moment";

const { Option } = Select;

const CreateRequest = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        const { name, project, startDate, endDate, totalHours, description } = values;
        const newRequest = {
            name,
            project,
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
            totalHours,
            description,
            status: "Draft",
        };

        setTimeout(() => {
            notification.success({
                message: "Request Created",
                description: "Your request has been created and saved as a Draft.",
            });
            form.resetFields();
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
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
