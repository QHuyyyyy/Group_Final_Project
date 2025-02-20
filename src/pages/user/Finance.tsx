import { useState } from "react";
import { DollarOutlined, EyeOutlined, DownloadOutlined,FileExcelOutlined } from '@ant-design/icons';
import { Modal, Descriptions } from 'antd';
import { exportToExcel } from '../../utils/xlsxUtils';


interface Claim {
  id: string;
  staffName: string;
  projectName: string;
  from: string;
  to: string;
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
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-001",
      staffName: "John Smith",
      projectName: "Project Alpha",
      from: "2024-01-01",
      to: "2024-04-01",
      totalHours: 45,
      amount: 2250,
      status: "Approved",
      auditTrail: []
    },
    {
      id: "CLM-002",
      staffName: "Jane Doe", 
      projectName: "Project Beta",
      from: "2024-01-15",
      to: "2024-03-15",
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
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedClaimForInfo(null);
  };

  const handleDownloadClaim = (claim: Claim) => {
    const claimData = [
        {
            "Claim ID": claim.id,
            "Staff Name": claim.staffName,
            "Project": claim.projectName,
            "From": claim.from,
            "To": claim.to,
            "Total Hours": claim.totalHours,
            "Amount": claim.amount,
            "Status": claim.status,
            "Audit Trail": claim.auditTrail.join(", ")
        }
    ];

    exportToExcel(claimData, `Claim_${claim.id}`,  `${claim.id}`);
  };

  const handleDownloadAllClaims = () => {
    const allClaimsData = claims.map(claim => ({
        "Claim ID": claim.id,
        "Staff Name": claim.staffName,
        "Project": claim.projectName,
        "From": claim.from,
        "To": claim.to,
        "Total Hours": claim.totalHours,
        "Amount": claim.amount,
        "Status": claim.status,
        "Audit Trail": claim.auditTrail.join(", ")
    }));

    exportToExcel(allClaimsData, 'ListClaims', 'List Claims');
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = statusFilter ? claim.status === statusFilter : true;
    const matchesSearchTerm = claim.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearchTerm;
  });

  return (
    <div className="overflow-x-auto bg-white">
      <div className="overflow-x-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Paid Claims</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
        <div className="relative w-72 mr-2">
            <input
              type="text"
              placeholder="Search claims..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
          <label htmlFor="statusFilter" className="mr-2">Status:</label>
            <select
              id="statusFilter"
              className="ml-4 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
         
          </div>
           
          <button
            type="button"
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={handleDownloadAllClaims}
            title="Download All Claims"
            aria-label="Download All Claims"
          >
             <span className="text-white mr-1">Download</span>
            <FileExcelOutlined style={{ color: 'white', marginRight: '8px' }} />
           
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="py-3 px-4 font-medium">Claim ID</th>
                <th className="py-3 px-4 font-medium">Staff Name</th>
                <th className="py-3 px-4 font-medium">Project</th>
                <th className="py-3 px-4 font-medium">Total Hours</th>
                <th className="py-3 px-4 font-medium">Amount ($)</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">
                    No claims found
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">{claim.id}</td>
                    <td className="py-4 px-4">{claim.staffName}</td>
                    <td className="py-4 px-4">{claim.projectName}</td>
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
                          type="button"
                          className="px-4 py-2 text-sm bg-transparent text-black hover:bg-gray-200 transition-colors rounded-md"
                          onClick={() => handleViewClaim(claim)}
                          title="View Claim"
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-sm bg-transparent text-black hover:bg-blue-200 transition-colors rounded-md"
                          onClick={() => handleDownloadClaim(claim)}
                          title="Download Claim"
                          aria-label="Download Claim"
                        >
                          <DownloadOutlined style={{ color: 'blue' }} />
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm bg-transparent text-black transition-colors rounded-md ${claim.status === "Paid" ? 'hover:bg-gray-200' : 'hover:bg-green-200'}`}
                          onClick={claim.status === "Paid" ? undefined : () => handleMarkAsPaid(claim)}
                          aria-label={claim.status === "Paid" ? "Claim already paid" : "Mark as Paid"}
                          disabled={claim.status === "Paid"}
                        >
                          <DollarOutlined style={{ color: claim.status === "Paid" ? 'gray' : 'green' }} />
                        </button>
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
        <Modal
          title={<h2 className="text-2xl font-bold text-center">Confirm Payment</h2>}
          visible={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          footer={null}
          width={600}
          className="rounded-lg shadow-lg"
          style={{ zIndex: 1000, backgroundColor: '#f9f9f9' }}
        >
          <div className="flex items-center justify-center mb-4">
            <DollarOutlined style={{ color: 'green' }} className="text-5xl mr-2" />
            <p className="text-lg text-center">
              Are you sure you want to mark this claim as paid? <br />
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <button className="w-24 px-6 py-3 text-lg font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-200 shadow-md" onClick={() => setShowConfirmDialog(false)} aria-label="Cancel payment">Cancel</button>
            <button className="w-24 px-6 py-3 text-lg font-semibold rounded-lg bg-green-500 hover:bg-green-600 text-white transition duration-200 shadow-md" onClick={handleConfirmPayment} aria-label="Confirm payment">OK</button>
          </div>
        </Modal>
      )}

      <Modal
        title={<h2 className="text-2xl font-bold">Claim Details</h2>}
        visible={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={null}
        width={800}
        className="rounded-lg shadow-lg"
      >
        {selectedClaimForInfo && (
          <Descriptions bordered column={2} className="p-6 text-gray-700">
            <Descriptions.Item label="Claim ID" span={1}>{selectedClaimForInfo.id}</Descriptions.Item>
            <Descriptions.Item label="Status" span={1}>
              <span className={`px-3 py-1 text-sm rounded-full ${
                selectedClaimForInfo.status === "Approved"
                  ? "bg-yellow-300 text-yellow-800"
                  : "bg-green-300 text-green-800"
              }`}>
                {selectedClaimForInfo.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Staff Name" span={1}>{selectedClaimForInfo.staffName}</Descriptions.Item>
            <Descriptions.Item label="Project" span={1}>{selectedClaimForInfo.projectName}</Descriptions.Item>
            <Descriptions.Item label="From" span={1}>{selectedClaimForInfo.from}</Descriptions.Item>
            <Descriptions.Item label="To" span={1}>{selectedClaimForInfo.to}</Descriptions.Item>
            <Descriptions.Item label="Total Hours" span={2}>{selectedClaimForInfo.totalHours}</Descriptions.Item>
            <Descriptions.Item label="Amount" span={2}>${selectedClaimForInfo.amount}</Descriptions.Item>
            <Descriptions.Item label="Audit Trail" span={2}>{selectedClaimForInfo.auditTrail.join(", ")}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Finance;
