import { Table, Tag, Button, Avatar } from "antd";
import { EyeOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Claim } from "../../models/ClaimModel";

interface ClaimTableProps {
  loading: boolean;
  dataSource: Claim[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onView: (record: Claim) => void;
  actionButtons?: (record: Claim) => React.ReactNode;
  showAmount?: boolean;
}

const ClaimTable = ({
  loading,
  dataSource,
  pagination,
  onView,
  actionButtons,
  showAmount = false,
}: ClaimTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "gold";
      case "Pending Approval": return "blue";
      case "Approved": return "green";
      case "Rejected": return "red";
      case "Canceled": return "red";
      case "Paid": return "green";
      default: return "";
    }
  };

  const columns = [
    {
      title: "Staff",
      key: "staff",
      width: "18%",
      render: (_: any, record: Claim) => (
        <div className="flex items-center gap-4">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div className="mb-1">
            <div className="font-medium">{record.staff_name}</div>
            <div className="text-xs text-gray-500">{record.staff_email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Claim name",
      dataIndex: "claim_name",
      key: "claim_name",
      width: "15%",
    },
    {
      title: "Period",
      key: "period",
      width: "22%",
      render: (_: any, record: Claim) => (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <CalendarOutlined className="text-gray-400" />
            <span>
              {dayjs(record.claim_start_date).format("DD MMM YYYY")} - {dayjs(record.claim_end_date).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Total work time",
      dataIndex: "total_work_time",
      key: "total_work_time",
      width: "15%",
      render: (total_work_time: number) => `${total_work_time} hours`,
    },
    ...(showAmount ? [{
      title: "Amount",
      key: "amount",
      render: (_: any, record: Claim) => `$${record.total_work_time * 50}`,
    }] : []),
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      width: "120px",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Claim) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            title="View"
          />
          {actionButtons && actionButtons(record)}
        </div>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      rowKey="_id"
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} claims`,
      }}
      className="overflow-x-auto"
      scroll={{ x: 1000 }}
    />
  );
};

export default ClaimTable;
