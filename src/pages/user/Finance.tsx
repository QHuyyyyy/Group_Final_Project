import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, DownloadOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import { Modal, Tabs, message, Button, Card,  } from 'antd';
import { exportToExcel } from '../../utils/xlsxUtils';
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import { debounce } from "lodash";
import dayjs from "dayjs";
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';
import ClaimTable from '../../components/shared/ClaimTable';
import PageHeader from "../../components/shared/PageHeader";

const debouncedSearch = debounce((
  value: string,
  allClaims: Claim[],
  statusFilter: string,
  setDisplayClaims: (claims: Claim[]) => void
) => {
  const filteredData = allClaims.filter(claim => {
    const matchesSearch = claim.claim_name.toLowerCase().includes(value.toLowerCase());
    const matchesStatus = statusFilter ? claim.claim_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  setDisplayClaims(filteredData);
}, 1000);

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
    "Paid": 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [displayClaims, setDisplayClaims] = useState<Claim[]>([]);

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
      const response = await claimService.searchClaimsForFinance(params,  {showSpinner:false});
      if (response?.data?.pageData) {
        const claimsData = response.data.pageData;
        setAllClaims(claimsData);

        const newCounts: Record<string, number> = {
          "": claimsData.length,
          "Approved": claimsData.filter(claim => claim.claim_status === "Approved").length,
          "Paid": claimsData.filter(claim => claim.claim_status === "Paid").length
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
      message.error('Failed to fetch claims');
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
    
    debouncedSearch(value, allClaims, statusFilter, setDisplayClaims);
  }, [allClaims, statusFilter]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));

    const filteredData = allClaims.filter(claim => 
      value ? claim.claim_status === value : true
    );
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
        message.error('No claim data available for download.');
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
        message.error('No claims available for download.');
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
      }, {showSpinner:false});
      message.success('Claim has been marked as paid successfully');
      setShowConfirmDialog(false);
      fetchClaims(); // Refresh the claims list
    } catch (error) {
      message.error('Failed to update claim status');
    }
  };

  
  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <PageHeader
          title="Paid Claims"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
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
          <button
            type="button"
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={handleDownloadAllClaims}
            title="Download All Claims"
            aria-label="Download All Claims"
          >
            <span className="text-white mr-1">Download</span>
            <FileExcelOutlined style={{ color: 'white', marginRight: '8px' }} />
          </button>
        </div>

        <ClaimTable
          loading={loading}
          dataSource={displayClaims}
          showAmount={true}
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

      {showConfirmDialog && (
        <Modal
          title={<h2 className="text-2xl font-bold text-center">Confirm Payment</h2>}
          open={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleConfirmPayment}
              style={{ backgroundColor: '#1890ff' }}
            >
              Confirm
            </Button>
          ]}
          width={600}
          className="rounded-lg shadow-lg"
          style={{ zIndex: 1000, backgroundColor: '#f9f9f9' }}
        >
          <div className="flex items-center justify-center mb-4">
            <DollarOutlined style={{ color: 'green' }} className="text-5xl mr-2" />
            <p className="text-lg text-center">
              Are you sure you want to mark this claim as paid? <br />
              This action cannot be undone.
            </p>
          </div>
        </Modal>
      )}

        <ClaimDetailsModal
          visible={isViewModalVisible}
          claim={selectedClaimForInfo}
          onClose={handleViewModalClose}
        />
    </div>
  );
};

export default Finance;
