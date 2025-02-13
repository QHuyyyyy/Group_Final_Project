import { Modal } from "antd";

interface RequestDetailsProps {
    visible: boolean;
    request: {
        id: number;
        name: string;
        project: string;
        totalHours: number;
        status: string;
        createdDate: string;
        startDate: string;
        endDate: string;
        description: string;
    } | null;
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ visible, request, onClose }) => {
    if (!request) return null;

    return (
        <Modal
            title={`Request Details - ID: ${request.id}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div className="grid grid-cols-1 gap-4">
                <p><strong>Employee Name:</strong> {request.name}</p>
                <p><strong>Project:</strong> {request.project}</p>
                <p><strong>Total Hours Worked:</strong> {request.totalHours}</p>
                <p><strong>Status:</strong>
                    <span className={`px-3 py-1 text-sm rounded-full ${request.status === "Draft"
                        ? "bg-yellow-300 text-yellow-800"
                        : request.status === "Pending Approval"
                            ? "bg-blue-300 text-blue-800"
                            : "bg-green-300 text-green-800"
                        }`}>
                        {request.status}
                    </span>
                </p>
                <p><strong>Created Date:</strong> {request.createdDate}</p>
                <p><strong>Start Date:</strong> {request.startDate}</p>
                <p><strong>End Date:</strong> {request.endDate}</p>
                <p><strong>Description:</strong> {request.description}</p>
            </div>
        </Modal>
    );
};

export default RequestDetails;