import { Table, Tag, Button, Avatar } from "antd";
import { EyeOutlined, UserOutlined, HistoryOutlined  } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Claim } from "../../models/ClaimModel";
import type { TableRowSelection } from "antd/es/table/interface";

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
  onViewHistory?: (record: Claim) => void;
  actionButtons?: (record: Claim) => React.ReactNode;
  showAmount?: boolean;
  rowSelection?: TableRowSelection<Claim>;
}

const ClaimTable = ({
  dataSource,
  pagination,
  onView,
  onViewHistory,
  actionButtons,
  showAmount = false,
  rowSelection,
}: ClaimTableProps) => {
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

  const columns = [
    {
      title: "No.",
      key: "index",
      width: "30px",
      className: "text-center",
      render: (_: any, __: any, index: number) => (
        <div className="text-gray-600 font-medium">
          {((pagination.current - 1) * pagination.pageSize) + index + 1}
        </div>
      ),
    },
    {
      title: "Staff",
      key: "staff",
      width: "18%",
      render: (_: any, record: Claim) => (
        <div className="flex items-center gap-3 py-1">
          <Avatar
            size={45}
            src={record.employee_info?.avatar_url}
            icon={!record.employee_info?.avatar_url && <UserOutlined />}
            className="bg-blue-500 shadow-sm"
          />
          <div>
            <div className="font-medium text-gray-800">{record.staff_name}</div>
            <div className="text-sm text-gray-500">{record.staff_email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Claim name",
      dataIndex: "claim_name",
      key: "claim_name",
      width: "15%",
      className: "text-gray-800 font-medium truncate",
    },
    {
      title: "Period",
      key: "period",
      width: "15%",
      render: (_: any, record: Claim) => (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-gray-800">
                {dayjs(record.claim_start_date).format("DD MMM")} - {dayjs(record.claim_end_date).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "total_work_time",
      key: "total_work_time",
      width: "10%",
      className: "text-gray-800 font-medium",
      render: (total_work_time: number) => (
          <span className="bg-blue-50 px-3 py-1 rounded-full">
            {total_work_time}h
          </span>
      ),
    },
    ...(showAmount ? [{
      title: "Amount",
      key: "amount",
      width: "10%",
      className: "text-gray-800 font-medium",
      render: (_: any, record: Claim) => (
        <div className="py-2">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
            ${record.total_work_time * 50}
          </span>
        </div>
      ),
    }] : []),
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      width: "120px",
      render: (status: string) => (
        <div className="py-2">
          <Tag color={getStatusColor(status)} className="px-3 py-1 text-sm font-medium rounded-full">
            {status}
          </Tag>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_: any, record: Claim) => (
        <div className="flex items-center gap-2 py-2">
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-500" />}
            onClick={() => onView(record)}
            title="View"
            className="hover:bg-blue-50 rounded-full"
          />
          <Button
            type="text"
            icon={<HistoryOutlined className="text-green-500" />}
            onClick={() => onViewHistory?.(record)}
            title="View History"
            className="hover:bg-green-50 rounded-full"
          />
          {actionButtons && actionButtons(record)}
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="_id"
      rowSelection={rowSelection}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} claims`,
      }}
      className="overflow-x-auto shadow-sm rounded-lg"
      scroll={{ x: 1000 }}
      rowClassName={() => 'hover:bg-gray-50 transition-colors'}
    />
  );
};

export default ClaimTable;