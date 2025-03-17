import React, { useState, useEffect } from "react";
import { Table, Tag, Card, Input,  Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { claimLogService } from "../../services/claimLog.service";
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from '../../components/admin/AdminSidebar';

interface Transaction {
  _id: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminDashboard = location.pathname === "/dashboard/transaction";

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [claimId, setClaimId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [debouncedClaimId] = useDebounce(claimId, 1500);

  const fetchTransactions = async () => {
    if (!debouncedClaimId.trim()) {
      toast.warning("Please enter a Claim ID");
      return;
    }

    try {
      setLoading(true);
      const response = await claimLogService.searchClaimLogs({
        searchCondition: {
          claim_id: debouncedClaimId,
          is_deleted: false,
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      });

      setTransactions(response.data.pageData || ([] as Transaction[]));
      setPagination((prev) => ({
        ...prev,
        total: response.data.pageInfo?.totalItems || 0,
      }));
      setHasSearched(true);
    } catch (err) {
      setTransactions([]); }
      finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchTransactions();
  };

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  useEffect(() => {
    if (debouncedClaimId) {
      handleSearch();
    } else if (hasSearched) {
      setHasSearched(false);
      setTransactions([]);
    }
  }, [debouncedClaimId]);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      Draft: "gray",
      "Pending Approval": "orange",
      Approved: "green",
      Rejected: "red",
      Paid: "blue",
      Canceled: "red",
    };
    return colors[status] || "default";
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
      width: "15%",
    },
    {
      title: "Claim Name",
      dataIndex: "claim_name",
      key: "claim_id",
      width: "15%",
    },
    {
      title: "Status Change",
      key: "statusChange",
      width: "25%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color={getStatusColor(record.old_status)}>
            {record.old_status}
          </Tag>
          <span>→</span>
          <Tag color={getStatusColor(record.new_status)}>
            {record.new_status}
          </Tag>
        </div>
      ),
    },
    {
      title: "Created at",
      key: "time",
      width: "15%",
      render: (_, record) => (
        <div>
          <div className="text-sm">
            {dayjs(record.created_at).format("HH:mm:ss")}
          </div>
          <div className="text-xs text-gray-500">
            {dayjs(record.created_at).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
  {
  title: "Updated at",
  key: "time",
  width: "15%",
  defaultSortOrder: 'ascend',
  sortDirections: ['descend', 'ascend'],
  sorter: (a, b) => {
    return dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf();
  },
  render: (_, record) => (
    <div>
      <div className="text-sm">
        {dayjs(record.updated_at).format("HH:mm:ss")}
      </div>
      <div className="text-xs text-gray-500">
        {dayjs(record.updated_at).format("DD/MM/YYYY")}
      </div>
    </div>
  ),
},
    {
      title: "Updated by",
      dataIndex: "updated_by",
      key: "updated_by",
      width: "15%",
    },
  ];

  return (
    <div className={`${isAdminDashboard ? "flex min-h-screen bg-gray-100" : ""}`}>
      {isAdminDashboard && <AdminSidebar />}
      <div
        className={`${
          isAdminDashboard ? "flex-1 ml-64 p-8" : "container mx-auto px-4 py-8"
        }`}
      >
        {isAdminDashboard && (
          <div className="flex items-center justify-between mb-6">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard")}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
          </div>
        )}

        <Card className="shadow-lg rounded-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Request History
            </h1>

            <div className="flex gap-2">
              <Input
                placeholder="Enter Claim ID"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                style={{ maxWidth: "300px" }}
                prefix={<SearchOutlined className="text-gray-400" />}
              />
            </div>
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
                items_per_page: "/ page",
                jump_to: "Go to page",
                page: "Page",
                prev_page: "Previous",
                next_page: "Next",
              },
            }}
            onChange={handleTableChange}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
            locale={{
              emptyText: hasSearched
                ? "No data found for this Claim ID"
                : "Enter a Claim ID to view its history",
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default TransactionPage;
