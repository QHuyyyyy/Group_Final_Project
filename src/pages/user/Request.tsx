import { useState, useEffect } from "react";
import { Input, Card, Table, Tag, message, Button, Space } from "antd";
import { claimService } from "../../services/claim.service";
import dayjs from 'dayjs';
import RequestDetails from "../../components/user/RequestDetails";
import { EyeOutlined } from "@ant-design/icons";
import type { Claim, ClaimById, SearchParams } from "../../models/ClaimModel";
import CreateRequest from "./CreateRequest";

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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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
        },
      };

      const response = await claimService.searchClaimsByClaimer(params);
      
      if (response && response.data && response.data.pageData) {
        const claimsData = response.data.pageData;
        setClaims(claimsData);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo.totalItems || 0
        }));

        // Fetch total hours in one batch
        const hoursMap: Record<string, number> = {};
        await Promise.all(
          claimsData.map(async (claim) => {
            try {
              const response = await claimService.getClaimById(claim._id);
              if (response?.data?.total_work_time) {
                hoursMap[claim._id] = response.data.total_work_time;
              }
            } catch (error) {
              console.error(`Error fetching hours for claim ${claim._id}:`, error);
            }
          })
        );
        setTotalHoursMap(hoursMap);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      message.error('An error occurred while fetching claims.');
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

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    fetchClaims();
    message.success('Claim created successfully');
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
          <Button 
            type="primary" 
            onClick={handleOpenCreateModal}
          >
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
                align: 'center',
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
                width: 180,
                render: (_, record) => record.project_info?.project_name || '-'
              },
              {
                title: "Project Duration",
                dataIndex: "duration",
                key: "duration",
                width: 200,
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
                render: (_, record) => formatWorkTime(totalHoursMap[record._id])
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
          claim={selectedRequest}
          projectInfo={{
            project_name: claims.find(c => c._id === selectedRequest?._id)?.project_info?.project_name || '',
            project_comment: claims.find(c => c._id === selectedRequest?._id)?.project_info?.project_comment
          }}
          onClose={handleCloseModal}
        />
        <CreateRequest
          visible={isCreateModalVisible}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default Claim;
