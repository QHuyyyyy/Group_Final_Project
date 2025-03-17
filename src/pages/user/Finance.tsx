import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, EyeOutlined, DownloadOutlined, FileExcelOutlined, FilterOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal, Input, Tabs, message, Button, Table, Avatar, Tag, Card } from 'antd';
import { exportToExcel } from '../../utils/xlsxUtils';
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { ViewClaimModal, BatchPaymentConfirmModal } from "../../components/user/FinanceModals";

const { Search } = Input;

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [showBatchConfirmDialog, setShowBatchConfirmDialog] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    approved: 0,
    paid: 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  const fetchClaims = async () => {
    setLoading(true);
    const params: SearchParams = {
      searchCondition: {
        keyword: searchTerm || "",
        claim_status: statusFilter === "Paid" ? "Paid" : statusFilter || "",
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
      if (response && response.data && response.data.pageData) {
        const claimsData = response.data.pageData;
        const filteredClaims = statusFilter === "Paid" 
          ? claimsData.filter(claim => claim.claim_status === "Paid") 
          : claimsData;

        setClaims(filteredClaims);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages,
          current: pagination.current
        }));

        // Update status counts
        const counts = {
          all: claimsData.length,
          approved: claimsData.filter(claim => claim.claim_status === "Approved").length,
          paid: claimsData.filter(claim => claim.claim_status === "Paid").length
        };
        setStatusCounts(counts);
      }
    } catch (error) {
      message.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchTerm, statusFilter]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPagination(prev => ({
        ...prev,
        current: 1,
      }));
    }, 2000),
    []
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
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
    if (claims.length === 0) {
        message.error('No claims available for download.');
        return;
    }

    const allClaimsData = claims.map(claim => ({
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
      message.success('Claim has been marked as paid successfully');
      setShowConfirmDialog(false);
      fetchClaims(); // Refresh the claims list
    } catch (error) {
      message.error('Failed to update claim status');
    }
  };

  const handleBatchPayment = async () => {
    setIsBatchProcessing(true);
    try {
      const results = await Promise.all(
        selectedRowKeys.map(claimId =>
          claimService.changeClaimStatus({
            _id: claimId,
            claim_status: "Paid"
          })
        )
      );
      
      const successCount = results.filter(result => result !== null).length;
      message.success(`Successfully processed ${successCount} claims`);
      setSelectedRowKeys([]);
      setShowBatchConfirmDialog(false);
      fetchClaims();
    } catch (error) {
      message.error('Failed to process some claims');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchDownload = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select claims to download');
      return;
    }

    const selectedClaimsData = claims
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

    exportToExcel(selectedClaimsData, 'BatchClaims', 'Batch Claims');
    message.success(`Downloaded ${selectedRowKeys.length} claims`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Claim[]) => {
      setSelectedRowKeys(selectedRowKeys as string[]);
    },
    getCheckboxProps: (record: Claim) => ({
      disabled: record.claim_status !== "Approved",
      name: record._id,
    }),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "processing";
      case "Paid":
        return "success";
      default:
        return "warning";
    }
  };
  
  return (
    <div className="overflow-x-auto bg-white">
       <Card className="shadow-md">
      <div className="overflow-x-auto p-2">
      <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Paid Claims</h1>
          <Search
                placeholder="Search claims..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="!w-72"
                allowClear
              />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
           
            <div className="flex items-center ml-4">
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
                          ({statusCounts.all})
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
                    key: "Paid",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Paid
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.paid})
                        </span>
                      </span>
                    )
                  }
                ]}
              />
            </div>
          </div>
           
          <div className="flex gap-2">
            {selectedRowKeys.length > 0 && (
              <>
                <button
                  type="button"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  onClick={() => setShowBatchConfirmDialog(true)}
                  disabled={isBatchProcessing}
                >
                  <DollarOutlined className="mr-2" />
                  Pay Selected ({selectedRowKeys.length})
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  onClick={handleBatchDownload}
                >
                  <FileExcelOutlined className="mr-2" />
                  Download Selected
                </button>
              </>
            )}
            <button
              type="button"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={handleDownloadAllClaims}
              title="Download All Claims"
              aria-label="Download All Claims"
            >
              <span className="text-white mr-1">Download All</span>
              <FileExcelOutlined style={{ color: 'white' }} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table
            rowSelection={rowSelection}
            dataSource={claims}
            loading={loading}
            rowKey="_id"
            columns={[
              {
                title: "No.",
                key: "index",
                render: (_, __, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
                width: "5%",
              },
              {
                title: "Staff",
                key: "staff",
                width: "18%",
                render: (_, record) => (
                  <div className="flex items-center gap-4">
                    <Avatar
                      size="large"
                      icon={<UserOutlined />}
                      className="bg-blue-500"
                    />
                    <div className="mb-1">
                      <div className="font-medium">{record.staff_name}</div>
                      <div className="text-xs text-gray-500">{record.staff_email}</div>
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
                title: "Period",
                key: "period",
                width: "22%",
                render: (_, record) => (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <CalendarOutlined className="text-gray-400" />
                      <span>
                        <div>
                          {dayjs(record.claim_start_date).format("DD MMM YYYY")}
                        </div>
                        <div>
                          {dayjs(record.claim_end_date).format("DD MMM YYYY")}
                        </div>
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                title: "Total work time",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: "15%",
                render: (_, record) => (
                  <div className="flex items-center gap-1 mb-1">
                      <span>{record.total_work_time} hours</span>
                  </div>
                ),
              },
              {
                title: "Amount",
                key: "amount",
                render: (_, record) => `$${record.total_work_time * 50}`,
              },
              {
                title: "Status",
                key: "status",
                render: (_, record) => (
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      record.claim_status === "Approved"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {record.claim_status}
                  </span>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm bg-transparent text-black hover:bg-gray-200 transition-colors rounded-md"
                      onClick={() => handleViewClaim(record)}
                      title="View Claim"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm bg-transparent text-black hover:bg-blue-200 transition-colors rounded-md"
                      onClick={() => handleDownloadClaim(record)}
                      title="Download Claim"
                      aria-label="Download Claim"
                    >
                      <DownloadOutlined style={{ color: 'blue' }} />
                    </button>
                    {record.claim_status === "Approved" && (
                      <button
                        type="button"
                        className="px-4 py-2 text-sm bg-transparent text-black hover:bg-green-200 transition-colors rounded-md"
                        onClick={() => handlePayClaim(record)}
                        title="Pay Claim"
                      >
                        <DollarOutlined style={{ color: 'green' }} />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.totalItems,
              showTotal: (total) => `Total ${total} claims`,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '50'],
              size: "small",
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10
                }));
                fetchClaims();
              },
            }}
          />
        </div>
      </div>
     </Card>
      {showConfirmDialog && (
        <Modal
          title={<h2 className="text-2xl font-bold text-center text-green-800">Payment Confirmation <DollarOutlined style={{ color: 'green', fontSize: '30px' }} className="mb-2 animate-bounce" /></h2>}
          open={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowConfirmDialog(false)} className="bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200">
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleConfirmPayment}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200 flex items-center"
            >
              <DollarOutlined className="mr-2" />
              Confirm
            </Button>
          ]}
          width={600}
          className="rounded-lg shadow-lg relative"
          style={{ zIndex: 1000, backgroundColor: '#ffffff' }}
        >
          <div className="flex flex-col items-center justify-center mb-4">
            <p className="text-lg text-center text-gray-800 mb-2">
              Are you sure you want to mark this claim as paid?
            </p>
            <span className="font-semibold text-red-600">This action cannot be undone.</span>
          </div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-green-100 opacity-50 rounded-tl-lg"></div>
           <div className="absolute top-0 right-0 w-1/8 h-1/4 bg-green-100 opacity-50 rounded-br-lg"></div>
             <div className="absolute top-0 left-0 w-1/9 h-1/6 bg-green-100 opacity-50 rounded-br-lg"></div>
        </Modal>
      )}

      <ViewClaimModal
        isVisible={isViewModalVisible}
        claim={selectedClaimForInfo}
        onClose={() => {
          setIsViewModalVisible(false);
          setSelectedClaimForInfo(null);
        }}
        getStatusColor={getStatusColor}
      />

      <BatchPaymentConfirmModal
        isVisible={showBatchConfirmDialog}
        selectedCount={selectedRowKeys.length}
        isProcessing={isBatchProcessing}
        onCancel={() => setShowBatchConfirmDialog(false)}
        onConfirm={handleBatchPayment}
      />
    </div>
  );
};

export default Finance;
