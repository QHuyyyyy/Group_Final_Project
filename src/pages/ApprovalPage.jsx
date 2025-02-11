import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import ClaimTable from '../components/ClaimTable'

const DUMMY_CLAIMS = [
  {
    id: 1,
    amount: 2.5, 
    status: "Chờ được duyệt",
    submittedBy: "John Doe",
    employeeId: "SE180000",
    submittedDate: "2025-02-10",
    description: "Travel expenses for client meeting",
    overtimeType: "Ngày thường",
    startTime: "18:00",
    endTime: "20:30",
    department: "IT"
  },
  {
    id: 2,
    amount: 3,
    status: "Chờ được duyệt", 
    submittedBy: "Jane Smith",
    employeeId: "SE180001",
    submittedDate: "2025-02-09",
    description: "Monthly office supplies purchase",
    overtimeType: "Ngày thường",
    startTime: "18:00",
    endTime: "21:00",
    department: "IT"
  }
]

function ApprovalPage() {
  const [claims, setClaims] = useState(DUMMY_CLAIMS)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query) => {
    setSearchQuery(query)
    const filteredClaims = DUMMY_CLAIMS.filter(claim => 
      claim.description.toLowerCase().includes(query.toLowerCase()) ||
      claim.submittedBy.toLowerCase().includes(query.toLowerCase()) ||
      claim.employeeId.toLowerCase().includes(query.toLowerCase())
    )
    setClaims(filteredClaims)
  }

  const handleApprove = (id) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === id ? { ...claim, status: "Đã duyệt" } : claim
      )
    )
  }

  const handleReject = (id) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === id ? { ...claim, status: "Từ chối" } : claim
      )
    )
  }

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
  )
}

export default ApprovalPage