import { Modal, Table, Tag } from 'antd';
import type { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { claimLogService } from '../../services/claimLog.service';
import type { Claim } from '../../models/ClaimModel';
import type { ClaimLog } from '../../models/ClaimLogsModel';

interface ClaimHistoryModalProps {
  visible: boolean;
  claim: Claim | null;
  onClose: () => void;
}

const ClaimHistoryModal = ({ visible, claim, onClose }: ClaimHistoryModalProps) => {

  const [logs, setLogs] = useState<ClaimLog[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (visible && claim) {
      fetchClaimLogs(pagination.current, pagination.pageSize);
    }
  }, [visible, claim]);

  const fetchClaimLogs = async (page: number, pageSize: number) => {
    if (!claim) return;
    
   
      const response = await claimLogService.searchClaimLogs({
        searchCondition: {
          claim_id: claim._id,
        },
        pageInfo: {
          pageNum: page,
          pageSize: pageSize
        }
      });
      
      if (response?.data) {
        setLogs(response.data.pageData || []);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          totalItems: response.data.pageInfo.totalItems,
          totalPages: response.data.pageInfo.totalPages
        }));
      }
   
  };

  const handleTableChange = (newPagination: any) => {
    fetchClaimLogs(newPagination.current, newPagination.pageSize);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "default";
      case "Pending Approval": return "blue";
      case "Approved": return "gold";
      case "Rejected": return "red";
      case "Canceled": return "red";
      case "Paid": return "green";
      default: return "";
    }
  };

  const columns: ColumnsType<ClaimLog> = [
    {
      title: "No.",
      key: "index",
      width: "5%",
      render: (_, __, index) => index + 1,
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
    <Modal
      title={
        <div className="flex flex-col">
          <span className="text-xl font-semibold">Claim History</span>
          {claim && (
            <span className="text-base font-medium text-gray-700">
              Claim Name: <strong>{claim.claim_name}</strong>
            </span>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1100}
      className="claims-history-modal"
    >
      <Table
       
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.totalItems,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} records`
        }}
        onChange={handleTableChange}
        className="mt-4"
      />
    </Modal>
  );
};

export default ClaimHistoryModal;