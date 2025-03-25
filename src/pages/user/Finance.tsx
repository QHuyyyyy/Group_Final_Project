import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, DownloadOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import {Tabs, Button, Card,  } from 'antd';
import { exportToExcel } from '../../utils/xlsxUtils';
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import dayjs from "dayjs";
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import ClaimTable from '../../components/shared/ClaimTable';
import PageHeader from "../../components/shared/PageHeader";
import type { Key } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClaimHistoryModal from '../../components/shared/ClaimHistoryModal';
import PaymentConfirmationModal from '../../components/shared/FinanceModal';
import { createDebouncedSearch } from '../../utils/searchUtils';

// Create a debounced search instance that can be reused
const debouncedSearch = createDebouncedSearch(1000);

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    "": 0,
    "Approved": 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [displayClaims, setDisplayClaims] = useState<Claim[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isBatchPaymentModalVisible, setIsBatchPaymentModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<string>("claim_name");

  const fetchClaims = async () => {
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
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    };

    try {
      const response = await claimService.searchClaimsForFinance(params);
      if (response?.data?.pageData) {
        const claimsData = response.data.pageData;
        setAllClaims(claimsData);

        const newCounts: Record<string, number> = {
          "": claimsData.length,
          "Approved": claimsData.filter(claim => claim.claim_status === "Approved").length,
        };
        setStatusCounts(newCounts);

        const filteredData = claimsData.filter(claim => {
          const matchesSearch = searchTerm 
            ? claim.claim_name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
          const matchesStatus = statusFilter 
            ? claim.claim_status === statusFilter 
            : true;
          return matchesSearch && matchesStatus;
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
    fetchClaims();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    
    debouncedSearch(value, allClaims, statusFilter, searchType, setDisplayClaims);
  }, [allClaims, statusFilter, searchType]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    if (searchTerm) {
      debouncedSearch(searchTerm, allClaims, statusFilter, value, setDisplayClaims);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));

    const filteredData = allClaims.filter(claim => {
      let matchesSearch = true;
      
      if (searchTerm) {
        if (searchType === 'claim_name') {
          matchesSearch = claim.claim_name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'staff_name') {
          matchesSearch = claim.staff_name.toLowerCase().includes(searchTerm.toLowerCase());
        }
      }
      
      const matchesStatus = value ? claim.claim_status === value : true;
      return matchesSearch && matchesStatus;
    });
    
    setDisplayClaims(filteredData);
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaimForInfo(claim);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedClaimForInfo(null);
  };

  const handleDownloadClaim = (claim: Claim) => {
    if (!claim) {
        toast.error('No claim data available for download.');
        return;
    }
    
    const claimData = [
        {
            "Claim ID": claim._id,
            "Staff Name": claim.staff_name,
            "Project": claim.project_info?.project_name || 'N/A',
            "From": dayjs(claim.claim_start_date).format('DD/MM/YYYY'),
            "To": dayjs(claim.claim_end_date).format('DD/MM/YYYY'),
            "Total Hours": claim.total_work_time,
            "Amount": claim.total_work_time * 50,
            "Status": claim.claim_status
        }
    ];

    exportToExcel(claimData, `Claim_${claim._id}`, `${claim._id}`);
  };

  const handleDownloadAllClaims = () => {
    if (displayClaims.length === 0) {
        toast.error('No claims available for download.');
        return;
    }

    const allClaimsData = displayClaims.map(claim => ({
        "Claim ID": claim._id,
        "Staff Name": claim.staff_name,
        "Project": claim.project_info?.project_name || 'N/A',
        "From": dayjs(claim.claim_start_date).format('DD/MM/YYYY'),
        "To": dayjs(claim.claim_end_date).format('DD/MM/YYYY'),
        "Total Hours": claim.total_work_time,
        "Amount": claim.total_work_time * 50,
        "Status": claim.claim_status
    }));

    exportToExcel(allClaimsData, 'ListClaims', 'List Claims');
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
      fetchClaims();
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
      .map(claim => ({
        "Claim ID": claim._id,
        "Staff Name": claim.staff_name,
        "Project": claim.project_info?.project_name || 'N/A',
        "From": dayjs(claim.claim_start_date).format('DD/MM/YYYY'),
        "To": dayjs(claim.claim_end_date).format('DD/MM/YYYY'),
        "Total Hours": claim.total_work_time,
        "Amount": claim.total_work_time * 50,
        "Status": claim.claim_status
      }));

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
          title="Paid Claim"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          searchPlaceholder={`Search by ${searchType === 'claim_name' ? 'claim name' : 'staff name'}`}
        
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FilterOutlined className="mr-4 text-gray-600" />
            <Tabs
              activeKey={statusFilter}
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
              ]}
            />
          </div>
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
              fetchClaims();
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
        onClose={handleViewModalClose}
      />
    </div>
  );
};

export default Finance;
