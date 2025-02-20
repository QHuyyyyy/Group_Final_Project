import React, { useState } from 'react';
import { Table, Tag, DatePicker, Select, Input, Card, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {  ArrowLeftOutlined,SearchOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Transaction {
  id: string;
  requestId: string;
  employeeName: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  remarks: string;
}

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const mockTransactions: Transaction[] = [
    {
      id: 'TRX001',
      requestId: 'REQ001',
      employeeName: 'John Doe',
      previousStatus: 'Draft',
      newStatus: 'Pending Approval',
      changedBy: 'John Doe',
      changedAt: '2024-03-15 09:30:00',
      remarks: 'Submitted for approval'
    },
    {
      id: 'TRX002',
      requestId: 'REQ001',
      employeeName: 'John Doe',
      previousStatus: 'Pending Approval',
      newStatus: 'Approved',
      changedBy: 'Jane Smith',
      changedAt: '2024-03-16 14:20:00',
      remarks: 'Approved by manager'
    },
    {
      id: 'TRX003',
      requestId: 'REQ002',
      employeeName: 'Alice Johnson',
      previousStatus: 'Draft',
      newStatus: 'Rejected',
      changedBy: 'Bob Wilson',
      changedAt: '2024-03-17 11:45:00',
      remarks: 'Insufficient details provided'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Draft': 'gray',
      'Pending Approval': 'orange',
      'Approved': 'green',
      'Rejected': 'red',
      'Paid': 'blue'
    };
    return colors[status] || 'default';
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Request ID',
      dataIndex: 'requestId', 
      key: 'requestId',
      width: '10%',
    },
    {
      title: 'Employee',
      key: 'employee',
      width: '15%',
      render: (_, record) => (
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
            <div className="text-sm text-gray-500 text-center">{record.changedBy}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status Change',
      key: 'statusChange',
      width: '20%',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color={getStatusColor(record.previousStatus)}>{record.previousStatus}</Tag>
          <span>→</span>
          <Tag color={getStatusColor(record.newStatus)}>{record.newStatus}</Tag>
        </div>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      width: '15%',
      render: (_, record) => (
        <div>
          <div className="text-sm">{dayjs(record.changedAt).format('HH:mm:ss')}</div>
          <div className="text-xs text-gray-500">{dayjs(record.changedAt).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '20%',
    },
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.requestId.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      transaction.previousStatus === statusFilter ||
      transaction.newStatus === statusFilter;
    
    const matchesDate = !dateRange[0] || !dateRange[1] || 
      (dayjs(transaction.changedAt).isAfter(dateRange[0]) && 
       dayjs(transaction.changedAt).isBefore(dateRange[1]));

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          className="flex items-center"
        >
          Back to Dashboard
        </Button>
      </div>
    
      <Card className="shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        </div>
        <div className="overflow-auto custom-scrollbar">
        
        <div className="flex flex-wrap gap-4 items-center mb-5 mx-2">
          <Input
            placeholder="Search by Employee or Request ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder="Filter by Status"
            style={{ width: 200 }}
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
          >
            <Option value="Draft">Draft</Option>
            <Option value="Pending Approval">Pending Approval</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Paid">Paid</Option>
          </Select>
          
          <RangePicker
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 300 }}
          />
        </div>

          <Table
            dataSource={filteredTransactions}
            columns={columns}
            pagination={{
              pageSize: 10,
              total: filteredTransactions.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="overflow-hidden"
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default TransactionPage;