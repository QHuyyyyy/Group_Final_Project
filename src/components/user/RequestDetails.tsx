import { Modal, Descriptions, Tag } from "antd";

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
            title={<h2 className="text-2xl font-bold">Request Details</h2>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Descriptions bordered column={2} className="mt-4">
                <Descriptions.Item label="Request ID" span={1}>
                    {request.id}
                </Descriptions.Item>
                <Descriptions.Item label="Employee Name" span={1}>
                    {request.name}
                </Descriptions.Item>
                <Descriptions.Item label="Project" span={1}>
                    {request.project}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                    <Tag color={
                        request.status === "Draft" ? "gold" :
                        request.status === "Pending Approval" ? "blue" :
                        request.status === "Approved" ? "green" : "red"
                    }>
                        {request.status}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created Date" span={1}>
                    {request.createdDate}
                </Descriptions.Item>
                <Descriptions.Item label="Total Hours Worked" span={1}>
                    {request.totalHours}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date" span={1}>
                    {request.startDate}
                </Descriptions.Item>
                <Descriptions.Item label="End Date" span={1}>
                    {request.endDate}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                    {request.description}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default RequestDetails;
