import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "antd";



import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import DeleteRequest from "../../components/user/DeleteRequest";
import RequestDetails from "../../components/user/RequestDetails";
import UpdateRequest from "../../components/user/UpdateRequest";


interface Request {
  id: number;
  name: string;
  project: string;
  totalHours: number;
  status: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  description: string;
}

const { Search } = Input;

const initialRequests = [
  {
    id: 1,
    name: "John Doe",
    project: "Project A",
    totalHours: 40,
    status: "Draft",
    createdDate: "2025-02-10",
    startDate: "2025-02-01",
    endDate: "2025-02-05",
    description: "Worked on the initial phase of Project A",
  },
  {
    id: 2,
    name: "Jane Smith",
    project: "Project B",
    totalHours: 35,
    status: "Pending Approval",
    createdDate: "2025-02-08",
    startDate: "2025-02-02",
    endDate: "2025-02-07",
    description: "Assisted in completing the final deliverables",
  },
];

const Request = () => {
  const [filteredRequests, setFilteredRequests] = useState(initialRequests);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateRequest, setUpdateRequest] = useState<Request | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  ////////////////////////////////////////////////////////////////////////////
  const handleSearch = (value: string) => {
    const filteredData = initialRequests.filter((req) =>
      req.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRequests(filteredData);
  };

  const showDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      setFilteredRequests(filteredRequests.filter((req) => req.id !== deleteId));
    }
    setIsDeleteModalVisible(false);
    setDeleteId(null);
  };

  const showUpdateModal = (request: Request) => {
    setUpdateRequest(request);
    setIsUpdateModalVisible(true);
  };

  const showDetailModal = (request: any) => {
    setSelectedRequest(request);
    setIsDetailModalVisible(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-4">My Requests</h2>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/userdashboard/create-request">
          <button className="px-4 py-2 bg-orange-300 hover:bg-gray-400 text-white rounded-md">
            Create Request
          </button>
        </Link>
        <Search
          placeholder="Search by Employee Name"
          allowClear
          onSearch={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="py-3 px-4 font-medium">ID</th>
              <th className="py-3 px-4 font-medium">Employee Name</th>
              <th className="py-3 px-4 font-medium">Project</th>
              <th className="py-3 px-4 font-medium">Total Hours Worked</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">{request.id}</td>
                  <td className="py-4 px-4">{request.name}</td>
                  <td className="py-4 px-4">{request.project}</td>
                  <td className="py-4 px-4">{request.totalHours}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${request.status === "Draft"
                        ? "bg-yellow-300 text-yellow-800"
                        : request.status === "Pending Approval"
                          ? "bg-blue-300 text-blue-800"
                          : "bg-green-300 text-green-800"
                        }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex gap-2">
                    <button onClick={() => showDetailModal(request)}>
                      <EyeOutlined />
                    </button>
                    <button onClick={() => showUpdateModal(request)}>
                      <EditOutlined />
                    </button>
                    <button onClick={() => showDeleteModal(request.id)}>
                      <DeleteOutlined />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteRequest
        id={deleteId}
        visible={isDeleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />

      {/* Request Details Modal */}
      <RequestDetails
        visible={isDetailModalVisible}
        request={selectedRequest}
        onClose={() => setIsDetailModalVisible(false)}
      />

      {isUpdateModalVisible && updateRequest && (
        <UpdateRequest
          visible={isUpdateModalVisible}
          request={updateRequest}
          onClose={() => setIsUpdateModalVisible(false)}
        />
      )}

    </div>
  );
};

export default Request;