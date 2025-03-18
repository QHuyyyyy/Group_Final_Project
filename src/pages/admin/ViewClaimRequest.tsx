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

  const renderStatusButtons = () => (
    <div className="flex gap-2">
      {claimStatuses.map(status => (
        <Button
          key={status.value}
          onClick={() => handleStatusFilter(status.value)}
          style={{
            borderColor: status.color,
            backgroundColor: selectedStatus === status.value ? status.color : status.bgColor,
            color: selectedStatus === status.value ? '#fff' : status.color,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            height: '32px',
            padding: '4px 12px',
            borderRadius: '6px',
            transition: 'all 0.3s'
          }}
          className="hover:opacity-80"
        >
          {status.label}
          <span
            style={{
              marginLeft: '8px',
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: '10px',
              backgroundColor: selectedStatus === status.value ? '#ffffff' : '#ffffff',
              color: status.color,
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: `1px solid ${status.color}`
            }}
          >
            {status.value === '' ? pagination.totalItems : statusCounts[status.value] || 0}
          </span>
        </Button>
      ))}
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
      width: 150,
      render: (status: string) => (
        <Tag color={
          status === 'Draft' ? '#faad14' :
          status === 'Pending Approval' ? '#1890ff' :
          status === 'Approved' ? '#52c41a' :
          status === 'Rejected' ? '#ff4d4f' :
          status === 'Canceled' ? '#ff4d4f' :
          status === 'Paid' ? '#52c41a' :
          'default'
        }>
          {status}
        </Tag>
      )
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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
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
  );
};

export default ViewClaimRequest;
