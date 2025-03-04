import { useState } from "react";
import { Table, Tag, Space, Button, Modal, Card, Input } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";

const { Search } = Input;

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
  status: "Pending" | "Approved" | "Rejected" | "Draft";
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
  const initialClaims = DUMMY_CLAIMS.filter(claim => 
    claim.status !== "Draft"
  );
  
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [confirmationType, setConfirmationType] = useState<"approve" | "reject" | "return" | null>(null);
  const [, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filterClaims = (query: string, status: string) => {
    let filtered = DUMMY_CLAIMS.filter(claim => claim.status !== "Draft");
    
    if (query) {
      filtered = filtered.filter(claim => 
        claim.description.toLowerCase().includes(query.toLowerCase()) ||
        claim.submittedBy.toLowerCase().includes(query.toLowerCase()) ||
        claim.employeeId.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (status) {
      filtered = filtered.filter(claim => claim.status === status);
    }
    
    return filtered;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    const filteredClaims = filterClaims(query, "");
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

  const handleReturn = (id: number) => {
    setClaims(prevClaims => {
      const newClaims = prevClaims.filter(claim => claim.id !== id);
      if (newClaims.length <= (currentPage - 1) * pageSize && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      return newClaims;
    });
  };

  const showConfirmation = (claim: Claim, type: "approve" | "reject" | "return") => {
    setSelectedClaim(claim);
    setConfirmationType(type);
  };

  const handleConfirmationOk = () => {
    if (!selectedClaim || !confirmationType) return;

    switch (confirmationType) {
      case "approve":
        handleApprove(selectedClaim.id);
        break;
      case "reject":
        handleReject(selectedClaim.id);
        break;
      case "return":
        handleReturn(selectedClaim.id);
        break;
    }

    setSelectedClaim(null);
    setConfirmationType(null);
  };

  const handleConfirmationCancel = () => {
    setSelectedClaim(null);
    setConfirmationType(null);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentClaims = claims.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Claim Approvals</h1>
        </div>
        
        <div className="overflow-auto custom-scrollbar">
          <div className="flex flex-wrap gap-4 items-center mb-5 mx-2">
            <Search
              placeholder="Search by Employee or Request ID"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </div>

          <Table
            dataSource={currentClaims}
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
                width: "15%",
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
                width: "20%",
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
                width: "15%",
                render: (_, record) => {
                  if (record.status === "Pending") {
                    return (
                      <Space>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => showConfirmation(record, "approve")}
                          style={{ backgroundColor: '#52c41a' }}
                          className="hover:!bg-[#52c41a]"
                        />
                        <Button
                          type="primary"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => showConfirmation(record, "reject")}
                        />
                        <Button
                          type="primary"
                          icon={<UndoOutlined />}
                          onClick={() => showConfirmation(record, "return")}
                          style={{ backgroundColor: '#faad14' }}
                          className="hover:!bg-[#ffeb29]"
                        />
                      </Space>
                    );
                  }
                  
                  return <span className="text-gray-500">Processed</span>;
                },
              },
            ]}
            pagination={{
              pageSize: pageSize,
              total: claims.length,
              showSizeChanger: false,
              showQuickJumper: true,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
            }}
            className="overflow-hidden"
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>

      <Modal
        title="Confirmation"
        open={!!selectedClaim}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        {confirmationType === "approve" && (
          <p>Are you sure you want to <b>approve</b> this claim?</p>
        )}
        {confirmationType === "reject" && (
          <p>Are you sure you want to <b>reject</b> this claim?</p>
        )}
        {confirmationType === "return" && (
          <p>Are you sure you want to <b>return</b> this claim?</p>
        )}
      </Modal>
    </div>
  );
}

export default ApprovalPage;