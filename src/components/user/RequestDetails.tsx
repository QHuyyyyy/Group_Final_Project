import { Modal, Descriptions, Tag } from "antd";
import dayjs from "dayjs";

interface RequestDetailsProps {
    visible: boolean;
    request: {
        _id: string;
        claim_name: string;
        project_id: string;
        project_name?: string;
        total_work_time: number;
        claim_status: string;
        created_at: string;
        claim_start_date: string;
        claim_end_date: string;
        description?: string;
    } | null;
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ visible, request, onClose }) => {
    if (!request) return null;

    return (
        <Modal
            title={<h2 className="text-2xl font-bold">Claim Details</h2>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Descriptions bordered column={2} className="mt-4">
                <Descriptions.Item label="Claim ID" span={1}>
                    {request._id}
                </Descriptions.Item>
                <Descriptions.Item label="Claim Name" span={1}>
                    {request.claim_name}
                </Descriptions.Item>
                <Descriptions.Item label="Project Name" span={1}>
                    {request.project_name || request.project_id}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                    <Tag color={
                        !request.claim_status || request.claim_status === "DRAFT" ? "gold" :
                        request.claim_status === "PENDING" ? "blue" :
                        request.claim_status === "APPROVED" ? "green" : "red"
                    }>
                        {request.claim_status || "DRAFT"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created Date" span={1}>
                    {dayjs(request.created_at).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="Total Hours" span={1}>
                    {request.total_work_time / 60} hours
                </Descriptions.Item>
                <Descriptions.Item label="Start Date" span={1}>
                    {dayjs(request.claim_start_date).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="End Date" span={1}>
                    {dayjs(request.claim_end_date).format('YYYY-MM-DD')}
                </Descriptions.Item>
                {request.description && (
                    <Descriptions.Item label="Description" span={2}>
                        {request.description}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Modal>
    );
};

export default RequestDetails;
