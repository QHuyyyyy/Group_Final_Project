import { useState } from 'react';
import Info from '../components/Info'; 


interface Claim {
  id: string;
  staffName: string;
  projectName: string;
  duration: string;
  totalHours: number;
  amount: number;
  status: string;
  auditTrail: string[];
}

const PaidClaimsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  
  // Thêm state để lưu trữ claims đã cập nhật
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-001",
      staffName: "John Smith",
      projectName: "Project Alpha",
      duration: "Jan 2024",
      totalHours: 45,
      amount: 2250,
      status: "Approved",
      auditTrail: []
    },
    {
      id: "CLM-002",
      staffName: "Jane Doe", 
      projectName: "Project Beta",
      duration: "Jan 2024",
      totalHours: 38,
      amount: 1900,
      status: "Approved",
      auditTrail: []
    }
  ]);

  const handleMarkAsPaid = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowConfirmDialog(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedClaim) return;

    const currentDateTime = new Date().toLocaleString();
    const approverName = "John Doe"; 

    
    const updatedClaims = claims.map(claim => 
      claim.id === selectedClaim.id 
        ? {
            ...claim,
            status: "Paid",
            auditTrail: [
              ...claim.auditTrail,
              `Paid by ${approverName} on ${currentDateTime}`
            ]
          }
        : claim
    );

    setClaims(updatedClaims);

   
    setShowConfirmDialog(false);
    setSelectedClaim(null);
    
    console.log('Claim marked as paid:', updatedClaims);
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaimForInfo(claim);
  };

  const handleCloseInfo = () => {
    setSelectedClaimForInfo(null);
  };

  const handleDownloadClaim = (claim: Claim) => {
    const claimData = `
      Claim ID: ${claim.id}
      Staff Name: ${claim.staffName}
      Project: ${claim.projectName}
      Duration: ${claim.duration}
      Total Hours: ${claim.totalHours}
      Amount: $${claim.amount}
      Status: ${claim.status}
      Audit Trail: ${claim.auditTrail.join(', ')}
    `;

    const blob = new Blob([claimData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim_${claim.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-x-auto">

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Paid Claims</h1>
        <p className="text-gray-500 text-sm mb-4">View and manage paid claims</p>
      </div>

  
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6 6" />
          </svg>
          <input
            type="text"
            placeholder="Search claims..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      
      </div>

     
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="py-3 px-4 font-medium">Claim ID</th>
                <th className="py-3 px-4 font-medium">Staff Name</th>
                <th className="py-3 px-4 font-medium">Project</th>
                <th className="py-3 px-4 font-medium">Duration</th>
                <th className="py-3 px-4 font-medium">Total Hours</th>
                <th className="py-3 px-4 font-medium">Amount ($)</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    No claims found
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">{claim.id}</td>
                    <td className="py-4 px-4">{claim.staffName}</td>
                    <td className="py-4 px-4">{claim.projectName}</td>
                    <td className="py-4 px-4">{claim.duration}</td>
                    <td className="py-4 px-4">{claim.totalHours}</td>
                    <td className="py-4 px-4">${claim.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        claim.status === 'Approved' 
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button 
                          className={`px-3 py-1 text-sm ${claim.status === 'Paid' ? 'bg-[#40a9ff]' : 'bg-green-600'} rounded-md hover:bg-#4096ff transition-colors`}
                          onClick={claim.status === 'Paid' ? () => handleViewClaim(claim) : () => handleMarkAsPaid(claim)}
                        >
                          {claim.status === 'Paid' ? 'View' : 'Pay'}
                        </button>
                        {claim.status === 'Paid' && (
                          <button 
                            className="px-3 py-1 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => handleDownloadClaim(claim)}
                            title="Download Claim"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2m-6-4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-medium mb-4">Confirm Payment</h3>
            <p className="mb-6">Are you sure you want to mark this claim as paid? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 transition-colors text-white"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded bg-green-600 hover:bg-green-700 transition-colors text-white"
                onClick={handleConfirmPayment}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

   
      {selectedClaimForInfo && (
        <Info claim={selectedClaimForInfo} onClose={handleCloseInfo} />
      )}
    </div>
  );
};

export default PaidClaimsPage;