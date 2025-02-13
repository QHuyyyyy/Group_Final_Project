import React from 'react';

interface InfoProps {
  claim: {
    id: string;
    staffName: string;
    projectName: string;
    duration: string;
    totalHours: number;
    amount: number;
    status: string;
    auditTrail: string[];
  } | null;
  onClose: () => void;
}

const Info: React.FC<InfoProps> = ({ claim, onClose }) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-2xl font-semibold mb-4">Claim Details</h3>
        <p><strong>Claim ID:</strong> {claim.id}</p>
        <p><strong>Staff Name:</strong> {claim.staffName}</p>
        <p><strong>Project:</strong> {claim.projectName}</p>
        <p><strong>Duration:</strong> {claim.duration}</p>
        <p><strong>Total Hours:</strong> {claim.totalHours}</p>
        <p><strong>Amount:</strong> ${claim.amount}</p>
        <p><strong>Status:</strong> {claim.status}</p>
        <p><strong>Audit Trail:</strong></p>
        <ul className="list-disc pl-5">
          {claim.auditTrail.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 text-sm font-semibold rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;