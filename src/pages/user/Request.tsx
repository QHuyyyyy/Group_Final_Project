import { useState, useEffect, useCallback } from "react";
import { Card, message, Button, notification } from "antd";
import { claimService } from "../../services/claim.service";
import UpdateRequest from "../../components/user/UpdateRequest";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { Claim, ClaimById, SearchParams } from "../../models/ClaimModel";
import CreateRequest from "./CreateRequest";
import SendRequest from "../../components/user/SendRequest";
import CancelRequest from "../../components/user/CancelRequest";  // Import lại CancelRequest
import { debounce } from "lodash";
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import StatusTabs from '../../components/shared/StatusTabs';
import ClaimTable from '../../components/shared/ClaimTable';
import PageHeader from '../../components/shared/PageHeader';

// Tạo debounced function bên ngoài component để tránh tạo lại mỗi lần render
const debouncedSearch = debounce((
  value: string,
  allClaimsData: Claim[],
  selectedStatus: string,
  setFilteredClaims: (claims: Claim[]) => void
) => {
  const filteredData = allClaimsData.filter(claim => {
    const matchesSearch = claim.claim_name.toLowerCase().includes(value.toLowerCase());
    const matchesStatus = selectedStatus ? claim.claim_status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });
  setFilteredClaims(filteredData);
}, 1000);

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
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    "": 0, // cho All
    "Draft": 0,
    "Pending Approval": 0,
    "Approved": 0,
    "Rejected": 0,
    "Canceled": 0,
    "Paid": 0
  });
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);  // Add cancel modal visibility state
  const [allClaimsData, setAllClaimsData] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));

    // Gọi debounced function với các tham số cần thiết
    debouncedSearch(value, allClaimsData, selectedStatus, setFilteredClaims);
  }, [allClaimsData, selectedStatus]);

  useEffect(() => {
    fetchClaims(pagination.current);
  }, [pagination.current, pagination.pageSize]);

  const fetchClaims = async (pageNum: number) => {
    try {
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
          pageNum: pageNum,
          pageSize: pagination.pageSize,
        },
      };

      const response = await claimService.searchClaimsByClaimer(params, {showSpinner:false});

      if (response?.data?.pageData) {
        const claimsData = response.data.pageData;
        setAllClaimsData(claimsData);

        // Cập nhật counts theo đúng key
        const newCounts: Record<string, number> = {
          "": claimsData.length, // Tổng số cho All
          "Draft": claimsData.filter(claim => claim.claim_status === "Draft").length,
          "Pending Approval": claimsData.filter(claim => claim.claim_status === "Pending Approval").length,
          "Approved": claimsData.filter(claim => claim.claim_status === "Approved").length,
          "Rejected": claimsData.filter(claim => claim.claim_status === "Rejected").length,
          "Canceled": claimsData.filter(claim => claim.claim_status === "Canceled").length,
          "Paid": claimsData.filter(claim => claim.claim_status === "Paid").length
        };
        setStatusCounts(newCounts);

        // Filter theo status hiện tại
        const filteredData = selectedStatus 
          ? claimsData.filter(claim => claim.claim_status === selectedStatus)
          : claimsData;
        setFilteredClaims(filteredData);

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
    message.success("Claim created successfully");
  };

  const handleCancelRequest = async (id: string, comment: string) => {
    try {
      await claimService.changeClaimStatus({
        _id: id,
        claim_status: "Canceled",
        comment: comment
      },{showSpinner:false  });
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

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));

    // Filter từ allClaimsData
    const filteredData = value 
      ? allClaimsData.filter(claim => claim.claim_status === value)
      : allClaimsData;
    setFilteredClaims(filteredData);
  };

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

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <PageHeader
          title="My Claims"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <StatusTabs
              activeKey={selectedStatus}
              onChange={handleStatusFilter}
              items={[
                { key: "", label: "All", count: statusCounts[""] || 0 },
                { key: "Draft", label: "Draft", count: statusCounts["Draft"] || 0 },
                { key: "Pending Approval", label: "Pending Approval", count: statusCounts["Pending Approval"] || 0 },
                { key: "Approved", label: "Approved", count: statusCounts["Approved"] || 0 },
                { key: "Rejected", label: "Rejected", count: statusCounts["Rejected"] || 0 },
                { key: "Canceled", label: "Canceled", count: statusCounts["Canceled"] || 0 },
                { key: "Paid", label: "Paid", count: statusCounts["Paid"] || 0 },
              ]}
            />
          </div>
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
    </div>
  );
};

export default Claim;
