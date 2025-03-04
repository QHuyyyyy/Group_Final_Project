import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, Space } from "antd";
import { claimService } from "../../services/claimService";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import { EyeOutlined } from "@ant-design/icons";

interface Claim {
  _id: string;
    staff_id: string;
    staff_name: string;
    staff_email: string;
    staff_role: string;
    role_in_project: string;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    total_work_time: number;
    claim_status: string;
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
  const [selectedRequest, setSelectedRequest] = useState<ClaimById |undefined>(undefined);
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
      
  
      };

      const response = await claimService.searchClaims(params);
      console.log('Search response:', response);
      
      if (response && response.data && response.data.pageData) {
        setClaims(response.data.pageData);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo.totalItems || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      message.error('An error occurred while fetching claims.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotal_Hours = async (claimId: string) => {
    try {
      const response = await claimService.getClaimById(claimId);
      console.log('Total hours response:', response);
      if (response && response.data && response.data.total_work_time) {
        setTotalHoursMap(prev => ({
          ...prev,
          [claimId]: response.data.total_work_time
        }));
      }
    } catch (error) {
      console.error('Error fetching total hours:', error);
    }
  };


  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleView = async (record: Claim) => {
    try {
      const response = await claimService.getClaimById(record._id);
      if (response && response.data) {
        setSelectedRequest(response.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to fetch claim details');
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(undefined);
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
                width: 60,
                align: 'center'
              },
              {
                title: "Staff Name",
                dataIndex: ["staff_name", "staff_email"],
                key: "staff_name",
                width: 120,
                render: (_, record) => record.staff_name
              },
              {
                title: "Project Name",
                dataIndex: ["project_info", "project_name"],
                key: "project_name",
                width: 150,
                render: (_, record) => record.project_info?.project_name || '-'
              },
              {
                title: "Project Duration",
                dataIndex: "duration",
                key: "duration",
                width: 180,
                align: 'center',
                render: (_, record) => (
                  <span>
                    {dayjs(record.claim_start_date).format('YYYY-MM-DD')} 
                    {' - '} 
                    {dayjs(record.claim_end_date).format('YYYY-MM-DD')}
                  </span>
                ),
                sorter: (a, b) => {
                  const dateA = new Date(a.claim_start_date).getTime();
                  const dateB = new Date(b.claim_start_date).getTime();
                  return dateA - dateB;
                },
                defaultSortOrder: 'descend'
              },
              {
                title: "Total Hours",
                dataIndex: "total_work_time",
                key: "total_work_time",
                width: 100,
                align: 'center',
                render: (_, record) => {
                  const hours = totalHoursMap[record._id];
                  return hours !== undefined ? `${hours}h` : '-';
                }
              },
              {
                title: "Status",
                dataIndex: "claim_status",
                key: "claim_status",
                width: 120,
                align: 'center',
                render: (status: string) => (
                  <Tag color={
                    !status || status === "Draft" ? "gold" :
                    status === "Pending Approval" ? "blue" :
                    status === "Approved" ? "green" :
                    "red"
                  }>
                    {status || "Draft"}
                  </Tag>
                )
              },
              {
                title: "Actions",
                key: "actions",
                width: 100,
                align: 'center',
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
          claim={selectedRequest }
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Claim;
