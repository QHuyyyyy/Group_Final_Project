import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Button, Modal, Form, Input,  Spin, Empty } from 'antd';
import {  ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../../services/project.service';
import { userService } from '../../services/user.service';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';
import {  ProjectData } from '../../models/ProjectModel';
import { getProjectColumns } from '../../components/admin/ProjectColumns';
import ProjectModal from '../../components/admin/ProjectModal';
import { departmentService } from '../../services/Department.service';
import { debounce } from 'lodash';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useFavoriteProjects } from '../../hooks/useFavoriteProjects';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); // Set default timezone to UTC+7

// Thêm interface để định nghĩa kiểu dữ liệu


const AdminProjectManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const [editTeamMembers, setEditTeamMembers] = useState<Array<{userId: string, role: string}>>([]);
  const [departments, setDepartments] = useState<Array<{
    value: string;
    label: string;
  }>>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { favoriteProjects, toggleFavorite } = useFavoriteProjects();

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusChangeInfo, setStatusChangeInfo] = useState<{
    project: ProjectData | null;
    newStatus: string;
  }>({ project: null, newStatus: '' });

  const handleSearch = debounce((value: string) => {
    setSearchText(value);
    setPagination(prev => ({
      ...prev,
      current: 1 
    }));
  }, 2000);

  const disabledStartDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    const endDate = editForm.getFieldValue('endDate') || createForm.getFieldValue('endDate');
    return (
      current < dayjs().startOf('day') || // Không cho chọn ngày trong quá khứ
      (endDate && current.isAfter(endDate)) // Không cho chọn startDate sau endDate
    );
  };

  // Hàm kiểm tra endDate
  const disabledEndDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    const startDate = editForm.getFieldValue('startDate') || createForm.getFieldValue('startDate');
    return (
      current < dayjs().startOf('day') || // Không cho chọn ngày trong quá khứ
      (startDate && current.isBefore(startDate)) // Không cho chọn endDate trước startDate
    );
  };

  // Hàm xử lý thay đổi ngày bắt đầu cho form tạo mới
  

  // Hàm xử lý thay đổi ngày bắt đầu cho form chỉnh sửa
  const handleEditStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const endDate = editForm.getFieldValue('endDate');
      if (endDate && date.isAfter(endDate)) {
        editForm.setFieldValue('endDate', null);
        toast.warning('Start date cannot be after end date');
      }
    }
    editForm.setFieldValue('startDate', date);
  };

  

  // Thêm hàm xử lý thay đổi endDate cho form chỉnh sửa
  const handleEditEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const startDate = editForm.getFieldValue('startDate');
      if (startDate && date.isBefore(startDate)) {
        toast.warning('End date cannot be before start date');
        editForm.setFieldValue('endDate', null);
      } else {
        editForm.setFieldValue('endDate', date);
      }
    }
  };

  // Thêm useEffect để fetch data khi component mount
  useEffect(() => {
    fetchProjects();
  }, [pagination.current, pagination.pageSize, searchText]); // Thêm dependencies
 //// Thêm dependencies
  useEffect(() => {
    const handleProjectAdded = () => {
      fetchProjectsByAdd (1); // Reset to first page and fetch latest data
    };
     
    window.addEventListener('projectAdded', handleProjectAdded );
    return () => {
      window.removeEventListener('projectAdded', handleProjectAdded );
    };
  }, []);

  const fetchProjectsByAdd = async (page: number) => {
    try {
      setLoading(true);

      const response = await projectService.searchProjects({
        searchCondition: {
          keyword: searchText || "",
          is_delete: false
        },
        pageInfo: {
          pageNum: page,
          pageSize: pagination.pageSize,
          totalItems: 0,
          totalPages: 0
        }
      });



      // Kiểm tra cấu trúc response và cập nhật state
      if (response && response.data) {
        setProjects(response.data.pageData || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo?.totalItems || 0,
          current: page
        }));
       
      } else {
        toast.error(' Cannot load project data');
      }
    } catch (error) {
      toast.error(' An error occurred while fetching the project data');
    } finally {
      setLoading(false);
    }
  };
  // Cập nhật lại hàm fetchProjects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      ;

      const response = await projectService.searchProjects({
        searchCondition: {
          keyword: searchText || "",
          is_delete: false
        },
        pageInfo: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          totalItems: 0,
          totalPages: 0
        }
      });



      // Kiểm tra cấu trúc response và cập nhật state
      if (response && response.data) {
        setProjects(response.data.pageData || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo?.totalItems || 0
        }));
       
      } else {
        toast.error(' Cannot load project data');
      }
    } catch (error) {
      toast.error(' An error occurred while fetching the project data');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý phân trang
  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setLoading(true);
      await projectService.deleteProject(projectToDelete);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
    
      toast.error('An error occurred while deleting the project');
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);
    }
  };

  const handleViewDetails = async (record: ProjectData) => {
    try {
      setLoading(true);
      
      // Lấy thông tin chi tiết của project bao gồm cả thông tin member
      const projectDetail = await projectService.getProjectById(record._id);
      
      if (projectDetail && projectDetail.data) {
        setSelectedProject(projectDetail.data);
      }
      
      setIsModalVisible(true);
    } catch (error) {
    
      toast.error(' An error occurred while fetching the project details');
    } finally {
      setLoading(false);
    }
  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEdit = async (record: ProjectData) => {
    try {
      setLoading(true);
      setSelectedProject(record);

      // Khởi tạo team members từ project_members
      const initialTeamMembers = record.project_members.map(member => ({
        userId: member.user_id,
        role: member.project_role
      }));
      setEditTeamMembers(initialTeamMembers);
      setIsEditModalVisible(true);

    } catch (error) {
    
      toast.error(' An error occurred while opening the edit form');
    } finally {
      setLoading(false);
    }
  };



  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProject(null);

  };

  // Đổi tên hàm validateTeamMembers thành validateTeamMembersData để tránh conflict
  const validateTeamMembersData = (members: Array<{userId: string, role: string}>) => {
    if (members.length === 0) {
      toast.error('Please add at least one member to the project');
      return false;
    }

    const isValid = members.every(member => member.userId && member.role);
    if (!isValid) {
      toast.error('Please fill in all member information and roles');
      return false;
    }

    // Kiểm tra có đúng 1 PM và tối đa 1 QA
    const pmCount = members.filter(m => m.role === 'Project Manager').length;
    const qaCount = members.filter(m => m.role === 'Quality Analytics').length;

    if (pmCount !== 1) {
      toast.error('Project must have exactly one Project Manager');
      return false;
    }

    if (qaCount > 1) {
      toast.error('Project can have at most one Quality Analytics');
      return false;
    }

    return true;
  };

  // Sửa lại hàm handleEditSubmit
  const handleEditSubmit = async (values: any) => {
    try {
      if (!selectedProject?._id) {
       toast.error('Project ID not found');
        return;
      }

      if (!validateTeamMembersData(editTeamMembers)) {
        return;
      }

      setLoading(true);

      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department,
        project_description: values.project_description,
        project_status: values.project_status,
        project_start_date: dayjs(values.startDate).format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate).format('YYYY-MM-DD'),
        project_members: editTeamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role,
          employee_id: '',
          user_name: '',
          full_name: ''
        }))
      };

      const response = await projectService.updateProject(selectedProject._id, projectData);
      if (response) {
        toast.success('Project updated successfully');
        setIsEditModalVisible(false);
        fetchProjects();
      }
    } catch (error) {
     
      toast.error('An error occurred while updating the project');
    } finally {
      setLoading(false);
    }
  };

 

  // Thêm hàm để fetch users
  const fetchUsers = async (searchText: string = '') => {
    try {
      const response = await userService.searchUsers({
        searchCondition: {
          keyword: searchText,
          is_delete: false,
          is_blocked: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100 // Lấy nhiều user để có đủ lựa chọn
        }
      });

      if (response && response.data.pageData) {
        // Format data cho Select options
        const formattedUsers = response.data.pageData.map((user: any) => ({
          value: user._id,
          label: `${user.full_name || user.user_name} (${user.email})`,
          role_code: user.role_code
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
     toast.error(' Cannot load user data');
    }
  };

  // Thêm useEffect để fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm useEffect để fetch departments khi component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Thêm hàm để fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      if (response && response.data) {
        const formattedDepartments = response.data.map(dept => ({
          value: dept.department_code,
          label: dept.department_name
        }));
        setDepartments(formattedDepartments);
      }
    } catch (error) {
     toast.error(' Cannot load department data');
    }
  };

  // Thêm hàm xử lý mở modal change status
  const handleChangeStatus = (record: ProjectData, newStatus: string) => {
    setStatusChangeInfo({ project: record, newStatus });
    setIsStatusModalVisible(true);
  };

  // Thêm hàm mới để xử lý khi user xác nhận thay đổi status
  const handleConfirmChangeStatus = async () => {
    if (!statusChangeInfo.project || !statusChangeInfo.newStatus) return;

    try {
      setLoading(true);
      await projectService.changeProjectStatus({
        _id: statusChangeInfo.project._id,
        project_status: statusChangeInfo.newStatus,
      });
      
      toast.success('Project status updated successfully');
      fetchProjects();
    } catch (error) {
      toast.error('An error occurred while updating the project status');
    } finally {
      setLoading(false);
      setIsStatusModalVisible(false);
      setStatusChangeInfo({ project: null, newStatus: '' });
    }
  };

  // Thêm effect để lắng nghe event toggle favorites
  useEffect(() => {
    const handleToggleFavorites = () => {
      setShowOnlyFavorites(prev => !prev);
    };

    window.addEventListener('toggleFavorites', handleToggleFavorites);
    
    return () => {
      window.removeEventListener('toggleFavorites', handleToggleFavorites);
    };
  }, []);

  // Sửa lại hàm getFilteredProjects để xử lý favorites
  const getFilteredProjects = useCallback(() => {
    let filtered = [...projects];
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(project => 
        project.project_name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.project_code.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter favorites if enabled
    if (showOnlyFavorites) {
      filtered = filtered.filter(project => favoriteProjects.includes(project._id));
    }

    return filtered;
  }, [projects, searchText, showOnlyFavorites, favoriteProjects]);

  // Di chuyển khai báo columns xuống sau khi đã định nghĩa đầy đủ các hàm xử lý
  const columns = getProjectColumns({
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleToggleFavorite: toggleFavorite,
    handleChangeStatus,
    favoriteProjects,
  });

  return (
    <div className="flex min-h-screen bg-sky-50">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <div className="mb-8">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              Back to Dashboard
            </Button>
          </div>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
              </div>
              <Input
                placeholder="Search project..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            
            <div className="overflow-auto custom-scrollbar">
              <Table
                columns={columns}
                dataSource={getFilteredProjects()}
                rowKey="_id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total: ${total} projects`
                }}
                onChange={handleTableChange}
                className="overflow-hidden"
              />
            </div>
          </Card>

          {/* Modal Project Details */}
          <Modal
            title={<h2 className="text-2xl font-bold mb-0">Project Details</h2>}
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={800}
            className="custom-modal"
          >
            {loading ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : selectedProject ? (
              <div className="mt-4">
                {/* Header - Key Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedProject.project_name}</h3>
                      <p className="text-gray-500 mt-1">Code: {selectedProject.project_code}</p>
                    </div>
                    <div className="text-right">
                      <Tag color={
                        selectedProject.project_status === 'New' ? 'blue' :
                          selectedProject.project_status === 'Pending' ? 'orange' :
                            'green'
                      } className="text-base px-4 py-1">
                        {selectedProject.project_status}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Main Content - Two Columns */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    {/* Timeline */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Start</p>
                          <p className="font-medium">{dayjs(selectedProject.project_start_date).format('DD/MM/YYYY')}</p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <p className="text-sm text-gray-500">End</p>
                          <p className="font-medium">{dayjs(selectedProject.project_end_date).format('DD/MM/YYYY')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Department & Description */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Department</h3>
                      <p className="text-gray-700 mb-4">{selectedProject.project_department}</p>

                      <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                      <p className="text-gray-700">{selectedProject.project_description}</p>
                    </div>
                  </div>

                  {/* Right Column - Project Members */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Project Members</h3>
                    <div className="space-y-3">
                      {[
                        { role: 'Project Manager', color: 'gold' },
                        { role: 'Quality Analytics', color: 'green' },
                        { role: 'Technical Leader', color: 'blue' },
                        { role: 'Business Analytics', color: 'purple' },
                        { role: 'Developer', color: 'cyan' },
                        { role: 'Tester', color: 'magenta' },
                        { role: 'Technical Consultant', color: 'geekblue' }
                      ].map(({ role, color }) => {
                        const members = selectedProject.project_members.filter(
                          member => member.project_role === role
                        );

                        return (
                          <div key={role} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                            <Tag color={color} className="min-w-[140px]">{role}</Tag>
                            <span className="text-gray-700 text-right">
                              {members.length > 0
                                ? members.map(m => m.full_name || m.user_name).join(', ')
                                : <span className="text-gray-400 italic">No information available</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer - Metadata */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Created: {dayjs(selectedProject.created_at).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
                    <span>Last updated: {dayjs(selectedProject.updated_at).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
                    <span>By: {selectedProject.updated_by}</span>
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="No data available" />
            )}
          </Modal>


          <ProjectModal
            visible={isEditModalVisible}
            onCancel={handleEditModalClose}
            onSubmit={handleEditSubmit}
            initialValues={selectedProject || undefined}
            isEditMode={true}
            users={users}
            departments={departments}
            disabledStartDate={disabledStartDate}
            disabledEndDate={disabledEndDate}
            teamMembers={editTeamMembers}
            setTeamMembers={setEditTeamMembers}
            handleStartDateChange={(date: dayjs.Dayjs | null) => handleEditStartDateChange(date)}
            handleEndDateChange={(date: dayjs.Dayjs | null) => handleEditEndDateChange(date)}
          />

          <Modal
            title="Confirm Delete Project"
            open={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalVisible(false);
              setProjectToDelete(null);
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <p>Are you sure you want to delete this project?</p>
            <p>This action cannot be undone.</p>
          </Modal>

          <Modal
            title="Confirm Status Change"
            open={isStatusModalVisible}
            onOk={handleConfirmChangeStatus}
            onCancel={() => {
              setIsStatusModalVisible(false);
              setStatusChangeInfo({ project: null, newStatus: '' });
            }}
            okText="Change Status"
            cancelText="Cancel"
            okButtonProps={{
              style: {
                backgroundColor: 
                  statusChangeInfo.newStatus === 'Active' ? '#52c41a' :
                  statusChangeInfo.newStatus === 'Pending' ? '#faad14' :
                  statusChangeInfo.newStatus === 'Closed' ? '#ff4d4f' : '#1890ff'
              }
            }}
          >
            <p>Are you sure you want to change the status of project "{statusChangeInfo.project?.project_name}" to {statusChangeInfo.newStatus}?</p>
            <p>This action will update the project's status immediately.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectManager;