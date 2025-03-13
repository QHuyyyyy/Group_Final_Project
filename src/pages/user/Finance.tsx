import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, EyeOutlined, DownloadOutlined, FileExcelOutlined, FilterOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal, Input, Tabs, message, Button, Table, Avatar, Tag, Card } from 'antd';
import { exportToExcel } from '../../utils/xlsxUtils';
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { claimService } from "../../services/claim.service";
import { debounce } from "lodash";
import dayjs from "dayjs";

const { Search } = Input;

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
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
    }, 500),
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
      <div className="overflow-x-auto p-4">
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table
            dataSource={claims}
            loading={loading}
            rowKey="_id"
            columns={[
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
                        {dayjs(record.claim_start_date).format("DD MMM YYYY")} - {dayjs(record.claim_end_date).format("DD MMM YYYY")}
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
              showQuickJumper:true,
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

        <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-blue-500" />
            <span className="text-lg font-medium">Claim Details</span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button
            key="close"
            onClick={handleViewModalClose}
            size="large"
            className="px-6"
          >
            Close
          </Button>,
        ]}
        width={800}
        className="details-modal"
      >
        {selectedClaimForInfo && (
          <div className="p-2">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedClaimForInfo.claim_name}</h2>
               
              </div>
              <Tag
                color={getStatusColor(selectedClaimForInfo.claim_status)}
                className="px-3 py-1 text-base"
              >
                {selectedClaimForInfo.claim_status}
              </Tag>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <Card title="Staff Information" className="shadow-sm">
                <p><strong>Name:</strong> {selectedClaimForInfo.staff_name}</p>
                <p><strong>ID:</strong> {selectedClaimForInfo.staff_id}</p>
                <p><strong>Email:</strong> {selectedClaimForInfo.staff_email}</p>
              </Card>

              <Card title="Project Information" className="shadow-sm">
                <p><strong>Project:</strong> {selectedClaimForInfo.project_info?.project_name || "N/A"}</p>
                <p><strong>Role:</strong> {selectedClaimForInfo.role_in_project || "N/A"}</p>
                <p><strong>Work Time:</strong> {selectedClaimForInfo.total_work_time || "N/A"} hours</p>
              </Card>
            </div>

            <Card title="Claim Period" className="p-5 rounded-lg mb-6 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                    {dayjs(selectedClaimForInfo.claim_start_date).format("DD MMM YYYY")}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {dayjs(selectedClaimForInfo.claim_start_date).format("HH:mm")}
                  </p>
                </div>
                <div className="flex-2 mx-4 relative mb-8">
                  <div className="h-0.5 bg-blue-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 font-medium border border-blue-200 rounded-full">
                    {`${selectedClaimForInfo.total_work_time} hours`}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                    {dayjs(selectedClaimForInfo.claim_end_date).format("DD MMM YYYY")}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {dayjs(selectedClaimForInfo.claim_end_date).format("HH:mm")}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Additional Information" className="shadow-sm !mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created Date</p>
                  <p className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {dayjs(selectedClaimForInfo.created_at).format("DD MMM YYYY HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {dayjs(selectedClaimForInfo.updated_at).format("DD MMM YYYY HH:mm")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Finance;
