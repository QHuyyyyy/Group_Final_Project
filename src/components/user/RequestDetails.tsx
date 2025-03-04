import { Modal, Descriptions, Tag, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { claimService } from "../../services/claimService";
import { ClaimById } from "../../models/ClaimModel";

interface RequestDetailsProps {
    visible: boolean;
    claim?: ClaimById;
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ visible, claim, onClose }) => {
    const [totalHoursMap, setTotalHoursMap] = useState<Record<string, number>>({});
    const [, setProjectName] = useState<string>("");


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

    useEffect(() => {
        if (claim?._id) {
            fetchProjectName(claim._id);
        }
    }, [claim]);

    const fetchProjectName = async (claimId: string) => {
        try {
            const response = await claimService.searchClaims({
                searchCondition: {
                    keyword: claimId,
                    claim_status: "",
                    claim_start_date: "",
                    claim_end_date: "",
                    is_delete: false
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1
                },
            });
            if (response && response.data && response.data.pageData) {
                setProjectName(response.data.pageData[0].project_info.project_name);
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
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
                    {claim.project_id}
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
                
            </Descriptions>
        </Modal>
    );
};

export default RequestDetails;
