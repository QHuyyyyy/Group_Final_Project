import { Card,  Badge, Statistic, Row, Col, Avatar } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
} from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';

import { employeeService } from '../../services/employee.service';
import { useEffect, useState } from 'react';
import { Employee } from '../../models/EmployeeModel';
import { claimService } from '../../services/claim.service';
import { SearchResponse } from '../../models/ClaimModel';

const UserProfile = () => {
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [claimsData, setClaimsData] = useState<SearchResponse | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await employeeService.getEmployeeById(user.id);
        setEmployeeData(response.data);
      } catch (error) {
        }
    };

    if (user.id) {
      fetchEmployeeData();
    }
  }, [user.id]);  

  useEffect(() => {
    const fetchClaimsData = async () => {
      try {
        const response = await claimService.searchClaimsByClaimer({
          searchCondition: {
            keyword: "",
            claim_status: "",
            claim_start_date: "",
            claim_end_date: "",
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100
          }
        });
        setClaimsData(response.data);
      } catch (error) {
        console.error('Error fetching claims data:', error);
      }
    };

    if (user.id) {
      fetchClaimsData();
    }
  }, [user.id]);

  // Update the role name display to use proper mapping
  const getRoleDisplayName = (roleCode: string) => {
    switch (roleCode) {
      case 'A002':
        return 'Finance';
      case 'A003':
        return 'BUL, PM';
      case 'A004':
        return 'All Members';
      default:
        return roleCode;
    }
  };

  // Format date helper function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format salary with commas
  const formatSalary = (salary: number | undefined) => {
    if (!salary) return 'N/A';
    return salary.toLocaleString() + ' VND';
  };

  const getClaimStats = () => {
    if (!claimsData?.pageData) return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      paid: 0,
      draft: 0,
      canceled: 0
    };
    
    return {
      total: claimsData.pageData.length,
      pending: claimsData.pageData.filter(claim => claim.claim_status === 'Pending Approval').length,
      approved: claimsData.pageData.filter(claim => claim.claim_status === 'Approved').length,
      rejected: claimsData.pageData.filter(claim => claim.claim_status === 'Rejected').length,
      paid: claimsData.pageData.filter(claim => claim.claim_status === 'Paid').length,
      draft: claimsData.pageData.filter(claim => claim.claim_status === 'Draft').length,
      canceled: claimsData.pageData.filter(claim => claim.claim_status === 'Canceled').length
    };
  };

  const stats = getClaimStats();

  const statisticsCardContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <Statistic 
          title={<span className="text-gray-600 font-medium">Total Requests</span>}
          value={stats.total}
          prefix={<FileTextOutlined className="text-blue-500" />}
          className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-gray-800"
        />
      </Card>

      <Card className="rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <Statistic 
          title={<span className="text-gray-600 font-medium">Pending Requests</span>}
          value={stats.pending}
          prefix={<ClockCircleOutlined className="text-amber-500" />}
          className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-gray-800"
        />
      </Card>
    </div>
  );

  const requestSummaryContent = (
    <div className="space-y-3">
      {[
        { key: 'Total', value: stats.total },
        { key: 'Pending', value: stats.pending },
        { key: 'Approved', value: stats.approved },
        { key: 'Rejected', value: stats.rejected },
        { key: 'Paid', value: stats.paid },
        { key: 'Draft', value: stats.draft },
        { key: 'Canceled', value: stats.canceled }
      ].map(({ key, value }) => (
        <div key={key} 
             className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
          <span className="capitalize text-gray-700 font-medium">
            {key} Requests
          </span>
          <Badge 
            count={value} 
            className={`px-4 py-1 rounded-full ${
              key === 'Pending' ? 'bg-amber-500' :
              key === 'Approved' ? 'bg-emerald-500' :
              key === 'Rejected' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
          />
        </div>
      ))}
    </div>
  );

  const handleViewAll = () => {
    setShowSummary(!showSummary);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
          <div className="w-[82%] md:w-[90%] lg:w-[82%] xl:w-[82%] flex-1 bg-[#F7F8FA]">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-6xl mx-auto space-y-8 p-8">
                <Row gutter={[24, 24]}>
                  {/* Personal Information */}
                  <Col xs={24} md={8}>
                    <Card className="shadow-lg rounded-2xl overflow-hidden border-0">
                      <div className="text-center mb-8">
                        <div className="relative inline-block">
                          <Avatar 
                            size={130} 
                            src={employeeData?.avatar_url}
                            icon={!employeeData?.avatar_url && <UserOutlined />} 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl"
                          />
                        </div>
                        <h2 className="text-2xl font-bold mt-4 mb-1 text-gray-800">{employeeData?.full_name || user.user_name}</h2>
                        <p className="text-gray-500 font-medium">{employeeData?.job_rank || 'Employee'}</p>
                        <Badge 
                          status="processing" 
                          text={getRoleDisplayName(user.role_code)}
                          className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full" 
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Email:</span>
                          <span className="text-gray-800 font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Phone:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Department:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.department_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Job Rank:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.job_rank || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Address:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.address || 'N/A'}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Start Date:</span>
                          <span className="text-gray-800 font-medium">{formatDate(employeeData?.start_date)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">End Date:</span>
                          <span className="text-gray-800 font-medium">{formatDate(employeeData?.end_date)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Salary:</span>
                          <span className="text-gray-800 font-medium">{formatSalary(employeeData?.salary)}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 w-24">Contract:</span>
                          <span className="text-gray-800 font-medium">{employeeData?.contract_type || 'N/A'}</span>
                        </div>
                      </div>

              
                    </Card>
                  </Col>

                  {/* Right Column - Stats & Activities */}
                  <Col xs={24} md={16}>
                    <div className="space-y-6">
                      {/* Statistics Cards */}
                      {statisticsCardContent}

                      {/* Requests Summary */}
                      <Card 
                        title={<span className="text-xl font-bold">Request Summary</span>}
                        className="rounded-xl border-0 shadow-md"
                        extra={
                          <button 
                            onClick={handleViewAll}
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {showSummary ? 'Hide Details' : 'View All'}
                          </button>
                        }
                      >
                        {showSummary && requestSummaryContent}
                      </Card>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
    </div>
  );
};

export default UserProfile;