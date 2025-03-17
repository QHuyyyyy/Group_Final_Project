import { useEffect, useState, useCallback } from "react";
import { Table, Tag, Space, Button, Modal, Card, Input, message, Form, Typography, Tabs, Avatar, notification } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined, EyeOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import { claimService } from "../../services/claim.service";
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

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
    "Approved" | "Canceled" | "Draft" | null
  >(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  useEffect(() => {
    fetchStatusCounts();
  }, [searchText])

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
            keyword: searchText || "",
            claim_status: "",
            claim_start_date: "",
            claim_end_date: "",
            is_delete: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 1
          }
        }),
        claimService.getPendingApprovalClaims(),
        claimService.getApprovedApprovalClaims(),
        claimService.getRejectedApprovalClaims(),
        claimService.getDraftApprovalClaims(),
        claimService.getPaidApprovalClaims(),
        claimService.getCanceledApprovalClaims()
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
      const response = await claimService.searchClaimsForApproval(Params);
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
      message.error("Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchClaims();
    await fetchStatusCounts();
  };

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
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
    type: "Approved" | "Canceled" | "Draft"
  ) => {
    if (claim.claim_status !== "Pending Approval") {
      message.warning(
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
      const values = await form.validateFields();
      setLoading(true);
      const requestBody = {
        _id: selectedClaim._id,
        claim_status: confirmationType,
        comment: values.comment,
      };
      const response = await claimService.changeClaimStatus(requestBody);
      if (response && response.success === false) {
        message.error(response.message || "Failed to change claim status");
        return;
      }

      const actionText =
        confirmationType === "Draft"
          ? "returned to draft"
          : confirmationType.toLowerCase();
      
      toast.success(`The claim "${selectedClaim.claim_name}" has been successfully ${actionText}.`, {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      refreshData();

      form.resetFields();
      setSelectedClaim(null);
      setConfirmationType(null);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      return;
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Paid":
        return "success";
      case "Rejected":
        return "error";
      case "Canceled":
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
        <div className="mb-4 flex">
          <h1 className="text-2xl font-bold text-gray-800">Claim Approval</h1>
          <Search
            placeholder="Search by claim name"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="ml-10 !w-72"
            allowClear
          />
        </div>

        <div className="overflow-auto custom-scrollbar">
          <div className="flex flex-wrap gap-18 items-center mb-2 mx-2">
            <div className="flex items-center gap-4">
              <FilterOutlined className="mb-2 text-gray-600" />
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
                    ),
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
                    ),
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
                    ),
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
                    ),
                  },
                  {
                    key: "Draft",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Draft
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.draft})
                        </span>
                      </span>
                    ),
                  },
                  {
                    key: "Paid",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Paid
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.paid})
                        </span>
                      </span>
                    ),
                  },
                  {
                    key: "Canceled",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Canceled
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.canceled})
                        </span>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          <Table
            dataSource={claims}
            loading={loading}
            rowKey="_id"
            columns={[
              {
                title: "No",
                key: "index",
                width: "1%",
                render: (_: any, __: any, index: number) => {
                  return (pagination.current - 1) * pagination.pageSize + index + 1;
                },
              },
              {
                title: "Staff",
                key: "staff",
                width: "20%",
                render: (_, record) => (
                  <div className="flex items-center gap-4">
                    <Avatar
                      size="large"
                      icon={<UserOutlined />}
                      src={record.employee_info?.avatar_url}
                      className="bg-blue-500"
                    />
                    <div className="mb-1">
                      <div className="font-medium">{record.staff_name}</div>
                      <div className="text-xs text-gray-500">
                        {record.staff_email}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Claim name",
                dataIndex: "claim_name",
                key: "claim_name",
                width: "15%",
              },
              {
                title: 'Period',
                key: 'period',
                dataIndex: 'period',
                render: (_, record) => (
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <span>{dayjs(record.claim_start_date).format('DD/MM')} - {dayjs(record.claim_end_date).format('DD/MM/YYYY')}</span>
                  </div>
                ),
                sorter: (a, b) => {
                  const dateA = new Date(a.claim_start_date).getTime();
                  const dateB = new Date(b.claim_start_date).getTime();
                  return dateA - dateB;
                },
                defaultSortOrder: "descend",
                width: 180,
              },
              {
                title: "Work Time",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: "10%",
                render: (_, record) => (
                  <div className="flex items-center gap-1 mb-1">
                    <span>{record.total_work_time}h</span>
                  </div>
                ),
              },
              {
                title: "Status",
                key: "status",
                width: "10%",
                render: (_, record) => (
                  <Tag color={getStatusColor(record.claim_status)}>
                    {record.claim_status}
                  </Tag>
                ),
              },
              {
                title: "Created Date",
                dataIndex: "created_at",
                key: "created_at",
                width: "10%",
                render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
                sorter: (a, b) => {
                  const dateA = new Date(a.created_at).getTime();
                  const dateB = new Date(b.created_at).getTime();
                  return dateB - dateA;
                },
                defaultSortOrder: "descend",
              },
              {
                title: "Actions",
                key: "actions",
                width: "15%",
                render: (_, record) => {
                  return (
                    <Space>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => showDetails(record)}
                        title="View Details"
                      />
                      {record.claim_status === "Pending Approval" && (
                        <>
                          <Button
                            type="text"
                            icon={<CheckOutlined />}
                            className="!text-green-500"
                            onClick={() => showConfirmation(record, "Approved")}
                            title="Approve"
                          />
                          <Button
                            type="text"
                            icon={<UndoOutlined />}
                            className="!text-yellow-500"
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
            {confirmationType === "Approved" && (
              <CheckOutlined className="text-green-500" />
            )}
            {confirmationType === "Canceled" && (
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
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor:
              confirmationType === "Approved"
                ? "#52c41a"
                : confirmationType === "Canceled"
                  ? "#f5222d"
                  : "#faad14",
          },
        }}
        className="confirmation-modal"
      >
        <div className="p-2">
          <Form 
            form={form} 
            layout="vertical"
            initialValues={{ comment: "" }} // Add initial values
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
                      {dayjs(selectedClaim.claim_start_date).format(
                        "DD/MM/YYYY"
                      )}{" "}
                      -{" "}
                      {dayjs(selectedClaim.claim_end_date).format("DD/MM/YYYY")}
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
              {confirmationType === "Canceled" && (
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
                <h2 className="text-xl font-bold">
                  {selectedClaim.claim_name}
                </h2>
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
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    src={selectedClaim.employee_info?.avatar_url}
                    className="bg-blue-500"
                  />
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedClaim.staff_name}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedClaim.staff_id}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedClaim.staff_email}
                    </p>
                  </div>
                </div>
              </Card>

              <Card title="Project Information" className="shadow-sm">
                <p>
                  <strong>Project:</strong>{" "}
                  {selectedClaim.project_info?.project_name || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {selectedClaim.role_in_project || "N/A"}
                </p>
                <p>
                  <strong>Work Time:</strong>{" "}
                  {selectedClaim.total_work_time || "N/A"} hours
                </p>
              </Card>
            </div>

            <Card
              title="Claim Period"
              className="p-5 rounded-lg mb-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                    {dayjs(selectedClaim.claim_start_date).format(
                      "DD MMM YYYY"
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {dayjs(selectedClaim.claim_start_date).format("HH:mm")}
                  </p>
                </div>
                <div className="flex-2 mx-4 relative mb-8">
                  <div className="h-0.5 bg-blue-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 font-medium border border-blue-200 rounded-full">
                    {`${selectedClaim.total_work_time}h`}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                    {dayjs(selectedClaim.claim_end_date).format("DD MMM YYYY")}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {dayjs(selectedClaim.claim_end_date).format("HH:mm")}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Additional Information" className="shadow-sm !mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created Date</p>
                  <p className="font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {dayjs(selectedClaim.created_at).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {dayjs(selectedClaim.updated_at).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovalPage;