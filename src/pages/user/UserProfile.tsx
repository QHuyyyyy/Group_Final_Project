import { Card,  Badge, Statistic, Row, Col, Avatar } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';

import { employeeService } from '../../services/employee.service';
import { useEffect, useState } from 'react';
import { Employee } from '../../models/EmployeeModel';
import { claimService } from '../../services/claim.service';
import { SearchResponse } from '../../models/ClaimModel';
import { motion } from 'framer-motion';

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

  const handleViewAll = () => {
    setShowSummary(!showSummary);
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-50 via-blue-50 to-gray-50">
      <div className="flex-1">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10"></div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-gray-500 mt-2">Manage your personal information and settings</p>
            </motion.div>

            <Row gutter={[24, 24]} className="items-start">
              {/* Left Column - Personal Info */}
              <Col xs={24} md={8}>
                <div className="sticky top-24 space-y-6">
                  <Card 
                    className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg overflow-visible"
                  >
                    <div className="text-center relative">
                      {/* Avatar Container with animation */}
                      <div className="relative inline-block group">
                        {/* Animated rings */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 animate-pulse"></div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-30 animate-spin-slow"></div>
                        
                        {/* Online status indicator */}
                        <div className="absolute bottom-3 right-3 z-30">
                          <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                          </div>
                        </div>

                        <Avatar 
                          size={160} 
                          src={employeeData?.avatar_url}
                          icon={!employeeData?.avatar_url && <UserOutlined />} 
                          className="ring-8 ring-white shadow-2xl border-4 border-gray-100 group-hover:scale-105 transition-all duration-500 relative z-10"
                        />
                        
                        {/* Role Badge with animation */}
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20"
                        >
                          <div 
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                          >
                            {getRoleDisplayName(user.role_code)}
                          </div>
                        </motion.div>
                      </div>

                      {/* User Info with animation */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 space-y-3"
                      >
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {employeeData?.full_name || user.user_name}
                        </h2>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                      </motion.div>
                    </div>
                  </Card>

                  {/* Quick Stats Card with animation */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Claims Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center hover:from-blue-100 hover:to-purple-100 transition-all duration-300 shadow-sm hover:shadow group">
                            <p className="text-sm text-blue-600 font-medium">Total Claims</p>
                            <p className="text-lg font-bold text-blue-800 group-hover:scale-105 transition-transform">
                              {stats.total}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center hover:from-purple-100 hover:to-pink-100 transition-all duration-300 shadow-sm hover:shadow group">
                            <p className="text-sm text-purple-600 font-medium">Pending</p>
                            <p className="text-lg font-bold text-purple-800 group-hover:scale-105 transition-transform">
                              {stats.pending}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </Col>

              {/* Right Column - Employee Details with animation */}
              <Col xs={24} md={16}>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card 
                    className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg"
                    title={
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Employee Information
                        </h3>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: "Email", value: user.email, icon: <MailOutlined className="text-blue-500" /> },
                        { label: "Phone", value: employeeData?.phone, icon: <PhoneOutlined className="text-green-500" /> },
                        { label: "Department", value: employeeData?.department_code, icon: <TeamOutlined className="text-purple-500" /> },
                        { label: "Job Rank", value: employeeData?.job_rank, icon: <BankOutlined className="text-indigo-500" /> },
                        { label: "Address", value: employeeData?.address, icon: <EnvironmentOutlined className="text-red-500" /> },
                        { label: "Start Date", value: formatDate(employeeData?.start_date), icon: <CalendarOutlined className="text-orange-500" /> },
                        { label: "End Date", value: formatDate(employeeData?.end_date), icon: <CalendarOutlined className="text-yellow-500" /> },
                        { label: "Salary", value: formatSalary(employeeData?.salary), icon: <DollarOutlined className="text-emerald-500" /> },
                        { label: "Contract", value: employeeData?.contract_type, icon: <FileProtectOutlined className="text-cyan-500" /> }
                      ].map((item, index) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          key={item.label}
                          className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md p-4"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="relative flex items-center space-x-4">
                            <div className="p-3 rounded-lg bg-white shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                              <p className="text-base text-gray-900 font-semibold mt-1 group-hover:text-blue-600 transition-colors duration-300">
                                {item.value || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Claims Stats Card */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <Card 
                    className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg"
                    title={
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Claims Statistics
                        </h3>
                      </div>
                    }
                    extra={
                      <button 
                        onClick={handleViewAll}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {showSummary ? 'Hide Details' : 'View All'}
                      </button>
                    }
                  >
                    {showSummary ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600' },
                          { key: 'Pending', value: stats.pending, color: 'from-amber-500 to-amber-600' },
                          { key: 'Approved', value: stats.approved, color: 'from-emerald-500 to-emerald-600' },
                          { key: 'Rejected', value: stats.rejected, color: 'from-red-500 to-red-600' },
                          { key: 'Paid', value: stats.paid, color: 'from-green-500 to-green-600' },
                          { key: 'Draft', value: stats.draft, color: 'from-gray-500 to-gray-600' },
                          { key: 'Canceled', value: stats.canceled, color: 'from-purple-500 to-purple-600' }
                        ].map((item, index) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            key={item.key}
                            className="relative group overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md p-4"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
                                  <FileTextOutlined />
                                </div>
                                <span className="text-gray-700 font-medium">
                                  {item.key} Requests
                                </span>
                              </div>
                              <Badge 
                                count={item.value} 
                                className={`px-4 py-1 rounded-full bg-gradient-to-r ${item.color} text-white`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <Statistic 
                            title={<span className="text-blue-600 font-medium">Total Requests</span>}
                            value={stats.total}
                            prefix={<FileTextOutlined className="text-blue-500" />}
                            className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-blue-700"
                          />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <Statistic 
                            title={<span className="text-amber-600 font-medium">Pending Requests</span>}
                            value={stats.pending}
                            prefix={<ClockCircleOutlined className="text-amber-500" />}
                            className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-amber-700"
                          />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <Statistic 
                            title={<span className="text-emerald-600 font-medium">Approved Requests</span>}
                            value={stats.approved}
                            prefix={<FileTextOutlined className="text-emerald-500" />}
                            className="[&_.ant-statistic-content-value]:text-2xl [&_.ant-statistic-content-value]:font-bold [&_.ant-statistic-content-value]:text-emerald-700"
                          />
                        </motion.div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;