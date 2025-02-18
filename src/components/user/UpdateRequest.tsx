import { useState } from "react";
import { Modal, Input, Select, DatePicker } from "antd";
import moment from "moment";

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
    const [formData, setFormData] = useState<Request>({
        ...request,
        startDate: moment(request.startDate).format("YYYY-MM-DD"),
        endDate: moment(request.endDate).format("YYYY-MM-DD"),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date: moment.Moment | null, field: keyof Request) => {
        if (date) {
            setFormData({ ...formData, [field]: date.format("YYYY-MM-DD") });
        }
    };

    const handleSelectChange = (value: string, field: keyof Request) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        console.log("Updated Request:", formData);
        alert("Changes saved successfully!");
        onClose();
    };

    return (
        <Modal
            title="Update Request"
            open={visible}
            onCancel={onClose}
            onOk={handleSave}
            okText="Save Changes"
            cancelText="Cancel"
        >
            <div className="grid gap-4">
                <label>
                    <strong>Employee Name:</strong>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    <strong>Project:</strong>
                    <Select value={formData.project} onChange={(value) => handleSelectChange(value, "project")} style={{ width: "100%" }}>
                        <Option value="Project A">Project A</Option>
                        <Option value="Project B">Project B</Option>
                        <Option value="Project C">Project C</Option>
                    </Select>
                </label>
                <label>
                    <strong>Start Date:</strong>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={formData.startDate ? moment(formData.startDate) : null}
                        onChange={(date) => handleDateChange(date, "startDate")}
                    />
                </label>
                <label>
                    <strong>End Date:</strong>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={formData.endDate ? moment(formData.endDate) : null}
                        onChange={(date) => handleDateChange(date, "endDate")}
                    />
                </label>
                <label>
                    <strong>Total Hours Worked:</strong>
                    <Input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} />
                </label>
                <label>
                    <strong>Status:</strong>
                    <Select value={formData.status} onChange={(value) => handleSelectChange(value, "status")} style={{ width: "100%" }}>
                        <Option value="Draft">Draft</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Approved">Approved</Option>
                        <Option value="Rejected">Rejected</Option>
                    </Select>
                </label>
                <label>
                    <strong>Description:</strong>
                    <TextArea name="description" value={formData.description} onChange={handleChange} />
                </label>
            </div>
        </Modal>
    );
};

export default UpdateRequest;
