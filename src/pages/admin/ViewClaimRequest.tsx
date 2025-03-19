import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Input, Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { claimService } from '../../services/claim.service';
import { Claim, ClaimById } from '../../models/ClaimModel';
import RequestDetails from '../../components/user/RequestDetails';
import debounce from 'lodash/debounce';
import NavbarAdminDashboard from '../../components/NavbarAdminDashboard';

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
  const [selectedClaim, setSelectedClaim] = useState<ClaimById | undefined>(undefined);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

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

  const fetchClaims = async (pageNum: number) => {
    try {
      setLoading(true);
      // Fetch status counts
      const countPromises = claimStatuses.map(async (status) => {
        if (status.value !== '') {
          const countParams = {
            searchCondition: {
              keyword: searchText || "",
              claim_status: status.value,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 1,
            },
          };
          const countResponse = await claimService.searchClaims(countParams, {showSpinner:false});
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

      // Fetch claims with selected status
      const params = {
        searchCondition: {
          keyword: searchText || "",
          claim_status: selectedStatus || "",
        },
        pageInfo: {
          pageNum: pageNum,
          pageSize: pagination.pageSize,
        },
      };

      const response = await claimService.searchClaims(params, {showSpinner:false});
      if (response?.data?.pageData) {
        setFilteredClaims(response.data.pageData);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages,
          current: pageNum
        }));
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setPagination(prev => ({ ...prev, current: 1 }));
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return { color: 'orange', bgColor: '#fff7e6', borderColor: '#ffd591' };
      case 'Pending Approval':
        return { color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#91d5ff' };
      case 'Approved':
        return { color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' };
      case 'Rejected':
        return { color: '#ff4d4f', bgColor: '#fff1f0', borderColor: '#ffa39e' };
      case 'Canceled':
        return { color: '#434343', bgColor: '#fafafa', borderColor: '#d9d9d9' };
      case 'Paid':
        return { color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#87e8de' };
      default:
        return { color: '#d9d9d9', bgColor: '#fafafa', borderColor: '#d9d9d9' };
    }
  };

  const renderStatusButtons = () => (
    <div className="flex gap-2 mb-6">
      {claimStatuses.map(status => {
        const { color, bgColor, borderColor } = getStatusColor(status.value);
        return (
          <Button
            key={status.value}
            onClick={() => handleStatusFilter(status.value)}
            style={{
              color: selectedStatus === status.value ? 'white' : color,
              backgroundColor: selectedStatus === status.value ? color : bgColor,
              borderColor: borderColor,
              fontWeight: 500,
            }}
            className="flex items-center hover:opacity-80"
          >
            {status.label}
            <span
              className="ml-2 px-2 py-0.5 text-xs rounded-full"
              style={{
                backgroundColor: selectedStatus === status.value ? bgColor : 'white',
                color: color,
                border: `1px solid ${borderColor}`,
              }}
            >
              {status.value === '' ? pagination.totalItems : statusCounts[status.value] || 0}
            </span>
          </Button>
        )
      })}
    </div>
  );

  const columns: ColumnsType<Claim> = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'claim_status',
      key: 'claim_status',
      width: '15%',
      render: (status: string) => {
        const { color, bgColor, borderColor } = getStatusColor(status);
        return (
          <Tag
            style={{
              color: color,
              backgroundColor: bgColor,
              borderColor: borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Claimer',
      dataIndex: 'staff_name',
      key: 'staff_name',
      width: 150,
    },
    {
      title: 'Claim Name',
      dataIndex: 'claim_name',
      key: 'claim_name',
      width: 200,
    },
    {
      title: 'Work Time (hours)',
      dataIndex: 'total_work_time',
      key: 'total_work_time',
      width: 120,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
  ];

  // Modify handleRowClick to show details modal
  const handleRowClick = async (record: Claim) => {
    setLoading(true)
    try {
      // Fetch detailed claim data if needed
      const detailedClaim = await claimService.getClaimById(record._id, {showSpinner:false});
      if (detailedClaim.success) {
        setLoading(false)
        setSelectedClaim(detailedClaim.data);
        setIsDetailsModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
    }
  };

  // Add debounced search function
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
      <div className="flex-1 ml-[260px]">
        <NavbarAdminDashboard />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              type="default" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
            
            <Input
              placeholder="Search by claim name..."
              prefix={<SearchOutlined className="text-gray-400" />}
              defaultValue={searchText}
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <Card className="shadow-md">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">View Claim Requests</h1>
                {renderStatusButtons()}
              </div>
            </div>
            <Table 
              loading={loading}
              columns={columns} 
              dataSource={filteredClaims}
              rowKey="_id"
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: 'pointer' }
              })}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.totalItems,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10,
                  }));
                  fetchClaims(page);
                },
              }}
              className="overflow-hidden"
              scroll={{ x: 1000 }}
            />
          </Card>

          {/* Add RequestDetails Modal */}
          <RequestDetails
            visible={isDetailsModalVisible}
            claim={selectedClaim}
            onClose={() => {
              setIsDetailsModalVisible(false);
              setSelectedClaim(undefined);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewClaimRequest;
