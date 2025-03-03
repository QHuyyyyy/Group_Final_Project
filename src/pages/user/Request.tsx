import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, Space } from "antd";
import { claimService } from "../../services/claimService";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import { EyeOutlined } from "@ant-design/icons";

interface Claim {
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
  sortInfo: {
    field: string;
    order: string;
  };
}

const { Search } = Input;

const Claim = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedRequest, setSelectedRequest] = useState<Claim | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalHoursMap, setTotalHoursMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchClaims();
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    if (claims.length > 0) {
      claims.forEach(claim => {
        fetchTotal_Hours(claim._id);
      });
    }
  }, [claims]);

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
        },
        sortInfo: {
          field: "created_at",
          order: "desc"
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

  const fetchTotal_Hours = async (claimId: string) => {
    try {
      const response = await claimService.getClaimById(claimId);
      console.log('Total hours response:', response);
      
      if (response && response.total_work_time) {
        setTotalHoursMap(prev => ({
          ...prev,
          [claimId]: response.total_work_time
        }));
      }
    } catch (error) {
      console.error('Error fetching total hours:', error);
      message.error('An error occurred while fetching total hours.');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleView = (record: Claim) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  

  const formatWorkTime = (hours: number) => { 
    if (!hours && hours !== 0) return '-';
    return `${hours}h`;
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
                render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
                sorter: (a, b) => {
                  const dateA = new Date(a.created_at).getTime();
                  const dateB = new Date(b.created_at).getTime();
                  return dateA - dateB;
                },
                defaultSortOrder: 'descend'
              },
              {
                title: "Total Hours",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: 100,
                render: (_, record) => formatWorkTime(totalHoursMap[record._id] || 0)
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
          claim={selectedRequest}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Claim;
