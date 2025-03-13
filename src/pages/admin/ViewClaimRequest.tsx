import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Tag, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SideBarAdminUser from '../../components/admin/SideBarAdminUser';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { claimService } from '../../services/claim.service';
import { Claim } from '../../models/ClaimModel';

const ViewClaimRequest: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);

  // Add useEffect to fetch claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await claimService.searchClaims({
          searchCondition: {
            keyword: "",
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });
        setClaims(response.data.pageData);
        setFilteredClaims(response.data.pageData);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };
    fetchClaims();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterClaims(value, selectedStatus);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    filterClaims(searchText, value);
  };

  const filterClaims = (text: string, status: string) => {
    let filtered = claims.filter(claim =>
      (claim.staff_name.toLowerCase().includes(text.toLowerCase()) ||
      claim._id.toLowerCase().includes(text.toLowerCase()))
    );

    if (status !== 'All') {
      filtered = filtered.filter(claim => claim.claim_status === status);
    }

    setFilteredClaims(filtered);
  };

  const handleAddUser = () => {
    console.log('Add user clicked');
  };

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
          status === 'Pending Approval' ? 'gold' :
          status === 'Approved' ? 'green' :
          status === 'Paid' ? 'blue' :
          status === 'Rejected' ? 'red' :
          status === 'Cancelled' ? 'gray' :
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdminUser onAddUser={handleAddUser} />
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
          
          <div className="flex gap-4">
            <Select
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={handleStatusChange}
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Pending Approval', label: 'Pending Approval' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Paid', label: 'Paid' },
              ]}
            />
            <Input
              placeholder="Search by ID or claimer..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">View Claim Requests</h1>
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table 
              columns={columns} 
              dataSource={filteredClaims}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                total: filteredClaims.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="overflow-hidden"
              scroll={{ x: 1000 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewClaimRequest;
