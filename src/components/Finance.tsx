import { useState } from "react";
import Info from "./Info";

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

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedClaimForInfo, setSelectedClaimForInfo] = useState<Claim | null>(null);
  
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

    const updatedClaims = claims.map((claim) =>
      claim.id === selectedClaim.id
        ? {
            ...claim,
            status: "Paid",
            auditTrail: [...claim.auditTrail, `Paid by ${approverName} on ${currentDateTime}`]
          }
        : claim
    );

    setClaims(updatedClaims);
    setShowConfirmDialog(false);
    setSelectedClaim(null);
    console.log("Claim marked as paid:", updatedClaims);
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
      Audit Trail: ${claim.auditTrail.join(", ")}
    `;

    const blob = new Blob([claimData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim_${claim.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-x-auto">
      <div className="overflow-x-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Paid Claims</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search claims..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-gray-200">
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
                  <td colSpan={8} className="text-center py-4 text-gray-400">
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
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          claim.status === "Approved"
                            ? "bg-yellow-300 text-yellow-800"
                            : "bg-green-300 text-green-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            claim.status === "Paid"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white`}
                          onClick={claim.status === "Paid" ? () => handleViewClaim(claim) : () => handleMarkAsPaid(claim)}
                        >
                          {claim.status === "Paid" ? "View" : "Pay"}
                        </button>
                        {claim.status === "Paid" && (
                          <button
                            className="px-3 py-1 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-white"
                            onClick={() => handleDownloadClaim(claim)}
                            title="Download Claim"
                          >
                            ⬇️
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
              <button className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
              <button className="px-4 py-2 text-sm rounded bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirmPayment}>OK</button>
            </div>
          </div>
        </div>
      )}

      {selectedClaimForInfo && <Info claim={selectedClaimForInfo} onClose={handleCloseInfo} />}
    </div>
  );
};

export default Finance;
