import { useState } from 'react';
import SearchBar from '../../components/common/SearchBar';

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
  }
];

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>(DUMMY_CLAIMS);

  const handleSearch = (query: string) => {
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{claim.submittedBy}</div>
                      <div className="text-sm text-gray-500 text-center">{claim.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{claim.employeeId}</td>
                <td className="px-4 py-4">{claim.overtimeType}</td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">{claim.startTime} - {claim.endTime}</div>
                  <div className="text-sm text-gray-500 ml-1">{claim.submittedDate}</div>
                </td>
                <td className="px-4 py-4">{claim.amount.toFixed(1)}h</td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{claim.description}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : claim.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {claim.status === "Pending" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 focus:outline-none transition-all shadow-sm hover:shadow-md active:transform"
                      >
                        ✔
                      </button>
                      <button
                        onClick={() => handleReject(claim.id)}
                        className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 focus:outline-none transition-all shadow-sm hover:shadow-md"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovalPage;