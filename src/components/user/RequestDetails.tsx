import { Modal, Descriptions, Tag, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { claimService } from "../../services/claim.service";
import { ClaimById } from "../../models/ClaimModel";

interface RequestDetailsProps {
    visible: boolean;
    claim?: ClaimById;
    projectInfo?: {
        project_name: string;
        project_comment?: string;
    };
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ visible, claim, projectInfo, onClose }) => {
    const [totalHoursMap, setTotalHoursMap] = useState<Record<string, number>>({});

    useEffect(() => {
        if (claim?._id) {
            fetchTotal_Hours(claim._id);
        }
    }, [claim]);

    const fetchTotal_Hours = async (claimId: string) => {
        try {
            const response = await claimService.getClaimById(claimId);
            console.log('Total hours response:', response);
            
            if (response && response.data && response.data.total_work_time) {
                setTotalHoursMap(prev => ({
                    ...prev,
                    [claimId]: response.data.total_work_time
                }));
            }
        } catch (error) {
            console.error('Error fetching total hours:', error);
            message.error('An error occurred while fetching total hours.');
        }
    };

    const formatWorkTime = (hours: number) => {
        if (!hours && hours !== 0) return '-';
        return `${hours}h`;
    };

    if (!claim) return null;

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
                    {claim._id}
                </Descriptions.Item>
                <Descriptions.Item label="Claim Name" span={1}>
                    {claim.claim_name}
                </Descriptions.Item>
                <Descriptions.Item label="Project Name" span={1}>
                    {projectInfo?.project_name || claim.project_id}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                    <Tag color={
                        !claim.claim_status || claim.claim_status === "Draft" ? "gold" :
                        claim.claim_status === "Pending Approval" ? "blue" :
                        claim.claim_status === "Approved" ? "green" : "red"
                    }>
                        {claim.claim_status || "Draft"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created Date" span={1}>
                    {dayjs(claim.created_at).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="Total Hours" span={1}>
                    {formatWorkTime(totalHoursMap[claim._id])}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date" span={1}>
                    {dayjs(claim.claim_start_date).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="End Date" span={1}>
                    {dayjs(claim.claim_end_date).format('YYYY-MM-DD')}
                </Descriptions.Item>
                {projectInfo?.project_comment && (
                    <Descriptions.Item label="Project Comment" span={2}>
                        {projectInfo.project_comment}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Modal>
    );
};

export default RequestDetails;
