import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, notification, Tabs } from "antd";
import { claimService } from "../../services/claim.service";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import UpdateRequest from "../../components/user/UpdateRequest";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
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
    totalItems: 0,
    totalPages: 0
  });
  const [selectedRequest, setSelectedRequest] = useState<ClaimById | undefined>(
    undefined
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [selectedCancelClaimId, setSelectedCancelClaimId] = useState<string | null>(null); // Add cancel claim ID
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [debouncedSearchText] = useDebounce(searchText, 2000);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);  // Add cancel modal visibility state
  const [allClaimsData, setAllClaimsData] = useState<Record<string, Claim[]>>({});

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
    fetchClaims(pagination.current);
  }, [pagination.current, pagination.pageSize, debouncedSearchText]);

  const fetchClaims = async (pageNum: number) => {
    try {
      setLoading(true);
      const countPromises = claimStatuses.map(async (status) => {
        if (status.value !== '') {
          const countParams: SearchParams = {
            searchCondition: {
              keyword: debouncedSearchText || "",
              claim_status: status.value,
              claim_start_date: "",
              claim_end_date: "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 1,
            },
          };
          const countResponse = await claimService.searchClaimsByClaimer(countParams);
          return { status: status.value, count: countResponse.data.pageInfo.totalItems };
        }
        return null;
      });

      const counts = await Promise.all(countPromises);
      const newStatusCounts = counts.reduce((acc, curr) => {
        if (curr) {
          acc[curr.status] = curr.count;
        }
        return acc;
      }, {} as Record<string, number>);
      setStatusCounts(newStatusCounts);
      const params: SearchParams = {
        searchCondition: {
          keyword: debouncedSearchText || "",
          claim_status: selectedStatus || "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: pageNum,
          pageSize: pagination.pageSize,
        },
      };

      const response = await claimService.searchClaimsByClaimer(params, {showSpinner:false});

      if (response?.data?.pageData) {
        setFilteredClaims(response.data.pageData);
        setPagination((prev) => ({
          ...prev,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages,
          current: pageNum
        }));
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      message.error("An error occurred while fetching claims.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: Claim) => {
    try {
      const response = await claimService.getClaimById(record._id, {showSpinner:false})
      if (response?.data) {
        setSelectedRequest(response.data);
        setIsModalVisible(true);
      }
    } catch {
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
    fetchClaims(pagination.current);
    message.success("Claim created successfully");
  };

  const handleCancelRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Canceled",
        comment: comment
      },{showSpinner:false});
      notification.success({
        message: 'Success',
        description: 'Request has been canceled successfully.',
        placement: 'topRight'
      });
      fetchClaims(pagination.current);
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.error({
          message: 'Error',
          description: error.message || 'Failed to cancel the request.',
          placement: 'topRight'
        });
      }
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
    setSelectedStatus(status || '');
    setPagination(prev => ({ ...prev, current: 1 }));
    
    const cacheKey = `${status}_${debouncedSearchText}`;
    if (allClaimsData[cacheKey]) {
      setFilteredClaims(allClaimsData[cacheKey]);
      return;
    }

    const params: SearchParams = {
      searchCondition: {
        keyword: debouncedSearchText || "",
        claim_status: status || "",
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: pagination.pageSize,
      },
    };

    setLoading(true);
    claimService.searchClaimsByClaimer(params)
      .then(response => {
        if (response?.data?.pageData) {
          setAllClaimsData(prev => ({
            ...prev,
            [cacheKey]: response.data.pageData
          }));
          setFilteredClaims(response.data.pageData);
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.pageInfo.totalItems,
            totalPages: response.data.pageInfo.totalPages,
            current: 1
          }));
        }
      })
      .catch(error => {
        console.error("Error fetching claims:", error);
        message.error("An error occurred while fetching claims.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setAllClaimsData({});
  }, [debouncedSearchText]);

  const handleSendRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Pending Approval",
        comment: comment
      }, {showSpinner:false});
      notification.success({
        message: 'Success',
        description: 'Request has been sent for approval successfully.',
        placement: 'topRight'
      });
      fetchClaims(pagination.current);
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.error({
          message: 'Error',
          description: error.message || 'Failed to send request for approval.',
          placement: 'topRight'
        });
      }
    }
  };

  const handleOpenUpdateModal = async (record: Claim) => {
    try {
      const response = await claimService.getClaimById(record._id);
      if (response?.data) {
        setSelectedRequest(response.data);
        setIsUpdateModalVisible(true);
      }
    } catch {
      message.error("Failed to fetch claim details for update");
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedRequest(undefined);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false);
    fetchClaims(pagination.current);
    message.success("Claim updated successfully");
  };

  const renderStatusButtons = () => (
    <div className="overflow-auto custom-scrollbar">
      <div className="flex flex-wrap gap-18 items-center mb-5 mx-2">
        <div className="flex items-center">
          <FilterOutlined className="mr-4 mb-2 text-gray-600" />
          <Tabs
            activeKey={selectedStatus}
            onChange={handleStatusFilter}
            className="status-tabs"
            items={[
              {
                key: "",
                label: (
                  <span className="flex items-center text-gray-600">
                    All
                    <span className="ml-1 text-gray-500">
                      ({pagination.totalItems})
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
                key: "Canceled",
                label: (
                  <span className="flex items-center text-gray-600">
                    Canceled
                    <span className="ml-1 text-gray-500">
                      ({statusCounts["Canceled"] || 0})
                    </span>
                  </span>
                )
              },
              {
                key: "Paid",
                label: (
                  <span className="flex items-center text-gray-600">
                    Paid
                    <span className="ml-1 text-gray-500">
                      ({statusCounts["Paid"] || 0})
                    </span>
                  </span>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Claims</h1>
            <Search
              placeholder="Search by claim name"
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              className="ml-10 !w-72"
              allowClear
            />
          </div>
          <Button 
            type="primary" 
            onClick={handleOpenCreateModal}
          >
            Add New Claim
          </Button>
        </div>

        {renderStatusButtons()}

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
              title: "Claim Name",
              dataIndex: "claim_name",
              key: "claim_name",
              width: 120,
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
              render: (_, record) => (
                <div className="flex items-center gap-2">
                  <div className="w-8">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(record)}
                      title="View"
                    />
                  </div>
                  {record.claim_status === "Draft" && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        title="Edit"
                      />
                      <Button
                        type="text"
                        icon={<CloudUploadOutlined style={{ color: '#1890ff' }} />}
                        onClick={() => handleOpenSendModal(record)}
                        title="Send for Approval"
                      />
                      <Button
                        type="text"
                        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                        onClick={() => handleOpenCancelModal(record)}
                        title="Cancel"
                      />
                    </div>
                  )}
                </div>
              )
            },
          ]}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
              fetchClaims(page);
            },
          }}
        />
      </Card>

      <RequestDetails
        visible={isModalVisible}
        claim={selectedRequest}
        projectInfo={{
          _id: "",
          project_name: "",
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
        onClose={handleCloseCancelModal}
      />
      {selectedRequest && (
        <UpdateRequest
          visible={isUpdateModalVisible}
          claim={selectedRequest}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Claim;
