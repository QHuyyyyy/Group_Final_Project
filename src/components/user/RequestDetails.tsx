import { Modal, Tag} from "antd";
import dayjs from "dayjs";
import { useMemo, useEffect, useState } from "react";
import { ClaimById } from "../../models/ClaimModel";
import {
  ClockCircleOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import projectService from "../../services/project.service";
import type { ProjectData } from "../../models/ProjectModel";

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

const RequestDetails: React.FC<RequestDetailsProps> = ({
  visible,
  claim,
  onClose,
}) => {
  const [projectDetails, setProjectDetails] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (claim?.project_id) {
        try {
          const response = await projectService.getProjectById(claim.project_id);
          if (response.success && response.data) {
            setProjectDetails(response.data);
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    fetchProjectDetails();
  }, [claim?.project_id]);

  const formatWorkTime = (hours: number | undefined) => {
    if (!hours && hours !== 0) return "-";
    return `${hours}h`;
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status || status === "Draft") return "#faad14";
    if (status === "Pending Approval") return "#1890ff";
    if (status === "Approved") return "#52c41a";
    return "#f5222d";
  };

  const modalTitle = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold m-0">Claim Details</h2>
        {claim && (
          <Tag
            color={getStatusColor(claim.claim_status)}
            className="px-3 py-1 text-sm uppercase font-medium"
          >
            {claim.claim_status || "Draft"}
          </Tag>
        )}
      </div>
    ),
    [claim?.claim_status]
  );

  if (!claim) return null;

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="claims-modal"
    >
      <div className="px-2 -mt-2 mb-4">
        <p className="text-gray-400 text-sm">ID: {claim._id}</p>
      </div>
      <div className="flex flex-col gap-6">
        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <InfoCircleOutlined />
            <span className="font-semibold">Basic Information</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Claim Name</p>
                <p className="font-medium">{claim.claim_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Created Date</p>
                <p className="font-medium">
                  {dayjs(claim.created_at).format("MMMM D, YYYY")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Hours</p>
                <p className="font-medium flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  {formatWorkTime(claim.total_work_time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div>
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <ProjectOutlined />
            <span className="font-semibold">Project Details</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Project Name</p>
                <p className="font-medium">{projectDetails?.project_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Project ID</p>
                <p className="font-medium">{claim.project_id}</p>
              </div>
            </div>
            {projectDetails && (
              <div className="mt-6">
                <p className="text-gray-500 text-sm mb-1">Project Comment</p>
                <p className="font-medium">
                  {projectDetails.project_comment || 'No comment'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Time Period */}
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-4">
            <CalendarOutlined />
            <span className="font-semibold">Time Period</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Start Date</p>
                <p className="font-medium">
                  {dayjs(claim.claim_start_date).format("MMMM D, YYYY")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">End Date</p>
                <p className="font-medium">
                  {dayjs(claim.claim_end_date).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetails;
