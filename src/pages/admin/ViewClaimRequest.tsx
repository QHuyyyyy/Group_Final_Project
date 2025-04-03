import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input} from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../../services/claim.service';
import { Claim } from '../../models/ClaimModel';
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import debounce from 'lodash/debounce';
import ClaimTable from '../../components/shared/ClaimTable';
import StatusTabs from '../../components/shared/StatusTabs';
import ClaimHistoryModal from '../../components/shared/ClaimHistoryModal';
import { toast } from 'react-toastify';

const ViewClaimRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const handleViewHistory = (record: Claim) => {
    setSelectedClaim(record);
    setIsHistoryModalVisible(true);
  };

  const claimStatuses = [
    { label: 'All', value: '', color: '#1890ff', bgColor: '#e6f7ff' },
    { label: 'Draft', value: 'Draft', color: '#faad14', bgColor: '#fff7e6' },
    { label: 'Pending Approval', value: 'Pending Approval', color: '#1890ff', bgColor: '#e6f7ff' },
    { label: 'Approved', value: 'Approved', color: '#52c41a', bgColor: '#f6ffed' },
    { label: 'Rejected', value: 'Rejected', color: '#ff4d4f', bgColor: '#fff1f0' },
    { label: 'Canceled', value: 'Canceled', color: '#ff4d4f', bgColor: '#fff1f0' },
    { label: 'Paid', value: 'Paid', color: '#52c41a', bgColor: '#f6ffed' },
  ];

  useEffect(() => {
    fetchClaims(pagination.current);
  }, [pagination.current, pagination.pageSize, searchText, selectedStatus]);

  const handleView = (record: Claim) => {
    setSelectedClaim(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
  };

  const fetchClaims = async (pageNum: number) => {
    try {
      setLoading(true);
      
      // Prepare params for all API calls
      const baseParams = {
        searchCondition: {
          keyword: searchText || "",
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 1,
        },
      };
  
      // Create array of promises for status counts
      const statusPromises = claimStatuses
        .filter(status => status.value !== '')
        .map(status => {
          const params = {
            ...baseParams,
            searchCondition: {
              ...baseParams.searchCondition,
              claim_status: status.value,
            }
          };
          return claimService.searchClaims(params);
        });
  
      // Add the main claims fetch promise
      const mainClaimsParams = {
        searchCondition: {
          keyword: searchText || "",
          claim_status: selectedStatus || "",
        },
        pageInfo: {
          pageNum: pageNum,
          pageSize: pagination.pageSize,
        },
      };
  
      const [mainClaimsResponse, ...statusResponses] = await Promise.all([
        claimService.searchClaims(mainClaimsParams),
        ...statusPromises
      ]);
  
      // Process status counts
      const newStatusCounts = statusResponses.reduce((acc, response, index) => {
        const status = claimStatuses[index + 1].value; // +1 because we filtered out the first "All" status
        acc[status] = response.data.pageInfo.totalItems;
        return acc;
      }, {} as Record<string, number>);
      setStatusCounts(newStatusCounts);
  
      // Process main claims data
      if (mainClaimsResponse?.data?.pageData) {
        setFilteredClaims(mainClaimsResponse.data.pageData);
        setPagination(prev => ({
          ...prev,
          totalItems: mainClaimsResponse.data.pageInfo.totalItems,
          totalPages: mainClaimsResponse.data.pageInfo.totalPages,
          current: pageNum
        }));
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Failed to fetch claims data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setPagination(prev => ({ ...prev, current: 1 }));

};

  // Chuyển đổi claimStatuses thành format phù hợp với StatusTabs
  const statusTabItems = [
    { key: '', label: 'All', count: pagination.totalItems },
    ...claimStatuses
      .filter(status => status.value !== '') // Bỏ qua status "All" vì đã thêm ở trên
      .map(status => ({
        key: status.value,
        label: status.label,
        count: statusCounts[status.value] || 0
      }))
  ];

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setPagination(prev => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  return (
    <div className="flex min-h-screen bg-sky-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <Button 
            type="default" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">View Claim Requests</h1>
            <Input
              placeholder="Search by claim name..."
              prefix={<SearchOutlined className="text-gray-400"  onClick={() => {
                fetchClaims(pagination.current);
              }}/>}
              defaultValue={searchText}
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{ width: 300 }}
             
            />
          </div>
          
          <StatusTabs
            activeKey={selectedStatus}
            onChange={handleStatusFilter}
            items={statusTabItems}
          
          />

          <ClaimTable 
            loading={loading}
            dataSource={filteredClaims}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.totalItems,
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10,
                }));
                fetchClaims(page);
              },
            }}
            onView={handleView}
            onViewHistory={handleViewHistory}
            showAmount={true}
          />
        </Card>
        <ClaimHistoryModal
        visible={isHistoryModalVisible}
        claim={selectedClaim}
        onClose={() => setIsHistoryModalVisible(false)}
      />
        {/* Add RequestDetails Modal */}
        <ClaimDetailsModal
          visible={isModalVisible}
          claim={selectedClaim}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default ViewClaimRequest;
