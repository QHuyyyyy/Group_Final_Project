import { useState, useEffect } from "react";
import { Input, Button, Card, Table, Tag, Space } from "antd";
import { EditOutlined, EyeOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import RequestDetails from "../../components/user/RequestDetails";
import UpdateRequest from "../../components/user/UpdateRequest";
import CreateRequest from "../../pages/user/CreateRequest"
import SendRequest from "../../components/user/SendRequest";
// import ReturnRequest from "../../components/user/ReturnRequest";
import CancelRequest from "../../components/user/CancelRequest";
import { claimService } from "../../services/claimService";

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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState(initialRequests);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateRequest, setUpdateRequest] = useState<Request | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [sendRequestId, setSendRequestId] = useState<number | null>(null);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [requests, setRequests] = useState([])
  // const [returnRequestId, setReturnRequestId] = useState<number | null>(null);
  // const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);

  // New state for CancelRequest modal
  const [cancelRequestId, setCancelRequestId] = useState<number | null>(null);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  useEffect(() => {
    const fetchClaims = async () => {
          try {
            const params = {
              searchCondition: {
                keyword: "",
                claim_start_date: "",
                claim_end_date: "",
                is_deleted: false,
              },
              pageInfo: {
                pageNum: 1,
                pageSize: 10,
              },
            };
            const data = await claimService.searchClaims(params);
            setRequests(data.pageData);      
          } catch (error) {
            console.error("Error fetching claims:", error);
          }
        };
        fetchClaims();
  })

  console.log(requests)
  ////////////////////////////////////////////////////////////////////////////
  const handleSearch = (value: string) => {
    const filteredData = initialRequests.filter((req) =>
      req.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRequests(filteredData);
  };

  const showUpdateModal = (request: Request) => {
    setUpdateRequest(request);
    setIsUpdateModalVisible(true);
  };

  const showDetailModal = (request: any) => {
    setSelectedRequest(request);
    setIsDetailModalVisible(true);
  };

  const showSendModal = (id: number) => {
    setSendRequestId(id);
    setIsSendModalVisible(true);
  };

  const handleSendRequest = (id: number) => {
    setFilteredRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: "Pending Approval" } : req
      )
    );
    setIsSendModalVisible(false);
    setSendRequestId(null);
  };

  // const showReturnModal = (id: number) => {
  //   setReturnRequestId(id);
  //   setIsReturnModalVisible(true);
  // };
  // const handleReturnRequest = (id: number) => {
  //   setFilteredRequests(prevRequests =>
  //     prevRequests.map(req =>
  //       req.id === id ? { ...req, status: "Draft" } : req
  //     )
  //   );
  //   setIsReturnModalVisible(false);
  //   setReturnRequestId(null);
  // };

  // Show CancelRequest modal
  const showCancelModal = (id: number) => {
    setCancelRequestId(id);
    setIsCancelModalVisible(true);
  };

  const handleCancelRequest = (id: number) => {
    setFilteredRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: "Cancelled" } : req
      )
    );
    setIsCancelModalVisible(false);
    setCancelRequestId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <Search
            placeholder="Search by Employee Name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            className="ml-0"
          />
          <Button
            onClick={() => setIsCreateModalVisible(true)}
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Request
          </Button>
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Requests</h1>
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table
              dataSource={filteredRequests}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  width: 80
                },
                {
                  title: "Create Date",
                  dataIndex: "createdDate",
                  key: "createdDate",
                  width: 120
                },
                {
                  title: "Project",
                  dataIndex: "project",
                  key: "project",
                  width: 150
                },
                {
                  title: "Total Hours Worked",
                  dataIndex: "totalHours",
                  key: "totalHours",
                  width: 150
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 150,
                  render: (status: string) => (
                    <Tag color={
                      status === "Draft" ? "gold" :
                        status === "Pending Approval" ? "blue" :
                          status === "Approved" ? "green" :
                            "red"
                    }>
                      {status}
                    </Tag>
                  )
                },
                {
                  title: "Actions",
                  key: "actions",
                  fixed: "right" as const,
                  width: 150,
                  render: (_: any, record: any) => (
                    <Space size="middle">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => showDetailModal(record)}
                        className="text-blue-600 hover:text-blue-800"
                      />
                      {record.status === "Draft" && (
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => showUpdateModal(record)}
                          className="text-gray-600 hover:text-gray-800"

                        />
                      )}
                      {record.status === "Draft" && (
                        <Button
                          type="text"
                          icon={<CloudUploadOutlined />}
                          onClick={() => showSendModal(record.id)}
                          className="text-green-600 hover:text-green-800"
                        />
                      )}
                      {/* {record.status === "Pending Approval" && (
                        <Button
                          type="text"
                          icon={<ReloadOutlined />}
                          onClick={() => showReturnModal(record.id)}
                          className="text-orange-600 hover:text-orange-800"
                        />
                      )} */}
                      {(record.status === "Draft" || record.status === "Pending Approval") && (
                        <Button
                          type="text"
                          icon={<CloseCircleOutlined />}
                          onClick={() => showCancelModal(record.id)}
                          className="text-red-600 hover:text-red-800"
                        />
                      )}
                    </Space>
                  )
                }
              ]}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: filteredRequests.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="overflow-hidden w-full"
              scroll={{ x: true }}
            />
          </div>
        </Card>

        <CreateRequest
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
        />

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

        <SendRequest
          id={sendRequestId}
          visible={isSendModalVisible}
          onSend={handleSendRequest}
          onCancel={() => setIsSendModalVisible(false)}
        />

        {/* <ReturnRequest
          id={returnRequestId}
          visible={isReturnModalVisible}
          onReturn={handleReturnRequest}
          onCancel={() => setIsReturnModalVisible(false)}
        /> */}

        {/* CancelRequest modal */}
        <CancelRequest
          id={cancelRequestId}
          status="Draft" // or "Pending Approval" based on your state
          visible={isCancelModalVisible}
          onCancelRequest={handleCancelRequest}
          onClose={() => setIsCancelModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default Request;
