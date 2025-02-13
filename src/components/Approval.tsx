import { useState } from 'react';
import SearchBar from './SearchBar';
import ClaimTable from './ClaimTable';


type Claim = {
  id: number;  // Đảm bảo kiểu này giống nhau ở mọi nơi
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
  }
];

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>(DUMMY_CLAIMS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredClaims = DUMMY_CLAIMS.filter(claim => 
      claim.description.toLowerCase().includes(query.toLowerCase()) ||
      claim.submittedBy.toLowerCase().includes(query.toLowerCase()) ||
      claim.employeeId.toLowerCase().includes(query.toLowerCase())
    );
    setClaims(filteredClaims);
  };

  const handleApprove = (id: number) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === id ? { ...claim, status: "Approved" } : claim
      )
    );
  };

  const handleReject = (id: number) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === id ? { ...claim, status: "Rejected" } : claim
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Claim Approvals</h1>
      <SearchBar onSearch={handleSearch} />
      <ClaimTable
        claims={claims}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

export default ApprovalPage;