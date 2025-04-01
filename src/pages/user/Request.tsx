import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "antd";
import { claimService } from "../../services/claim.service";
import UpdateRequest from "../../components/user/UpdateRequest";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { Claim, ClaimById, SearchParams } from "../../models/ClaimModel";
import CreateRequest from "../../components/user/CreateRequest";
import SendRequest from "../../components/user/SendRequest";
import CancelRequest from "../../components/user/CancelRequest";
import { debounce } from "lodash";
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import StatusTabs from '../../components/shared/StatusTabs';
import ClaimTable from '../../components/shared/ClaimTable';
import PageHeader from '../../components/shared/PageHeader';
import ClaimHistoryModal from '../../components/shared/ClaimHistoryModal';
import { toast } from "react-toastify";


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
  const [, setAllClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    draft: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    canceled: 0,
    paid: 0
  });
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

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

  useEffect(() => {
    fetchClaims(pagination.current);
  }, [pagination.current, pagination.pageSize, searchText, selectedStatus]);

  const fetchClaims = async (pageNum: number) => {
    try {
      setLoading(true);

      const allClaimsParams: SearchParams = {
        searchCondition: {
          keyword: searchText || "",
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
      };

      const filteredClaimsParams: SearchParams = {
        searchCondition: {
          keyword: searchText || "",
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

      const [allClaimsResponse, filteredClaimsResponse] = await Promise.all([
        claimService.searchClaimsByClaimer(allClaimsParams),
        claimService.searchClaimsByClaimer(filteredClaimsParams),
      ]);

      if (allClaimsResponse?.data?.pageData) {
        const allClaimsData = allClaimsResponse.data.pageData;
        setAllClaims(allClaimsData);

        const newCounts = {
          all: allClaimsData.length,
          draft: allClaimsData.filter(claim => claim.claim_status === "Draft").length,
          pendingApproval: allClaimsData.filter(claim => claim.claim_status === "Pending Approval").length,
          approved: allClaimsData.filter(claim => claim.claim_status === "Approved").length,
          rejected: allClaimsData.filter(claim => claim.claim_status === "Rejected").length,
          canceled: allClaimsData.filter(claim => claim.claim_status === "Canceled").length,
          paid: allClaimsData.filter(claim => claim.claim_status === "Paid").length
        };
        setStatusCounts(newCounts);
      }

      if (filteredClaimsResponse?.data?.pageData) {
        const claimsData = filteredClaimsResponse.data.pageData;
        const sortedClaimsData = [...claimsData].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setFilteredClaims(sortedClaimsData);

        setPagination((prev) => ({
          ...prev,
          totalItems: filteredClaimsResponse.data.pageInfo.totalItems,
          totalPages: filteredClaimsResponse.data.pageInfo.totalPages,
          current: pageNum,
        }));
      }

    } catch (error) {

      toast.error("An error occurred while fetching claims.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: Claim) => {
    setSelectedClaim(record);
    setIsModalVisible(true);
  };

  const handleCloseSendModal = () => {
    setIsSendModalVisible(false);
    setSelectedClaimId(null);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
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
    toast.success("Claim created successfully");
  };

  const handleCancelRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Canceled",
        comment: comment
      });
      toast.success('Request has been canceled successfully');
      fetchClaims(pagination.current);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to cancel the request');
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

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  };

  const handleSendRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Pending Approval",
        comment: comment
      });
      toast.success('Request has been sent for approval successfully');
      fetchClaims(pagination.current);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to send request for approval');
      }
    }
  };

  const handleOpenUpdateModal = async (record: Claim) => {
    try {
      setLoading(true)
      const response = await claimService.getClaimById(record._id);
      if (response?.data) {
        setLoading(false)
        setSelectedRequest(response.data);
        setIsUpdateModalVisible(true);
      }
    } catch {
      toast.error("Failed to fetch claim details for update");
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedRequest(undefined);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false);
    fetchClaims(pagination.current);
  };

  const handleViewHistory = (record: Claim) => {
    setSelectedClaim(record);
    setIsHistoryModalVisible(true);
  };

  return (
    <div className="overflow-x-auto">
      
      <Card className="shadow-md">
        <PageHeader
          title="My Claims"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          onSearchClick={() => {
            fetchClaims(pagination.current);
          }}
        />

        <div className="flex items-center justify-between">
          <StatusTabs
            activeKey={selectedStatus}
            onChange={handleStatusFilter}
            items={[
              { key: "", label: "All", count: statusCounts.all || 0 },
              { key: "Draft", label: "Draft", count: statusCounts.draft || 0 },
              { key: "Pending Approval", label: "Pending Approval", count: statusCounts.pendingApproval || 0 },
              { key: "Approved", label: "Approved", count: statusCounts.approved || 0 },
              { key: "Rejected", label: "Rejected", count: statusCounts.rejected || 0 },
              { key: "Canceled", label: "Canceled", count: statusCounts.canceled || 0 },
              { key: "Paid", label: "Paid", count: statusCounts.paid || 0 },
            ]}
          />
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <span className="text-white mr-1">Add New Claim</span>
          </button>
        </div>

        <ClaimTable
          loading={loading}
          dataSource={filteredClaims}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
              fetchClaims(page);
            },
          }}
          onView={handleView}
          onViewHistory={handleViewHistory}
          actionButtons={(record) =>
            record.claim_status === "Draft" && (
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
            )
          }
        />
      </Card>

      <ClaimDetailsModal
        visible={isModalVisible}
        claim={selectedClaim}
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
      <ClaimHistoryModal
        visible={isHistoryModalVisible}
        claim={selectedClaim}
        onClose={() => setIsHistoryModalVisible(false)}
      />
    </div>
  );
};

export default Claim;
