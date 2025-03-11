import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, Space, notification } from "antd";
import { claimService } from "../../services/claim.service";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { Claim, ClaimById, SearchParams } from "../../models/ClaimModel";
import CreateRequest from "./CreateRequest";
import SendRequest from "../../components/user/SendRequest";
import CancelRequest from "../../components/user/CancelRequest";  // Import lại CancelRequest
import { useDebounce } from "../../hooks/useDebounce";

const { Search } = Input;

const Claim = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<ClaimById | undefined>(
    undefined
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [selectedCancelClaimId, setSelectedCancelClaimId] = useState<string | null>(null); // Add cancel claim ID
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);  // Add cancel modal visibility state

  const claimStatuses = [
    { label: 'All', value: '', color: '#1890ff', bgColor: '#e6f7ff' },
    { label: 'Draft', value: 'Draft', color: '#faad14', bgColor: '#fff7e6' },
    { label: 'Pending', value: 'Pending Approval', color: '#1890ff', bgColor: '#e6f7ff' },
    { label: 'Approved', value: 'Approved', color: '#52c41a', bgColor: '#f6ffed' },
    { label: 'Rejected', value: 'Rejected', color: '#ff4d4f', bgColor: '#fff1f0' },
    { label: 'Canceled', value: 'Canceled', color: '#ff4d4f', bgColor: '#fff1f0' },
    { label: 'Paid', value: 'Paid', color: '#52c41a', bgColor: '#f6ffed' },
  ];

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, debouncedSearchText]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        searchCondition: {
          keyword: debouncedSearchText || "",
          claim_status: selectedStatus === "Rejected" || selectedStatus === "Canceled" ? selectedStatus : "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      };

      const response = await claimService.searchClaimsByClaimer(params);

      if (response?.data?.pageData) {
        const claimsData = response.data.pageData;
        setAllClaims(claimsData);

        const filtered = selectedStatus
          ? claimsData.filter(claim => claim.claim_status === selectedStatus)
          : claimsData;
        setFilteredClaims(filtered);

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

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: Claim) => {
    try {
      const response = await claimService.getClaimById(record._id);
      if (response?.data) {
        setSelectedRequest(response.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error("Failed to fetch claim details");
    }
  };
  const handleCloseSendModal = () => {
    setIsSendModalVisible(false);
    setSelectedClaimId(null);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(undefined);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
  };
  const handleOpenSendModal = (record: Claim) => {
    setSelectedClaimId(record._id);
    setIsSendModalVisible(true);
  };
  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    fetchClaims();
    message.success("Claim created successfully");
  };

  const handleCancelRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Canceled",
        comment: comment
      });
      notification.success({
        message: 'Success',
        description: 'Request has been canceled successfully.',
        placement: 'topRight'
      });
      fetchClaims();
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to cancel the request.',
        placement: 'topRight'
      });
    }
  };

  const handleOpenCancelModal = (record: Claim) => {
    setSelectedCancelClaimId(record._id);
    setIsCancelModalVisible(true);  // Open cancel modal
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalVisible(false);
    setSelectedCancelClaimId(null);  // Reset cancel claim ID
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    const filtered = status
      ? allClaims.filter(claim => claim.claim_status === status)
      : allClaims;
    setFilteredClaims(filtered);
    setPagination(prev => ({ ...prev, current: 1 }));
  };
  const handleSendRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Pending Approval",
        comment: comment
      });
      notification.success({
        message: 'Success',
        description: 'Request has been sent for approval successfully.',
        placement: 'topRight'
      });
      fetchClaims();
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to send request for approval.',
        placement: 'topRight'
      });
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <Search
            placeholder="Search by Employee Name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            className="ml-0"
          />
          <Button type="primary" onClick={handleOpenCreateModal}>
            Add New Claim
          </Button>
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">My Claims</h1>
              <div className="flex gap-2">
                {claimStatuses.map(status => (
                  <Button
                    key={status.value}
                    onClick={() => handleStatusFilter(status.value)}
                    style={{
                      borderColor: status.color,
                      backgroundColor: selectedStatus === status.value ? status.color : status.bgColor,
                      color: selectedStatus === status.value ? '#fff' : status.color,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      height: '32px',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.3s'
                    }}
                    className="hover:opacity-80"
                  >
                    {status.label}
                    {allClaims.filter(claim =>
                      status.value === '' ? true : claim.claim_status === status.value
                    ).length > 0 && (
                        <span
                          style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            fontSize: '12px',
                            borderRadius: '10px',
                            backgroundColor: selectedStatus === status.value
                              ? '#ffffff'
                              : '#ffffff',
                            color: status.color,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: `1px solid ${status.color}`
                          }}
                        >
                          {allClaims.filter(claim =>
                            status.value === '' ? true : claim.claim_status === status.value
                          ).length}
                        </span>
                      )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Table
            loading={loading}
            dataSource={filteredClaims}
            columns={[
              {
                title: "No.",
                key: "index",
                render: (_, __, index) => index + 1,
                width: 60,
                align: "center",
              },
              {
                title: "Staff Name",
                dataIndex: ["staff_name", "staff_email"],
                key: "staff_name",
                width: 120,
                render: (_, record) => record.staff_name,
              },
              {
                title: "Project Name",
                dataIndex: ["project_info", "project_name"],
                key: "project_name",
                width: 180,
                render: (_, record) => record.project_info?.project_name || "-",
              },
              {
                title: "Project Duration",
                dataIndex: "duration",
                key: "duration",
                width: 200,
                align: "center",
                sorter: (a, b) => {
                  const dateA = new Date(a.claim_start_date).getTime();
                  const dateB = new Date(b.claim_start_date).getTime();
                  return dateA - dateB;
                },
                render: (_, record) => (
                  <span>
                    {dayjs(record.claim_start_date).format("YYYY-MM-DD")}
                    {" - "}
                    {dayjs(record.claim_end_date).format("YYYY-MM-DD")}
                  </span>
                ),
              },
              {
                title: "Total Hours",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: 100,
                align: "center",
                render: (total_work_time: number) => `${total_work_time}h`,
              },
              {
                title: "Status",
                dataIndex: "claim_status",
                key: "claim_status",
                width: 120,
                align: "center",
                render: (status: string) => (
                  <Tag
                    color={
                      !status || status === "Draft"
                        ? "gold"
                        : status === "Pending Approval"
                          ? "blue"
                          : status === "Approved"
                            ? "green"
                            : status === "Rejected" || status === "Canceled"
                              ? "red"
                              : status === "Paid"
                                ? "green"
                                : ""
                    }
                  >
                    {status || "Draft"}
                  </Tag>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                width: 100,
                align: 'center',
                render: (_, record) => (
                  <Space size="middle">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(record)}
                      title="View"
                    />

                    {record.claim_status === "Draft" && (
                      <>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => (record)}
                        />
                        <Button
                          type="text"
                          icon={<CloudUploadOutlined />}
                          onClick={() => handleOpenSendModal(record)}
                          title="Send for Approval"
                        />
                        <Button
                          type="text"
                          icon={<CloseCircleOutlined />}
                          onClick={() => handleOpenCancelModal(record)} // Open cancel modal
                          title="Cancel"
                        />
                      </>
                    )}
                  </Space>
                )
              },
            ]}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10,
                }));
              },
            }}
          />
        </Card>

        <RequestDetails
          visible={isModalVisible}
          claim={selectedRequest}
          projectInfo={{
            _id: "",
            project_name:"",
            project_comment: "",
          }}
          onClose={handleCloseModal}
        />
        <CreateRequest
          visible={isCreateModalVisible}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
        />
        <SendRequest
          visible={isSendModalVisible}
          id={selectedClaimId}
          onSend={handleSendRequest}
          onCancel={handleCloseSendModal}
        />
        <CancelRequest
          visible={isCancelModalVisible}
          id={selectedCancelClaimId}
          onCancelRequest={handleCancelRequest}
          onClose={handleCloseCancelModal} // Close the cancel modal
        />
      </div>
    </div>
  );
};

export default Claim;
