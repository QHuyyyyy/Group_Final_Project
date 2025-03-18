import { useEffect, useState, useCallback } from "react";
import {Space, Button, Modal, Card, Input, message, Form, Typography, Tabs } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined, FilterOutlined } from "@ant-design/icons";
import { claimService } from "../../services/claim.service";
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { debounce } from "lodash";
import dayjs from "dayjs";
import ClaimDetailsModal from "../../components/shared/ClaimDetailsModal";
import ClaimTable from '../../components/shared/ClaimTable';

const { Search } = Input;

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const debouncedSearch = debounce((
  value: string,
  allClaims: Claim[],
  statusFilter: string,
  setClaims: (claims: Claim[]) => void
) => {
  const filteredData = allClaims.filter(claim => {
    const matchesSearch = claim.claim_name.toLowerCase().includes(value.toLowerCase());
    const matchesStatus = statusFilter ? claim.claim_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  setClaims(filteredData);
}, 1000);

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    "": 0,
    "Draft": 0,
    "Pending Approval": 0,
    "Approved": 0,
    "Rejected": 0
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
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [form] = Form.useForm();
  const [allClaims, setAllClaims] = useState<Claim[]>([]);

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize]);

  const fetchClaims = async () => {
    setLoading(true);
    const params: SearchParams = {
      searchCondition: {
        keyword: searchText || "",
        claim_status: "",
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
      const response = await claimService.searchClaimsForApproval(params, {showSpinner:false});
      if (response?.data?.pageData) {
        const claimsData = response.data.pageData;
        setAllClaims(claimsData);

        const newCounts: Record<string, number> = {
          "": claimsData.length,
          "Draft": claimsData.filter(claim => claim.claim_status === "Draft").length,
          "Pending Approval": claimsData.filter(claim => claim.claim_status === "Pending Approval").length,
          "Approved": claimsData.filter(claim => claim.claim_status === "Approved").length,
          "Rejected": claimsData.filter(claim => claim.claim_status === "Rejected").length
        };
        setStatusCounts(newCounts);

        const filteredData = statusFilter 
          ? claimsData.filter(claim => claim.claim_status === statusFilter)
          : claimsData;
        setClaims(filteredData);

        setPagination((prev) => ({
          ...prev,
          total: response.data.pageInfo.totalItems || 0,
        }));
      }
    } catch (error) {
      message.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    
    debouncedSearch(value, allClaims, statusFilter, setClaims);
  }, [allClaims, statusFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));

    const filteredData = value 
      ? allClaims.filter(claim => claim.claim_status === value)
      : allClaims;
    setClaims(filteredData);
  };

  const showConfirmation = (
    claim: Claim,
    type: "Approved" | "Rejected" | "Draft"
  ) => {
    if (claim.claim_status !== "Pending Approval" && type !== "Approved" && type !== "Rejected") {
      message.warning(`Only claims with Pending Approval status can be processed.`);
      return;
    }

    setSelectedClaim(claim);
    setConfirmationType(type);
    setComment("");
    form.resetFields();
  };

  const showDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setDetailsModalVisible(true);
  };

  const handleConfirmationOk = async () => {
    if (!selectedClaim || !confirmationType) return;

    setLoading(true);
    await form.validateFields();
    const requestBody = {
      _id: selectedClaim._id,
      claim_status: confirmationType,
      comment: comment
    };
    const response = await claimService.changeClaimStatus(requestBody, {showSpinner:false});
    if (response && response.success === false) {
      message.error(response.message || "Failed to change claim status");
      return;
    }
    const actionText = confirmationType === "Draft" ? "returned to draft" : confirmationType.toLowerCase();
    message.success(`Claim has been ${actionText} successfully`);
    fetchClaims();

    setLoading(false);
    setSelectedClaim(null);
    setConfirmationType(null);
    setComment("");
  }

  const handleConfirmationCancel = () => {
    setSelectedClaim(null);
    setConfirmationType(null);
    setComment("");
  };

  const handleDetailsModalClose = () => {
    setDetailsModalVisible(false);
    setSelectedClaim(null);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <div className="mb-4 flex">
          <h1 className="text-2xl font-bold text-gray-800">Claim Approvals</h1>
          <Search
              placeholder="Search by claim name"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="ml-10 !w-72"
              allowClear
            />
        </div>

        <div className="overflow-auto custom-scrollbar">
          <div className="flex flex-wrap gap-18 items-center mb-5 mx-2">
            <div className="flex items-center">
              <FilterOutlined className="mr-4 mb-2 text-gray-600" />
              <Tabs
                activeKey={statusFilter || ""}
                onChange={handleStatusFilterChange}
                className="status-tabs"
                items={[
                  {
                    key: "",
                    label: (
                      <span className="flex items-center text-gray-600">
                        All
                        <span className="ml-1 text-gray-500">
                          ({statusCounts[""] || 0})
                        </span>
                      </span>
                    )
                  },
                  {
                    key: "Pending Approval",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Pending Approval
                        <span className="ml-1 text-gray-500">
                          ({statusCounts["Pending Approval"] || 0})
                        </span>
                      </span>
                    )
                  },
                  {
                    key: "Approved",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Approved
                        <span className="ml-1 text-gray-500">
                          ({statusCounts["Approved"] || 0})
                        </span>
                      </span>
                    )
                  },
                  {
                    key: "Rejected",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Rejected
                        <span className="ml-1 text-gray-500">
                          ({statusCounts["Rejected"] || 0})
                        </span>
                      </span>
                    )
                  },
                  {
                    key: "Draft",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Draft
                        <span className="ml-1 text-gray-500">
                          ({statusCounts["Draft"] || 0})
                        </span>
                      </span>
                    )
                  }
                ]}
              />
            </div>
          </div>

          <ClaimTable
            loading={loading}
            dataSource={claims}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                handleTableChange({ current: page, pageSize }),
            }}
            onView={showDetails}
            actionButtons={(record) => 
              record.claim_status === "Pending Approval" && (
                <Space>
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    onClick={() => showConfirmation(record, "Approved")}
                    title="Approve"
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => showConfirmation(record, "Rejected")}
                    title="Reject"
                  />
                  <Button
                    type="text"
                    icon={<UndoOutlined />}
                    onClick={() => showConfirmation(record, "Draft")}
                    title="Return to Draft"
                  />
                </Space>
              )
            }
          />
        </div>
      </Card>

      {/* Status Change Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {confirmationType === "Approved" && <CheckOutlined className="text-green-500" />}
            {confirmationType === "Rejected" && <CloseOutlined className="text-red-500" />}
            {confirmationType === "Draft" && <UndoOutlined className="text-yellow-500" />}
            <span className="text-lg font-medium">
              {confirmationType === "Draft" ? "Return to Draft" : confirmationType} Confirmation
            </span>
          </div>
        }
        open={!!selectedClaim && !!confirmationType}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: confirmationType === "Approved"
              ? "#52c41a"
              : confirmationType === "Rejected"
                ? "#f5222d"
                : "#faad14"
          }
        }}
        className="confirmation-modal"
      >
        <div className="p-2">
          <Form form={form} layout="vertical">
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
                      {dayjs(selectedClaim.claim_start_date).format("DD/MM/YYYY")} - {dayjs(selectedClaim.claim_end_date).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Typography.Paragraph className="mb-4">
              {confirmationType === "Approved" && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckOutlined />
                  <span>Are you sure you want to <b>approve</b> this claim?</span>
                </div>
              )}
              {confirmationType === "Rejected" && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <CloseOutlined />
                  <span>Are you sure you want to <b>reject</b> this claim?</span>
                </div>
              )}
              {confirmationType === "Draft" && (
                <div className="flex items-center gap-2 text-yellow-600 font-medium">
                  <UndoOutlined />
                  <span>Are you sure you want to <b>return this claim to draft</b>?</span>
                </div>
              )}
            </Typography.Paragraph>

            <Form.Item
              label={<span className="font-medium">Comment</span>}
              name="comment"
              rules={[
                {
                  required: confirmationType === "Rejected" || confirmationType === "Draft",
                  message: 'Please provide a reason'
                }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Add a comment or reason for this action"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border-gray-300 focus:border-blue-500 hover:border-blue-400"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        visible={detailsModalVisible}
        claim={selectedClaim}
        onClose={handleDetailsModalClose}
      />
    </div>
  );
}

export default ApprovalPage;
