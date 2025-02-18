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
            <div className="grid grid-cols-2 text-sm border border-gray-300 rounded-md">
                {/* Employee Name */}
                <div className="bg-gray-200 font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Employee Name:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.name}</div>

                {/* Project */}
                <div className=" font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Project:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.project}</div>

                {/* Total Hours Worked */}
                <div className="bg-gray-200 font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Total Hours Worked:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.totalHours}</div>

                {/* Status */}
                <div className=" font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Status:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${request.status === "Draft"
                        ? "bg-yellow-300 text-yellow-800"
                        : request.status === "Pending Approval"
                            ? "bg-blue-300 text-blue-800"
                            : "bg-green-300 text-green-800"
                        }`}>
                        {request.status}
                    </span>
                </div>

                {/* Created Date */}
                <div className="bg-gray-200 font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Created Date:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.createdDate}</div>

                {/* Start Date */}
                <div className="font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">Start Date:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.startDate}</div>

                {/* End Date */}
                <div className="bg-gray-200 font-semibold text-gray-800 border-b border-gray-300 py-2 px-4">End Date:</div>
                <div className="bg-white border-b border-gray-300 py-2 px-4">{request.endDate}</div>

                {/* Description */}
                <div className=" font-semibold text-gray-800 py-2 px-4">Description:</div>
                <div className="bg-white py-2 px-4">{request.description}</div>
            </div>
        </Modal>
    );
};

export default RequestDetails;
