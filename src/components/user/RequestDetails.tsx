import { Modal, Tag } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClaimById } from "../../models/ClaimModel";

interface RequestDetailsProps {
    visible: boolean;
    claim?: ClaimById;
    projectInfo?: {
        _id: string;
        project_name: string;
        project_comment?: string;
    };
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ visible, claim, projectInfo, onClose }) => {
    const formatWorkTime = (hours: number | undefined) => {
        if (!hours && hours !== 0) return '-';
        return `${hours}h`;
    };

    const modalTitle = useMemo(() => (
        <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Claim Details</h2>
            {claim && (
                <Tag color={
                    !claim.claim_status || claim.claim_status === "Draft" ? "gold" :
                    claim.claim_status === "Pending Approval" ? "blue" :
                    claim.claim_status === "Approved" ? "green" : "red"
                }>
                    {claim.claim_status || "Draft"}
                </Tag>
            )}
        </div>
    ), [claim?.claim_status]);

    if (!claim) return null;

    return (
        <Modal
            title={modalTitle}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="custom-modal"
        >
            <div className="py-3">
                {/* Basic Information */}
                <div className="mb-6">
                    <h3 className="text-base font-medium mb-3 flex items-center">
                        <div className="w-1 h-4 bg-blue-500 rounded mr-2"></div>
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Claim ID</p>
                            <p className="font-medium">{claim._id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Claim Name</p>
                            <p className="font-medium">{claim.claim_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Created Date</p>
                            <p className="font-medium">{dayjs(claim.created_at).format('YYYY-MM-DD')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Hours</p>
                            <p className="font-medium">{formatWorkTime(claim.total_work_time)}</p>
                        </div>
                    </div>
                </div>

                {/* Project Details */}
                <div className="mb-6">
                    <h3 className="text-base font-medium mb-3 flex items-center">
                        <div className="w-1 h-4 bg-green-500 rounded mr-2"></div>
                        Project Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Project ID</p>
                            <p className="font-medium">{projectInfo?._id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Project Name</p>
                            <p className="font-medium">{projectInfo?.project_name || claim.project_id}</p>
                        </div>
                        {projectInfo?.project_comment && (
                            <div className="col-span-2">
                                <p className="text-gray-500">Project Comment</p>
                                <p className="font-medium">{projectInfo.project_comment}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Time Period */}
                <div>
                    <h3 className="text-base font-medium mb-3 flex items-center">
                        <div className="w-1 h-4 bg-purple-500 rounded mr-2"></div>
                        Time Period
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">{dayjs(claim.claim_start_date).format('YYYY-MM-DD')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="font-medium">{dayjs(claim.claim_end_date).format('YYYY-MM-DD')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RequestDetails;

