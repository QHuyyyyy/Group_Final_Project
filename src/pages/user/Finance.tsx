import { useState, useEffect, useCallback } from "react";
import { DollarOutlined, EyeOutlined, DownloadOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import { Modal, Descriptions, Input, Tabs, message, Button, Table } from 'antd';
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
  
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await claimService.searchClaimsForFinance({
          searchCondition: {},
          pageInfo: { pageNum: 1, pageSize: 10 }
        });
        setClaims(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchClaims();
  }, []);

  const [loading, setLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchTerm, statusFilter]);

  const fetchClaims = async () => {
    setLoading(true);
    const params: SearchParams = {
      searchCondition: {
        keyword: searchTerm || "",
        claim_status: statusFilter || "",
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
        setClaims(claimsData);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo.totalItems || 0,
        }));

        // Update status counts
        const counts = {
          all: claimsData.length,
          draft: claimsData.filter(claim => claim.claim_status === "Draft").length,
          pending: claimsData.filter(claim => claim.claim_status === "Pending Approval").length,
          approved: claimsData.filter(claim => claim.claim_status === "Approved").length,
          rejected: claimsData.filter(claim => claim.claim_status === "Rejected").length
        };
        setStatusCounts(counts);
      }
    } catch (error) {
      message.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="overflow-x-auto bg-white">
      <div className="overflow-x-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Paid Claims</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="relative w-72 mr-2">
              <Search
                placeholder="Search claims..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
                allowClear
              />
            </div>
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
                    key: "Draft",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Draft
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.draft})
                        </span>
                      </span>
                    )
                  },
                  {
                    key: "Pending Approval",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Pending
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.pending})
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
                    key: "Rejected",
                    label: (
                      <span className="flex items-center text-gray-600">
                        Rejected
                        <span className="ml-1 text-gray-500">
                          ({statusCounts.rejected})
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
                title: "Claim ID",
                dataIndex: "_id",
                key: "_id",
              },
              {
                title: "Staff Name",
                dataIndex: "staff_name",
                key: "staff_name",
              },
              {
                title: "Project",
                key: "project",
                render: (_, record) => record.project_info?.project_name || 'N/A',
              },
              {
                title: "Total Hours",
                dataIndex: "total_work_time",
                key: "total_work_time",
              },
              {
                title: "Amount ($)",
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
                  </div>
                ),
              },
            ]}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                setPagination(prev => ({ ...prev, current: page, pageSize })),
            }}
          />
        </div>
      </div>

      {showConfirmDialog && (
        <Modal
          title={<h2 className="text-2xl font-bold text-center">Confirm Payment</h2>}
          open={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={() => setShowConfirmDialog(false)}>
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
        title={<h2 className="text-2xl font-bold">Claim Details</h2>}
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={null}
        width={800}
        className="rounded-lg shadow-lg"
      >
        {selectedClaimForInfo && (
          <Descriptions bordered column={2} className="p-6 text-gray-700">
            <Descriptions.Item label="Claim ID" span={1}>{selectedClaimForInfo._id}</Descriptions.Item>
            <Descriptions.Item label="Status" span={1}>
              <span className={`px-3 py-1 text-sm rounded-full ${
                selectedClaimForInfo.claim_status === "Approved"
                  ? "bg-yellow-300 text-yellow-800"
                  : "bg-green-300 text-green-800"
              }`}>
                {selectedClaimForInfo.claim_status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Staff Name" span={1}>{selectedClaimForInfo.staff_name}</Descriptions.Item>
            <Descriptions.Item label="Project" span={1}>{selectedClaimForInfo.project_info?.project_name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="From" span={1}>{dayjs(selectedClaimForInfo.claim_start_date).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="To" span={1}>{dayjs(selectedClaimForInfo.claim_end_date).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Total Hours" span={2}>{selectedClaimForInfo.total_work_time}</Descriptions.Item>
            <Descriptions.Item label="Amount" span={2}>${selectedClaimForInfo.total_work_time * 50}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Finance;
