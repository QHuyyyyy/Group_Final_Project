import { useEffect, useState, useCallback } from "react";
import { Table, Tag, Space, Button, Modal, Card, Input, message } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import { claimService } from "../../services/claim.service";
import type { Claim, SearchParams } from "../../models/ClaimModel";
import { debounce } from "lodash";
import dayjs from 'dayjs';

const { Search } = Input;

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

function ApprovalPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [confirmationType, setConfirmationType] = useState<"Approved" | "Rejected" | "Returned" | null>(null);

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

      const response = await claimService.searchClaimsForApproval(params);

      if (response && response.data && response.data.pageData) {
        const claimsData = response.data.pageData;
        setClaims(claimsData);
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

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const filterClaims = (query: string, status: string) => {
    let filtered = claims;
    if (query) {
      filtered = filtered.filter(claim =>
        claim.claim_name.toLowerCase().includes(query.toLowerCase()) ||
        claim.staff_name.toLowerCase().includes(query.toLowerCase()) ||
        claim.staff_id.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(claim => claim.claim_status === status);
    }

    return filtered;
  };

  const handleSearch = useCallback(debounce((query: string) => {
    setSearchText(query);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  }, 500), []);

  const filteredClaims = filterClaims(searchText, "");

  const handleApprove = (id: string) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim._id === id ? { ...claim, status: "Approved" } : claim
      )
    );
  };

  const handleReject = (id: string) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim._id === id ? { ...claim, status: "Rejected" } : claim
      )
    );
  };

  const handleReturn = (id: string) => {
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim._id === id ? { ...claim, claim_status: "Returned" } : claim
      )
    );
  };

  const showConfirmation = (claim: Claim, type: "Approved" | "Rejected" | "Returned") => {
    setSelectedClaim(claim);
    setConfirmationType(type);
  };

  const handleConfirmationOk = () => {
    if (!selectedClaim || !confirmationType) return;

    switch (confirmationType) {
      case "Approved":
        handleApprove(selectedClaim._id);
        break;
      case "Rejected":
        handleReject(selectedClaim._id);
        break;
      case "Returned":
        handleReturn(selectedClaim._id);
        break;
    }

    setSelectedClaim(null);
    setConfirmationType(null);
  };

  const handleConfirmationCancel = () => {
    setSelectedClaim(null);
    setConfirmationType(null);
  };

  return (
    <div className="overflow-x-auto">
      <Card className="shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Claim Approvals</h1>
        </div>

        <div className="overflow-auto custom-scrollbar">
          <div className="flex flex-wrap gap-4 items-center mb-5 mx-2">
            <Search
              placeholder="Search by Employee or Request ID"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredClaims}
            loading={loading}
            columns={[
              {
                title: "Staff name",
                dataIndex: "staff_name",
                key: "staff_name",
                width: "15%",
              },
              {
                title: "Role in project",
                dataIndex: "role_in_project",
                key: "role_in_project",
                width: "10%",
              },
              {
                title: "Claim name",
                dataIndex: "claim_name",
                key: "claim_name",
                width: "10%",
              },
              {
                title: "Date",
                key: "time",
                width: "15%",
                align: 'center',
                render: (_, record) => (
                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">From:</span>
                      {dayjs(record.claim_start_date).format('DD/MM/YYYY HH:mm')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">To:</span>
                      {dayjs(record.claim_end_date).format('DD/MM/YYYY HH:mm')}
                    </div>
                  </div>
                ),
              },
              {
                title: "End date",
                key: "time",
                width: "15%",
                render: (_, record) => (
                  <div>
                    <div className="text-sm">{dayjs(record.claim_end_date).format('HH:mm:ss')}</div>
                    <div className="text-xs text-gray-500">{dayjs(record.claim_end_date).format('DD/MM/YYYY')}</div>
                  </div>
                ),              },
              {
                title: <span className="font-bold">Reason</span>,
                dataIndex: "claim_name",
                key: "claim_name",
                width: "20%",
              },
              {
                title: <span className="font-bold">Status</span>,
                key: "status",
                width: "10%",
                render: (_, record) => (
                  <Tag
                    color={
                      record.claim_status === "Approved"
                        ? "success"
                        : record.claim_status === "Rejected"
                          ? "error"
                          : "warning"
                    }
                  >
                    {record.claim_status}
                  </Tag>
                ),
              },
              {
                title: <span className="font-bold">Actions</span>,
                key: "actions",
                width: "15%",
                render: (_, record) => {
                  if (record.claim_status === "Pending") {
                    return (
                      <Space>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => showConfirmation(record, "Approved")}
                          style={{ backgroundColor: '#52c41a' }}
                          className="hover:!bg-[#52c41a]"
                        />
                        <Button
                          type="primary"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => showConfirmation(record, "Rejected")}
                        />
                        <Button
                          type="primary"
                          icon={<UndoOutlined />}
                          onClick={() => showConfirmation(record, "Returned")}
                          style={{ backgroundColor: '#faad14' }}
                          className="hover:!bg-[#ffeb29]"
                        />
                      </Space>
                    );
                  }

                  return <span className="text-gray-500">Processed</span>;
                },
              },
            ]}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} transactions`,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>

      <Modal
        title="Confirmation"
        open={!!selectedClaim}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        {confirmationType === "Approved" && (
          <p>Are you sure you want to <b>approve</b> this claim?</p>
        )}
        {confirmationType === "Rejected" && (
          <p>Are you sure you want to <b>reject</b> this claim?</p>
        )}
        {confirmationType === "Returned" && (
          <p>Are you sure you want to <b>return</b> this claim?</p>
        )}
      </Modal>
    </div>
  );
}

export default ApprovalPage;