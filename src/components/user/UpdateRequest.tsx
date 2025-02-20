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
    const [formData, setFormData] = useState<Request>(() => ({
        ...request,
        startDate: moment(request.startDate).format("YYYY-MM-DD"),
        endDate: moment(request.endDate).format("YYYY-MM-DD"),
    }));

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
                {/* Employee Name - Không thể thay đổi */}
                <label>
                    <strong>Employee Name:</strong>
                    <Input name="name" value={formData.name} disabled />
                </label>

                {/* Project */}
                <label>
                    <strong>Project:</strong>
                    <Select
                        value={formData.project}
                        onChange={(value) => handleSelectChange(value, "project")}
                        style={{ width: "100%" }}
                    >
                        <Option value="Project A">Project A</Option>
                        <Option value="Project B">Project B</Option>
                        <Option value="Project C">Project C</Option>
                    </Select>
                </label>

                {/* Start Date */}
                <label>
                    <strong>Start Date:</strong>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={formData.startDate ? moment(formData.startDate) : null}
                        onChange={(date) => handleDateChange(date, "startDate")}
                    />
                </label>

                {/* End Date */}
                <label>
                    <strong>End Date:</strong>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={formData.endDate ? moment(formData.endDate) : null}
                        onChange={(date) => handleDateChange(date, "endDate")}
                    />
                </label>

                {/* Total Hours Worked */}
                <label>
                    <strong>Total Hours Worked:</strong>
                    <Input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} />
                </label>

                {/* Status - Không thể thay đổi */}
                <label>
                    <strong>Status:</strong>
                    <Input value={formData.status} disabled />
                </label>

                {/* Description */}
                <label>
                    <strong>Description:</strong>
                    <TextArea name="description" value={formData.description} onChange={handleChange} />
                </label>
            </div>
        </Modal>
    );
};

export default UpdateRequest;
