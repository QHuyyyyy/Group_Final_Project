import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, Space, Popconfirm } from "antd";
import { claimService } from "../../services/claimService";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import { EyeOutlined } from "@ant-design/icons";

interface Request {
  _id: string;
  claim_name: string;
  project_id: string;
  total_work_time: number;
  claim_status: string;
  created_at: string;
  claim_start_date: string;
  claim_end_date: string;
}

interface SearchParams {
  searchCondition: {
    keyword: string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

const { Search } = Input;

const Request = () => {
  const [claims, setClaims] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        searchCondition: {
          keyword: searchText || "",
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize
        }
      };

      const response = await claimService.searchClaims(params);
      console.log('Search response:', response);
      
      if (response && response.pageData) {
        setClaims(response.pageData);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0
        }));
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      message.error('An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleView = (record: Request) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  const handleEdit = (record: Request) => {
    // TODO: Implement edit functionality
    console.log('Edit claim:', record);
  };

  const handleDelete = async (record: Request) => {
    try {
      await claimService.changeClaimStatus(record._id, 'DELETED');
      message.success('Claim deleted successfully');
      fetchClaims();
    } catch (error) {
      console.error('Error deleting claim:', error);
      message.error('Failed to delete claim');
    }
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
          <Button type="primary" onClick={() => console.log('Add new claim')}>
            Add New Claim
          </Button>
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Claims</h1>
          </div>
          <Table
            loading={loading}
            dataSource={claims}
            columns={[
              {
                title: "No.",
                key: "index",
                render: (_, __, index) => index + 1,
                width: 50,
              },
              {
                title: "Claim Name",
                dataIndex: "claim_name",
                key: "claim_name",
                width: 120,
              },
              {
                title: "Created At",
                dataIndex: "created_at",
                key: "created_at",
                width: 120,
                render: (date: string) => dayjs(date).format('YYYY-MM-DD')
              },
              {
                title: "Total Hours",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: 100,
                render: (minutes: number) => {
                  if (!minutes && minutes !== 0) return '-';
                  
                  const hours = minutes / 60;
                  // Làm tròn đến 2 chữ số thập phân
                  const roundedHours = Math.round(hours * 100) / 100;
                  
                  return (
                    <span>
                      {roundedHours} {roundedHours <= 1 ? 'hour' : 'hours'}
                    </span>
                  );
                }
              },
              {
                title: "Status",
                dataIndex: "claim_status",
                key: "claim_status",
                width: 100,
                render: (status: string) => (
                  <Tag color={
                    !status || status === "DRAFT" ? "gold" :
                    status === "PENDING" ? "blue" :
                    status === "APPROVED" ? "green" :
                    "red"
                  }>
                    {status || "DRAFT"}
                  </Tag>
                )
              },
              {
                title: "Actions",
                key: "actions",
                width: 200,
                render: (_, record) => (
                  <Space size="middle">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleView(record)}
                      title="View"
                    />
                    {record.claim_status === "DRAFT" && (
                      <>
                        <Button type="link" onClick={() => handleEdit(record)}>
                          Edit
                        </Button>
                        <Popconfirm
                          title="Are you sure you want to delete this claim?"
                          onConfirm={() => handleDelete(record)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  </Space>
                )
              }
            ]}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10
                }));
              },
            }}
            className="overflow-hidden w-full"
            scroll={{ x: true }}
          />
        </Card>
        
        <RequestDetails
          visible={isModalVisible}
          request={selectedRequest}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Request;
