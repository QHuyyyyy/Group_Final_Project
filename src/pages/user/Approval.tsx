import { useState } from "react";
import { Table, Tag, Space, Button } from "antd";
import SearchBar from "../../components/common/SearchBar";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

type Claim = {
  id: number;
  submittedBy: string;
  department: string;
  employeeId: string;
  overtimeType: string;
  startTime: string;
  endTime: string;
  submittedDate: string;
  amount: number;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
};

const DUMMY_CLAIMS: Claim[] = [
  {
    id: 1,
    amount: 2.5,
    status: "Pending",
    submittedBy: "John Doe",
    employeeId: "SE180000",
    submittedDate: "2025-02-10",
    description: "Travel expenses for client meeting",
    overtimeType: "Holiday",
    startTime: "18:00",
    endTime: "20:30",
    department: "IT",
  },
  {
    id: 2,
    amount: 3,
    status: "Pending",
    submittedBy: "Jane Smith",
    employeeId: "SE180001",
    submittedDate: "2025-02-09",
    description: "Monthly office supplies purchase",
    overtimeType: "Normal day",
    startTime: "18:00",
    endTime: "21:00",
    department: "IT",
  },
  {
    id: 3,
    amount: 4,
    status: "Approved",
    submittedBy: "Alice Johnson",
    employeeId: "SE180002",
    submittedDate: "2025-02-08",
    description: "Extra work on project deadline",
    overtimeType: "Weekend",
    startTime: "14:00",
    endTime: "18:00",
    department: "HR",
  },
  {
    id: 4,
    amount: 2,
    status: "Rejected",
    submittedBy: "Michael Brown",
    employeeId: "SE180003",
    submittedDate: "2025-02-07",
    description: "Business trip preparation",
    overtimeType: "Holiday",
    startTime: "19:00",
    endTime: "21:00",
    department: "Finance",
  },
  {
    id: 5,
    amount: 5,
    status: "Pending",
    submittedBy: "Emma Wilson",
    employeeId: "SE180004",
    submittedDate: "2025-02-06",
    description: "Assisting in system migration",
    overtimeType: "Normal day",
    startTime: "17:30",
    endTime: "22:30",
    department: "IT",
  },
  {
    id: 6,
    amount: 3.5,
    status: "Approved",
    submittedBy: "Robert Davis",
    employeeId: "SE180005",
    submittedDate: "2025-02-05",
    description: "Emergency server maintenance",
    overtimeType: "Weekend",
    startTime: "20:00",
    endTime: "23:30",
    department: "IT",
  },
  {
    id: 7,
    amount: 4.5,
    status: "Pending",
    submittedBy: "Sophia Miller",
    employeeId: "SE180006",
    submittedDate: "2025-02-04",
    description: "Finalizing financial report",
    overtimeType: "Normal day",
    startTime: "18:00",
    endTime: "22:30",
    department: "Finance",
  },
];

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>(DUMMY_CLAIMS);
  const [, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    const filteredClaims = DUMMY_CLAIMS.filter(
      (claim) =>
        claim.description.toLowerCase().includes(query.toLowerCase()) ||
        claim.submittedBy.toLowerCase().includes(query.toLowerCase()) ||
        claim.employeeId.toLowerCase().includes(query.toLowerCase())
    );
    setClaims(filteredClaims);
  };

  const handleApprove = (id: number) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: "Approved" } : claim
      )
    );
  };

  const handleReject = (id: number) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: "Rejected" } : claim
      )
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentClaims = claims.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Claim Approvals</h1>
      <div className="flex">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="bg-white rounded-lg">
        <Table
          className="border-gray-600 shadow-lg rounded-lg"
          components={{
            header: {
              cell: ({ children }) => (
                <th className="!bg-gray-200">{children}</th>
              ),
            },
          }}
          dataSource={currentClaims}
          pagination={{
            className:
              "[&.ant-table-pagination]:bg-white [&.ant-table-pagination]:mb-0 [&.ant-table-pagination]:mt-0",
            current: currentPage,
            total: claims.length,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          columns={[
            {
              title: <span className="font-bold">Employee</span>,
              key: "employee",
              width: "15%",
              render: (_, record) => (
                <div className="flex items-center">
                  <div className="">
                    <div className="font-medium text-gray-900">
                      {record.submittedBy}
                    </div>
                    <div className="text-gray-500 text-center">
                      {record.department}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: <span className="font-bold">Employee ID</span>,
              dataIndex: "employeeId",
              key: "employeeId",
              width: "10%",
            },
            {
              title: <span className="font-bold">Overtime Type</span>,
              dataIndex: "overtimeType",
              key: "overtimeType",
              width: "10%",
            },
            {
              title: <span className="font-bold">Time</span>,
              key: "time",
              width: "10%",
              render: (_, record) => (
                <div>
                  <div>
                    {record.startTime} - {record.endTime}
                  </div>
                  <div className="text-sm text-gray-500 ml-1">
                    {record.submittedDate}
                  </div>
                </div>
              ),
            },
            {
              title: <span className="font-bold">Hours</span>,
              key: "hours",
              width: "8%",
              render: (_, record) => `${record.amount.toFixed(1)}h`,
            },
            {
              title: <span className="font-bold">Reason</span>,
              dataIndex: "description",
              key: "description",
              width: "25%",
            },
            {
              title: <span className="font-bold">Status</span>,
              key: "status",
              width: "10%",
              render: (_, record) => (
                <Tag
                  color={
                    record.status === "Approved"
                      ? "success"
                      : record.status === "Rejected"
                        ? "error"
                        : "warning"
                  }
                >
                  {record.status}
                </Tag>
              ),
            },
            {
              title: <span className="font-bold">Actions</span>,
              key: "actions",
              width: "10%",
              render: (_, record) =>
                record.status === "Pending" ? (
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleApprove(record.id)}
                      style={{ backgroundColor: "#52c41a" }}
                    />
                    <Button
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => handleReject(record.id)}
                    />
                  </Space>
                ) : (
                  <span className="text-gray-500">Processed</span>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ApprovalPage;