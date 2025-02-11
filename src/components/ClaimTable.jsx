function ClaimTable({ claims, onApprove, onReject }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại tăng ca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số giờ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lý do</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{claim.submittedBy}</div>
                      <div className="text-sm text-gray-500">{claim.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{claim.employeeId}</td>
                <td className="px-6 py-4">{claim.overtimeType}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{claim.startTime} - {claim.endTime}</div>
                  <div className="text-sm text-gray-500">{claim.submittedDate}</div>
                </td>
                <td className="px-6 py-4">
                  {claim.amount.toFixed(1)}h
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{claim.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${claim.status === 'Đã duyệt' ? 'bg-green-100 text-green-800' :
                      claim.status === 'Từ chối' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {claim.status === 'Chờ được duyệt' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onApprove(claim.id)}
                        className="px-3 py-2 text-white bg-green-500 rounded-lg
                        hover:bg-green-600 focus:ring-4 focus:ring-green-300 focus:outline-none
                        transition-all shadow-sm hover:shadow-md
                        active:transform"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
  
                      <button
                        onClick={() => onReject(claim.id)}
                        className="px-3 py-2 text-white bg-red-500 rounded-lg
                        hover:bg-red-600 focus:ring-4 focus:ring-red-300 focus:outline-none
                        transition-all shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default ClaimTable