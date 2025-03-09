import { useEffect, useState, useCallback } from "react";
import { Table, Tag, Space, Button, Modal, Card, Input, message, Form, Typography, Tabs } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined, EyeOutlined } from "@ant-design/icons";
import { claimService } from "../../services/claimService";
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { debounce } from "lodash";
import dayjs from "dayjs";

const { Search } = Input;

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
    rejected: 0
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

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  useEffect(() => {
    const counts = {
      all: claims.length,
      pendingApproval: claims.filter(claim => claim.claim_status === "Pending Approval").length,
      approved: claims.filter(claim => claim.claim_status === "Approved").length,
      rejected: claims.filter(claim => claim.claim_status === "Rejected").length
    };
    setStatusCounts(counts);
  }, [claims]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
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

      const response = await claimService.searchClaimsForApproval(params);
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
      message.error("An error occurred while fetching claims.");
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

  const filterClaims = (query: string, status: string) => {
    let filtered = claims;
    if (query) {
      filtered = filtered.filter(
        (claim) =>
          claim.claim_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((claim) => claim.claim_status === status);
    }

    return filtered;
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

  const filteredClaims = filterClaims(searchText, statusFilter);

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
    
    try {
      setLoading(true);
      
      await form.validateFields();
      
      const requestBody = {
        _id: selectedClaim._id,
        claim_status: confirmationType,
        comment: comment
      };
      
      const response = await claimService.changeClaimStatus(requestBody);
      
      if (response && response.success === false) {
        message.error(response.message || "Failed to change claim status");
        return;
      }
      
      const actionText = confirmationType === "Draft" ? "returned to draft" : confirmationType.toLowerCase();
      message.success(`Claim has been ${actionText} successfully`);
      fetchClaims();
    } catch (error: any) {
      console.error("Error changing claim status:", error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        message.error(errorData.message || "Failed to change claim status");
      } else if (error.message) {
        message.error(error.message);
      } else if (error.errorFields) {
        message.error("Please provide required information");
      } else {
        message.error("Failed to change claim status");
      }
    } finally {
      setLoading(false);
      setSelectedClaim(null);
      setConfirmationType(null);
      setComment("");
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending Approval":
        return "processing";
      default:
        return "warning";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <div className="mb-6 flex">
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
          <div className="flex flex-wrap gap-4 items-center mb-5 mx-2">
            
            <div className="flex items-center">
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
                          ({statusCounts.all})
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
                          ({statusCounts.pendingApproval})
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
                          ({statusCounts.approved})
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
                          ({statusCounts.rejected})
                        </span>
                      </span>
                    )
                  }
                ]}
              />
            </div>
          </div>

          <Table
            dataSource={filteredClaims}
            loading={loading}
            rowKey="_id"
            columns={[
              {
                title: "Staff name",
                dataIndex: "staff_name",
                key: "staff_name",
                width: "15%",
              },
              {
                title: "Claim name",
                dataIndex: "claim_name",
                key: "claim_name",
                width: "15%",
              },
              {
                title: "Start date",
                key: "time",
                width: "15%",
                render: (_, record) => (
                  <div>
                    <div>
                      {dayjs(record.claim_start_date).format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                    </div>
                  </div>
                ),
              },
              {
                title: "End date",
                key: "time",
                width: "15%",
                render: (_, record) => (
                  <div>
                    <div>
                      {dayjs(record.claim_end_date).format(
                        "DD/MM/YY - HH:mm:ss"
                      )}
                    </div>
                  </div>
                ),
              },
              {
                title: <span className="font-bold">Status</span>,
                key: "status",
                width: "7%",
                render: (_, record) => (
                  <Tag color={getStatusColor(record.claim_status)}>
                    {record.claim_status}
                  </Tag>
                ),
              },
              {
                title: <span className="font-bold">Actions</span>,
                key: "actions",
                width: "15%",
                render: (_, record) => {
                  return (
                    <Space>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => showDetails(record)}
                      />
                      {record.claim_status === "Pending Approval" && (
                        <>
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
                        </>
                      )}
                    </Space>
                  );
                },
              },
            ]}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} claims`,
              onChange: (page, pageSize) =>
                handleTableChange({ current: page, pageSize }),
            }}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
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
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-blue-500" />
            <span className="text-lg font-medium">Claim Details</span>
          </div>
        }
        open={detailsModalVisible}
        onCancel={handleDetailsModalClose}
        footer={[
          <Button 
            key="close" 
            onClick={handleDetailsModalClose}
            size="large"
            className="px-6"
          >
            Close
          </Button>,
        ]}
        width={800}
        className="details-modal"
      >
        {selectedClaim && (
          <div className="p-2">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedClaim.claim_name}</h2>
                <p className="text-gray-500">ID: {selectedClaim._id}</p>
              </div>
              <Tag
                color={getStatusColor(selectedClaim.claim_status)}
                className="px-3 py-1 text-base"
              >
                {selectedClaim.claim_status}
              </Tag>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <Card title="Staff Information" className="shadow-sm">
                <p><strong>Name:</strong> {selectedClaim.staff_name}</p>
                <p><strong>ID:</strong> {selectedClaim.staff_id}</p>
                <p><strong>Email:</strong> {selectedClaim.staff_email}</p>
              </Card>
              
              <Card title="Project Information" className="shadow-sm">
                <p><strong>Project:</strong> {selectedClaim.project_info?.project_name || "N/A"}</p>
                <p><strong>Role:</strong> {selectedClaim.role_in_project || "N/A"}</p>
                <p><strong>Work Time:</strong> {selectedClaim.total_work_time || "N/A"} hours</p>
              </Card>
            </div>
            
            <Card title="Claim Period" className="shadow-sm !mb-3">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-500">Start Date</p>
                  <p className="text-lg font-medium">
                    {dayjs(selectedClaim.claim_start_date).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="text-lg font-medium">
                    {dayjs(selectedClaim.claim_end_date).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card title="Additional Information" className="shadow-sm">
              <p><strong>Created:</strong> {dayjs(selectedClaim.created_at).format("DD/MM/YYYY HH:mm")}</p>
              <p><strong>Last Updated:</strong> {dayjs(selectedClaim.updated_at).format("DD/MM/YYYY HH:mm")}</p>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovalPage;
