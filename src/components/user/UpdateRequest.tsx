import { useState } from "react";
import { Modal, Input } from "antd";

const { TextArea } = Input;

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
    const [formData, setFormData] = useState<Request>(request);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                    <Input name="project" value={formData.project} onChange={handleChange} />
                </label>
                <label>
                    <strong>Total Hours Worked:</strong>
                    <Input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} />
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