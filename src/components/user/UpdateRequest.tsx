import { useState } from "react";
import { Modal, Input, Select, DatePicker, Form, Button } from "antd";
import moment from "moment";
import dayjs from 'dayjs';
import React from "react";

const { TextArea } = Input;
const { Option } = Select;

interface UpdateRequestProps {
    visible: boolean;
    request: Request;
    onClose: () => void;
}

interface Request {
    id: number;
    name: string;
    project: string;
    totalHours: number;
    status: string;
    createdDate: string;
    startDate: string;
    endDate: string;
    description: string;
}

const UpdateRequest: React.FC<UpdateRequestProps> = ({ visible, request, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);

    // Sửa lại cách khởi tạo form
    React.useEffect(() => {
        const start = dayjs(request.startDate);
        setStartDate(start);
        form.setFieldsValue({
            name: request.name,
            project: request.project,
            startDate: start,
            endDate: dayjs(request.endDate),
            totalHours: request.totalHours,
            status: request.status,
            description: request.description
        });
    }, [request, form]);

    // Hàm disabledStartDate
    const disabledStartDate = (current: dayjs.Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    // Hàm disabledEndDate
    const disabledEndDate = (current: dayjs.Dayjs) => {
        if (!startDate) {
            return current && current < dayjs().startOf('day');
        }
        return current && (current < dayjs().startOf('day') || current < startDate);
    };

    // Xử lý khi startDate thay đổi
    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
        // Reset end date nếu end date nhỏ hơn start date mới
        const endDate = form.getFieldValue('endDate');
        if (date && endDate && endDate < date) {
            form.setFieldValue('endDate', null);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const updatedRequest = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD"), // Sử dụng dayjs format
            endDate: values.endDate.format("YYYY-MM-DD"), // Sử dụng dayjs format
        };

        console.log("Updated Request:", updatedRequest);
        
        setTimeout(() => {
            setLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <Modal
            title="Update Request"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Employee Name"
                    name="name"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Project"
                    name="project"
                    rules={[{ required: true, message: "Please select the project!" }]}
                >
                    <Select>
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
                    <DatePicker 
                        style={{ width: "100%" }}
                        disabledDate={disabledStartDate}
                        format="YYYY-MM-DD"
                        onChange={handleStartDateChange}
                    />
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date!" }]}
                >
                    <DatePicker 
                        style={{ width: "100%" }}
                        disabledDate={disabledEndDate}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>

                <Form.Item
                    label="Total Hours Worked"
                    name="totalHours"
                    rules={[{ required: true, message: "Please enter total hours worked!" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter a description!" }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateRequest;
