import { useEffect, useState, useCallback } from "react";
import { Card, Button, Modal, Form, Typography, Input } from "antd";
import { 
  CheckOutlined, 
  CloseOutlined, 
  UndoOutlined, 
} from "@ant-design/icons";
import { claimService } from "../../services/claim.service";
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { debounce } from "lodash";
import ClaimTable from "../../components/shared/ClaimTable";
import PageHeader from "../../components/shared/PageHeader";
import StatusTabs from "../../components/shared/StatusTabs";
import ClaimDetailsModal from "../../components/shared/ClaimDetailsModal";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    paid: 0,
    canceled: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [confirmationType, setConfirmationType] = useState<
    "Approved" | "Rejected" | "Draft" | null
  >(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    fetchStatusCounts();
    fetchClaims();
  }, [statusFilter, searchText, pagination.current, pagination.pageSize]);

  const fetchStatusCounts = async () => {
    try {
      const [
        allResponse,
        pendingResponse,
        approvedResponse,
        rejectedResponse,
        draftResponse,
        paidResponse,
        canceledResponse
      ] = await Promise.all([
        claimService.searchClaimsForApproval({
          searchCondition: {
            keyword: "",
            claim_status: "",
            claim_start_date: "",
            claim_end_date: "",
            is_delete: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 1
          }
        }, {showSpinner: false}),
        claimService.getPendingApprovalClaims({showSpinner: false}),
        claimService.getApprovedApprovalClaims({showSpinner: false}),
        claimService.getRejectedApprovalClaims({showSpinner: false}),
        claimService.getDraftApprovalClaims({showSpinner: false}),
        claimService.getPaidApprovalClaims({showSpinner: false}),
        claimService.getCanceledApprovalClaims({showSpinner: false})
      ]);

      setStatusCounts({
        all: allResponse.data.pageInfo.totalItems || 0,
        pendingApproval: pendingResponse.data.pageInfo.totalItems || 0,
        approved: approvedResponse.data.pageInfo.totalItems || 0,
        rejected: rejectedResponse.data.pageInfo.totalItems || 0,
        draft: draftResponse.data.pageInfo.totalItems || 0,
        paid: paidResponse.data.pageInfo.totalItems || 0,
        canceled: canceledResponse.data.pageInfo.totalItems || 0
      });
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    const Params: SearchParams = {
      searchCondition: {
        keyword: searchText || "",
        claim_status: statusFilter || "",
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      },
      pageInfo: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    };
    try {
      const response = await claimService.searchClaimsForApproval(Params, {showSpinner: false});
      if (response && response.data && response.data.pageData) {
        const claimsData = response.data.pageData;
        setClaims(claimsData);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pageInfo.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchClaims();
    await fetchStatusCounts();
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchText(query);
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
    }, 500),
    []
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const showConfirmation = (
    claim: Claim,
    type: "Approved" | "Rejected" | "Draft"
  ) => {
    if (claim.claim_status !== "Pending Approval") {
      toast.warning(
        `Only claims with Pending Approval status can be processed.`
      );
      return;
    }

    setSelectedClaim(claim);
    setConfirmationType(type);
    form.resetFields();
  };

  const showDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setDetailsModalVisible(true);
  };

  const handleConfirmationOk = async () => {
    if (!selectedClaim || !confirmationType) return;

    try {
      setActionLoading(true);
      const values = await form.validateFields();
      
      const requestBody = {
        _id: selectedClaim._id,
        claim_status: confirmationType,
        comment: values.comment,
      };
      
      const response = await claimService.changeClaimStatus(requestBody, {showSpinner: false});
      
      if (response && response.success === false) {
        toast.error(response.message || "Failed to change claim status");
        return;
      }

      const actionText =
        confirmationType === "Draft"
          ? "returned to draft"
          : confirmationType.toLowerCase();
      
      toast.success(`The claim "${selectedClaim.claim_name}" has been successfully ${actionText}.`);
      
      refreshData();

      form.resetFields();
      setSelectedClaim(null);
      setConfirmationType(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmationCancel = () => {
    setSelectedClaim(null);
    setConfirmationType(null);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalVisible(false);
    setSelectedClaim(null);
  };

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <PageHeader
          title="Approval Management"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <StatusTabs
          activeKey={statusFilter}
          onChange={handleStatusFilterChange}
          items={[
            { key: "", label: "All", count: statusCounts.all || 0 },
            { key: "Pending Approval", label: "Pending Approval", count: statusCounts.pendingApproval || 0 },
            { key: "Approved", label: "Approved", count: statusCounts.approved || 0 },
            { key: "Rejected", label: "Rejected", count: statusCounts.rejected || 0 },
            { key: "Draft", label: "Draft", count: statusCounts.draft || 0 },
            { key: "Paid", label: "Paid", count: statusCounts.paid || 0 },
            { key: "Canceled", label: "Canceled", count: statusCounts.canceled || 0 },
          ]}
        />

        <ClaimTable
          loading={loading}
          dataSource={claims}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
          onView={showDetails}
          actionButtons={(record) => 
            record.claim_status === "Pending Approval" && (
              <div className="flex items-center gap-2">
                <Button
                  type="text"
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => showConfirmation(record, "Approved")}
                  title="Approve"
                  disabled={actionLoading}
                />
                <Button
                  type="text"
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => showConfirmation(record, "Rejected")}
                  title="Reject"
                  disabled={actionLoading}
                />
                <Button
                  type="text"
                  icon={<UndoOutlined style={{ color: '#faad14' }} />}
                  onClick={() => showConfirmation(record, "Draft")}
                  title="Return to Draft"
                  disabled={actionLoading}
                />
              </div>
            )
          }
        />
      </Card>

      <ClaimDetailsModal
        visible={isDetailsModalVisible}
        claim={selectedClaim}
        onClose={handleDetailsModalClose}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            {confirmationType === "Approved" && (
              <CheckOutlined className="text-green-500" />
            )}
            {confirmationType === "Rejected" && (
              <CloseOutlined className="text-red-500" />
            )}
            {confirmationType === "Draft" && (
              <UndoOutlined className="text-yellow-500" />
            )}
            <span className="text-lg font-medium">
              {confirmationType === "Draft"
                ? "Return to Draft"
                : confirmationType}{" "}
              Confirmation
            </span>
          </div>
        }
        open={!!selectedClaim && !!confirmationType}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        okText={confirmationType === "Draft" ? "Return to Draft" : confirmationType}
        cancelText="Cancel"
        confirmLoading={actionLoading}
        okButtonProps={{
          style: {
            backgroundColor:
              confirmationType === "Approved"
                ? "#52c41a"
                : confirmationType === "Rejected"
                  ? "#f5222d"
                  : "#faad14",
          },
          disabled: actionLoading
        }}
        cancelButtonProps={{
          disabled: actionLoading
        }}
        maskClosable={!actionLoading}
        closable={!actionLoading}
        className="confirmation-modal"
      >
        <div className="p-2">
          <Form 
            form={form} 
            layout="vertical"
            initialValues={{ comment: "" }}
          >
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              {selectedClaim && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Claim:</span>
                    <span>{selectedClaim.claim_name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Staff:</span>
                    <span>{selectedClaim.staff_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Period:</span>
                    <span>
                      {dayjs(selectedClaim.claim_start_date).format("DD/MM/YYYY")}{" "}
                      - {dayjs(selectedClaim.claim_end_date).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Typography.Paragraph className="mb-4">
              {confirmationType === "Approved" && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckOutlined />
                  <span>
                    Are you sure you want to <b>approve</b> this claim?
                  </span>
                </div>
              )}
              {confirmationType === "Rejected" && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <CloseOutlined />
                  <span>
                    Are you sure you want to <b>reject</b> this claim?
                  </span>
                </div>
              )}
              {confirmationType === "Draft" && (
                <div className="flex items-center gap-2 text-yellow-600 font-medium">
                  <UndoOutlined />
                  <span>
                    Are you sure you want to <b>return this claim</b>?
                  </span>
                </div>
              )}
            </Typography.Paragraph>

            <Form.Item
              name="comment"
              label="Comment"
              rules={[
                { required: true, message: 'Please enter a comment' },
                { min: 3, message: 'Comment must be at least 3 characters' }
              ]}
            >
              <Input.TextArea 
                rows={4}
                placeholder={`Please provide a reason for ${
                  confirmationType === "Approved" 
                    ? "approving" 
                    : confirmationType === "Rejected"
                      ? "rejecting"
                      : "returning"
                } this claim...`}
                disabled={actionLoading}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default ApprovalPage;