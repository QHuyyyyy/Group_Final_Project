import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { claimLogService } from '../../services/claimLogService';
import { useUserStore } from '../../stores/userStore';
interface Transaction {
  _id: string;
  claim_id: string; 
  claim_name: string;
  old_status: string;
  new_status: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  remarks?: string;
  is_deleted: boolean;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state);
  
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await claimLogService.searchClaimLogs({
        searchCondition: {
          claim_id: "67b93c4db74349d8a681d145",
          is_deleted: false
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize
        }
      });

      setTransactions(response.pageData || []);
      setPagination(prev => ({
        ...prev,
        total: response.pageInfo?.totalItems || 0
      }));

    } catch (error) {
      console.error('Error loading transaction data:', error);
      message.error('An error occurred while loading transaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pagination.current, pagination.pageSize, user.id]);

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
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
      dataIndex: '_id',
      key: '_id',
      width: '15%',
    },
    {
      title: 'Claim Name',
      dataIndex: 'claim_name',
      key: 'claim_id',
      width: '15%',
    },
    {
      title: 'Status Change',
      key: 'statusChange',
      width: '25%',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color={getStatusColor(record.old_status)}>{record.old_status}</Tag>
          <span>→</span>
          <Tag color={getStatusColor(record.new_status)}>{record.new_status}</Tag>
        </div>
      ),
    },
    {
      title: 'Created at',
      key: 'time',
      width: '15%',
      render: (_, record) => (
        <div>
          <div className="text-sm">{dayjs(record.created_at).format('HH:mm:ss')}</div>
          <div className="text-xs text-gray-500">{dayjs(record.created_at).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Updated at',
      key: 'time',
      width: '15%',
      render: (_, record) => (
        <div>
          <div className="text-sm">{dayjs(record.updated_at).format('HH:mm:ss')}</div>
          <div className="text-xs text-gray-500">{dayjs(record.updated_at).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Updated by',
      dataIndex: 'updated_by',
      key: 'updated_by',
      width: '15%',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          className="flex items-center hover:bg-gray-100"
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className="shadow-lg rounded-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Request History</h1>
        </div>
        
        <Table
          dataSource={transactions}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} transactions`,
            locale: {
              items_per_page: '/ page',
              jump_to: 'Go to page',
              page: 'Page',
              prev_page: 'Previous',
              next_page: 'Next'
            }
          }}
          onChange={handleTableChange}
          className="overflow-x-auto"
          scroll={{ x: 1000 }}
          locale={{
            emptyText: 'No data'
          }}
        />
      </Card>
    </div>
  );
};

export default TransactionPage;