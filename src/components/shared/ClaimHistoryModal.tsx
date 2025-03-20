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
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ClaimLog[]>([]);

  useEffect(() => {
    if (visible && claim) {
      fetchClaimLogs();
    }
  }, [visible, claim]);

  const fetchClaimLogs = async () => {
    if (!claim) return;
    
    try {
      setLoading(true);
      const response = await claimLogService.searchClaimLogs({
        searchCondition: {
          claim_id: claim._id,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100
        }
      });
      
      if (response?.data?.pageData) {
        setLogs(response.data.pageData);
      }
    } catch (error) {
      console.error('Failed to fetch claim logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "gold";
      case "Pending Approval": return "blue";
      case "Approved": return "green";
      case "Rejected": return "red";
      case "Canceled": return "red";
      case "Paid": return "green";
      default: return "default";
    }
  };

  const columns: ColumnsType<ClaimLog> = [
    {
      title: "No.",
      key: "index",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
      width: 200,
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
            <span className="text-sm text-gray-500">
              Claim Name: {claim.claim_name}
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
        loading={loading}
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        pagination={false}
        className="mt-4"
      />
    </Modal>
  );
};

export default ClaimHistoryModal;