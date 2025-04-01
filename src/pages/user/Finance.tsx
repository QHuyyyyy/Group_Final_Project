import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { exportToExcel, formatClaimForExcel } from '../../utils/xlsxUtils';
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import ClaimTable from '../../components/shared/ClaimTable';
import PageHeader from "../../components/shared/PageHeader";
import type { Key } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClaimHistoryModal from '../../components/shared/ClaimHistoryModal';
import PaymentConfirmationModal from '../../components/shared/FinanceModal';
import { debounce } from "lodash";

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [displayClaims, setDisplayClaims] = useState<Claim[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isBatchPaymentModalVisible, setIsBatchPaymentModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<string>("claim_name");

  const refreshNotifications = () => {
    const event = new CustomEvent('refreshNotifications');
    window.dispatchEvent(event);
  };

  const fetchClaims = async (pageNum: number = pagination.current) => {
    setLoading(true);
    const params: SearchParams = {
      searchCondition: {
        keyword: "",
        claim_status: "",
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      },
      pageInfo: {
        pageNum: pageNum,
        pageSize: pageNum === 1 ? 1000 : pagination.pageSize,
      },
    };

    try {
      const response = await claimService.searchClaimsForFinance(params);
      if (response?.data?.pageData) {
        const claimsData = response.data.pageData.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        if (pageNum === 1) {
          setAllClaims(claimsData);
        }

        const displayData = pageNum === 1 
          ? claimsData.slice(0, pagination.pageSize)
          : claimsData;

        const filteredData = displayData.filter(claim => {
          if (!searchTerm) return true;
          if (searchType === 'claim_name') {
            return claim.claim_name.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (searchType === 'staff_name') {
            return claim.staff_name.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return true;
        });
        
        setDisplayClaims(filteredData);

        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages,
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims(pagination.current);
  }, [pagination.current, pagination.pageSize, searchTerm, searchType]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
      setTimeout(() => refreshNotifications(), 500);
    }, 1000),
    []
  );

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    if (searchTerm) {
      setSearchTerm(searchTerm);
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
      setTimeout(() => refreshNotifications(), 500);
    }
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaimForInfo(claim);
    setIsViewModalVisible(true);
  };

  const handleDownloadClaim = (claim: Claim) => {
    if (!claim) {
        toast.error('No claim data available for download.');
        return;
    }
    
    const claimData = [formatClaimForExcel(claim)];
    exportToExcel(claimData, `Claim_${claim._id}`, `${claim._id}`);
    toast.success(`Successfully downloaded claims`);
  };

  const handleDownloadAllClaims = () => {
    if (allClaims.length === 0) {
      toast.error('No claims available for download.');
      return;
    }

    const allClaimsData = allClaims
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map(formatClaimForExcel);

    exportToExcel(allClaimsData, 'ListClaims', 'List Claims');
    toast.success(`Successfully downloaded ${allClaims.length} claims`);
  };

  const handlePayClaim = async (claim: Claim) => {
    setSelectedClaimForInfo(claim);
    setShowConfirmDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedClaimForInfo) return;
    
    try {
      await claimService.changeClaimStatus({
        _id: selectedClaimForInfo._id,
        claim_status: "Paid"
      });
      
      toast.success( 
        <p>Successfully processed payment for claim {selectedClaimForInfo.claim_name} </p>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      
      setShowConfirmDialog(false);
      fetchClaims(pagination.current);
      refreshNotifications(); 
    } catch (error) {
      toast.error('Failed to process payment. Please try again.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const handleBatchPayment = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select claims to pay');
      return;
    }
    setIsBatchPaymentModalVisible(true);
  };

  const handleConfirmBatchPayment = async () => {
    try {
      const promises = selectedRowKeys.map(id => 
        claimService.changeClaimStatus({
          _id: id.toString(),
          claim_status: "Paid"
        })
      );
      
      await Promise.all(promises);
      
      toast.success(
        <p>Successfully processed payment for {selectedRowKeys.length} claims</p>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      
      setSelectedRowKeys([]);
      setIsBatchPaymentModalVisible(false);
      fetchClaims();
      refreshNotifications(); // Refresh notifications after batch payment
    } catch (error) {
      toast.error('Failed to process batch payment. Please try again.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const handleDownloadSelectedClaims = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select claims to download');
      return;
    }

    const selectedClaimsData = displayClaims
      .filter(claim => selectedRowKeys.includes(claim._id))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map(formatClaimForExcel);

    exportToExcel(selectedClaimsData, 'Selected_Claims', 'Selected Claims');
    toast.success(`Successfully downloaded ${selectedRowKeys.length} claims`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (_: Key[], selectedRows: Claim[]) => {
      // Only allow selection of Approved claims
      const approvedKeys = selectedRows
        .filter(claim => claim.claim_status === "Approved")
        .map(claim => claim._id);
      setSelectedRowKeys(approvedKeys);
    },
    getCheckboxProps: (record: Claim) => ({
      disabled: record.claim_status !== "Approved",
      name: record.claim_name,
    }),
  };

  const handleViewHistory = (record: Claim) => {
    setSelectedClaimForInfo(record);
    setIsHistoryModalVisible(true);
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Card className="shadow-md">
        <PageHeader
          title="Pay Management"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          searchPlaceholder={`Search by ${searchType === 'claim_name' ? 'claim name' : 'staff name'}`}
          onSearchClick={() => {
            fetchClaims(pagination.current);
            refreshNotifications();
          }}
        />

        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-2">
            {selectedRowKeys.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleBatchPayment}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <DollarOutlined style={{ color: 'white', marginRight: '8px' }} />
                  <span className="text-white mr-1">Pay Selected ({selectedRowKeys.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSelectedClaims}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileExcelOutlined style={{ color: 'white', marginRight: '8px' }} />
                  <span className="text-white mr-1">Download Selected ({selectedRowKeys.length})</span>
                </button>
              </>
            )}
            <button
              type="button"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleDownloadAllClaims}
              title="Download All Claims"
              aria-label="Download All Claims"
            >
            <FileExcelOutlined style={{ color: 'white', marginRight: '8px' }} />
              <span className="text-white mr-1">Download All</span>
            </button>
          </div>
        </div>

        <ClaimTable
          loading={loading}
          dataSource={displayClaims}
          showAmount={true}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
              fetchClaims(page);
            },
          }}
          onView={handleViewClaim}
          onViewHistory={handleViewHistory}
          actionButtons={(record) => (
            <>
              <Button
                type="text"
                icon={<DownloadOutlined style={{ color: 'blue' }} />}
                onClick={() => handleDownloadClaim(record)}
                title="Download Claim"
              />
              {record.claim_status === "Approved" && (
                <Button
                  type="text"
                  icon={<DollarOutlined style={{ color: 'green' }} />}
                  onClick={() => handlePayClaim(record)}
                  title="Pay Claim"
                />
              )}
            </>
          )}
        />
      </Card>

      <PaymentConfirmationModal
        visible={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmPayment}
      />

      <PaymentConfirmationModal
        visible={isBatchPaymentModalVisible}
        onCancel={() => setIsBatchPaymentModalVisible(false)}
        onConfirm={handleConfirmBatchPayment}
        count={selectedRowKeys.length}
      />

      <ClaimHistoryModal
        visible={isHistoryModalVisible}
        claim={selectedClaimForInfo}
        onClose={() => setIsHistoryModalVisible(false)}
      />

      <ClaimDetailsModal
        visible={isViewModalVisible}
        claim={selectedClaimForInfo}
        onClose={() => setIsViewModalVisible(false)}
      />
    </div>
  );
};

export default Finance;
