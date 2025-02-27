import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SideBarAdminUser from '../../components/admin/SideBarAdminUser';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Define the status types
type ClaimStatus = 'Draft' | 'Pending Approval' | 'Cancelled' | 'Rejected' | 'Approved' | 'Paid';

// Define the claim request interface
interface ViewClaimRequest {
  id: string;
  status: ClaimStatus;
  claimer: string;
  amount: number;
  description: string;
  createdAt: Date;
}

const ViewClaimRequest: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'All'>('All');

  const initialClaims: ViewClaimRequest[] = [
    {
      id: "CLM001",
      status: "Pending Approval",
      claimer: "Nguyen Van A",
      amount: 1500000,
      description: "Chi phí đi lại tháng 3",
      createdAt: new Date("2024-03-15")
    },
    {
      id: "CLM002",
      status: "Approved",
      claimer: "Tran Thi B",
      amount: 2300000,
      description: "Chi phí thiết bị văn phòng",
      createdAt: new Date("2024-03-10")
    },
    {
      id: "CLM003",
      status: "Paid",
      claimer: "Le Van C",
      amount: 5000000,
      description: "Chi phí đào tạo nhân viên",
      createdAt: new Date("2024-03-05")
    },
    {
      id: "CLM004",
      status: "Rejected",
      claimer: "Pham Thi D",
      amount: 800000,
      description: "Chi phí ăn uống",
      createdAt: new Date("2024-03-01")
    }
  ];

  const [claims] = useState<ViewClaimRequest[]>(initialClaims);
  const [filteredClaims, setFilteredClaims] = useState<ViewClaimRequest[]>(initialClaims);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterClaims(value, selectedStatus);
  };

  const handleStatusChange = (value: ClaimStatus | 'All') => {
    setSelectedStatus(value);
    filterClaims(searchText, value);
  };

  const filterClaims = (text: string, status: ClaimStatus | 'All') => {
    let filtered = claims.filter(claim =>
      (claim.claimer.toLowerCase().includes(text.toLowerCase()) ||
      claim.id.toLowerCase().includes(text.toLowerCase()))
    );

    if (status !== 'All') {
      filtered = filtered.filter(claim => claim.status === status);
    }

    setFilteredClaims(filtered);
  };

  const handleAddUser = () => {
    console.log('Add user clicked');
  };

  const columns: ColumnsType<ViewClaimRequest> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: ClaimStatus) => (
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
      dataIndex: 'claimer',
      key: 'claimer',
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span>{amount.toLocaleString('vi-VN')} VND</span>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD')
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
              rowKey="id"
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
