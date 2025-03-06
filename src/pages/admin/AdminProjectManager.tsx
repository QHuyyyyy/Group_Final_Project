import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarAdminProject from '../../components/admin/SideBarAdminProject';
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined, SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../../services/projectService';
import { userService } from '../../services/userService';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); // Set default timezone to UTC+7

// Thêm interface để định nghĩa kiểu dữ liệu

interface ProjectMember {
  project_role: string;
  user_id: string;
  employee_id: string;
  user_name: string;
  full_name: string;
}

interface Project {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  project_comment: string | null;
  project_members: ProjectMember[];
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const AdminProjectManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Hàm disabledStartDate
  const disabledStartDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  // Hàm disabledEndDate
  const disabledEndDate = (current: dayjs.Dayjs) => {
    if (!startDate) {
      return current && current < dayjs().startOf('day');
    }
    return current && (current < dayjs().startOf('day') || current < startDate);
  };


  // Hàm xử lý thay đổi ngày bắt đầu cho form tạo mới
  const handleCreateStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    const endDate = createForm.getFieldValue('endDate');
    if (date && endDate && endDate < date) {
      createForm.setFieldValue('endDate', null);
    }
  };

  // Hàm xử lý thay đổi ngày bắt đầu cho form chỉnh sửa  
  const handleEditStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    const endDate = editForm.getFieldValue('endDate');
    if (date && endDate && endDate < date) {
      editForm.setFieldValue('endDate', null);
    }
  };

  // Thêm useEffect để fetch data khi component mount
  useEffect(() => {
    console.log('Component mounted or dependencies changed');
    fetchProjects();
  }, [pagination.current, pagination.pageSize, searchText]); // Thêm dependencies

  // Cập nhật lại hàm fetchProjects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects with params:', {
        searchText,
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize
        }
      });

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

      console.log('API Response:', response.data); // Kiểm tra response

      // Kiểm tra cấu trúc response và cập nhật state
      if (response && response.data) {
        setProjects(response.data.pageData || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pageInfo?.totalItems || 0
        }));
        console.log('Updated projects:', response.data.pageData);
      } else {
        message.error('Không thể tải dữ liệu dự án');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu dự án');
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
      message.success('Xóa dự án thành công');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Có lỗi xảy ra khi xóa dự án');
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);
    }
  };

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'project_code',
      key: 'project_code',
      width: 120,
    },
    {
      title: 'Project Name',
      dataIndex: 'project_name',
      key: 'project_name',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'project_status',
      key: 'project_status',
      width: 120,
      render: (status: string) => (
        <Tag color={
          status === 'New' ? 'blue' :
            status === 'Pending' ? 'orange' :
              'green'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'From',
      dataIndex: 'project_start_date',
      key: 'project_start_date',
      width: 150, // Tăng width để hiển thị thêm giờ
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
    },
    {
      title: 'To',
      dataIndex: 'project_end_date',
      key: 'project_end_date',
      width: 150, // Tăng width để hiển thị thêm giờ
      render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
    },
    {
      title: 'Favorite',
      key: 'favorite',
      width: 80,
      render: (_: any, record: Project) => (
        <Button
          type="text"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(record._id);
          }}
          icon={favoriteProjects.includes(record._id) ? <StarFilled className="text-yellow-400" /> : <StarOutlined />}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const handleViewDetails = async (record: Project) => {
    try {
      setLoading(true);
      setSelectedProject(record);
      setIsModalVisible(true);

      // Giả lập thời gian loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Lỗi khi lấy thông tin dự án:', error);
      message.error('Đã xảy ra lỗi khi lấy thông tin dự án');
    } finally {
      setLoading(false);
    }
  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEdit = async (record: Project) => {
    try {
      setLoading(true); // Bắt đầu trạng thái loading
      setSelectedProject(record);

      // Set giá trị mặc định cho form từ record
      editForm.setFieldsValue({
        project_name: record.project_name,
        project_code: record.project_code,
        project_department: record.project_department,
        project_description: record.project_description,
        project_status: record.project_status,
        startDate: dayjs(record.project_start_date), // Convert string to dayjs
        endDate: dayjs(record.project_end_date), // Convert string to dayjs

        // Set giá trị cho các role từ project_members
        project_manager: record.project_members.find(m => m.project_role === 'Project Manager')?.user_id,
        qa_leader: record.project_members.find(m => m.project_role === 'Quality Analytics')?.user_id,
        technical_leader: record.project_members
          .filter(m => m.project_role === 'Technical Leader')
          .map(m => m.user_id),
        business_analyst: record.project_members
          .filter(m => m.project_role === 'Business Analytics')
          .map(m => m.user_id),
        developers: record.project_members
          .filter(m => m.project_role === 'Developer')
          .map(m => m.user_id),
        testers: record.project_members
          .filter(m => m.project_role === 'Tester')
          .map(m => m.user_id),
        technical_consultant: record.project_members
          .filter(m => m.project_role === 'Technical Consultant')
          .map(m => m.user_id)
      });

      // Giả lập thời gian loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      message.error('Có lỗi xảy ra khi mở form chỉnh sửa');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };



  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProject(null);

  };

  const handleEditSubmit = async (values: any) => {
    try {
      if (!selectedProject?._id) {
        message.error('Không tìm thấy project ID');
        return;
      }

      setLoading(true);

      // Format dữ liệu để update với cùng cấu trúc như create
      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department || 'HR',
        project_description: values.project_description || '',
        project_status: values.project_status,
        project_start_date: dayjs(values.startDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
        project_members: [
          // PM - single select
          {
            user_id: values.project_manager,
            project_role: 'Project Manager',
            employee_id: '',
            user_name: '',
            full_name: ''
          },
          // QA - single select
          {
            user_id: values.qa_leader,
            project_role: 'Quality Analytics',
            employee_id: '',
            user_name: '',
            full_name: ''
          },
          // Technical Lead - multiple select
          ...(values.technical_leader || []).map((id: string) => ({
            user_id: id,
            project_role: 'Technical Leader',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // BA - multiple select
          ...(values.business_analyst || []).map((id: string) => ({
            user_id: id,
            project_role: 'Business Analytics',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Developers - multiple select
          ...(values.developers || []).map((id: string) => ({
            user_id: id,
            project_role: 'Developer',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Testers - multiple select
          ...(values.testers || []).map((id: string) => ({
            user_id: id,
            project_role: 'Tester',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Technical Consultant - multiple select
          ...(values.technical_consultant || []).map((id: string) => ({
            user_id: id,
            project_role: 'Technical Consultant',
            employee_id: '',
            user_name: '',
            full_name: ''
          }))
        ].filter(member => member.user_id) // Lọc bỏ các member không có user_id
      };

      console.log('Sending update data:', projectData);

      const response = await projectService.updateProject(selectedProject._id, projectData);

      if (response) {
        message.success('Cập nhật dự án thành công');
        setIsEditModalVisible(false);
        editForm.resetFields();
        fetchProjects();
        setSelectedUsers(new Set());
      }

    } catch (error) {
      console.error('Error updating project:', error);
      message.error('Có lỗi xảy ra khi cập nhật dự án');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (projectId: string) => {
    setFavoriteProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      }
      return [...prev, projectId];
    });
  };

  const handleCreate = () => {
    createForm.setFieldsValue({
      technical_leader: [],
      business_analyst: [],
      developers: [],
      testers: [],
      technical_consultant: []
    });
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    createForm.resetFields();  // Đặt lại form khi đóng modal
    setIsCreateModalVisible(false);

  };

  const handleCreateSubmit = async (values: any) => {
    try {
      setLoading(true);
      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department,
        project_description: values.project_description,
        project_status: values.project_status,
        project_start_date:dayjs(values.startDate).utc().format('YYYY-MM-DD'),
        project_end_date: dayjs(values.endDate)
        .utc()
        .format('YYYY-MM-DD'),
        project_members: [
          // PM - single select
          {
            user_id: values.project_manager,
            project_role: 'Project Manager',
            employee_id: '',
            user_name: '',
            full_name: ''
          },
          // QA - single select
          {
            user_id: values.qa_leader,
            project_role: 'Quality Analytics',
            employee_id: '',
            user_name: '',
            full_name: ''
          },
          // Technical Lead - multiple select
          ...values.technical_leader.map((id: string) => ({
            user_id: id,
            project_role: 'Technical Leader',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // BA - multiple select
          ...values.business_analyst.map((id: string) => ({
            user_id: id,
            project_role: 'Business Analytics',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Developers - multiple select
          ...values.developers.map((id: string) => ({
            user_id: id,
            project_role: 'Developer',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Testers - multiple select
          ...values.testers.map((id: string) => ({
            user_id: id,
            project_role: 'Tester',
            employee_id: '',
            user_name: '',
            full_name: ''
          })),
          // Technical Consultant - multiple select
          ...values.technical_consultant.map((id: string) => ({
            user_id: id,
            project_role: 'Technical Consultant',
            employee_id: '',
            user_name: '',
            full_name: ''
          }))
        ]
      };

      const response = await projectService.createProject(projectData);
      if (response.success) {
        message.success('Project created successfully');
        setIsCreateModalVisible(false);
        createForm.resetFields();
        fetchProjects(); // Refresh danh sách
      }
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Failed to create project');
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
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    }
  };

  // Thêm useEffect để fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm hàm xử lý search users
  const handleUserSearch = async (searchText: string) => {
    try {
      const response = await userService.searchUsers({
        searchCondition: {
          keyword: searchText,
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100
        }
      });

      if (response && response.data.pageData) {
        const formattedUsers = response.data.pageData.map((user: any) => ({
          value: user._id,
          label: `${user.full_name || user.user_name} (${user.email})`
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Hàm xử lý chọn user cho form tạo mới
  const handleCreateUserSelect = (value: string | string[], fieldName: string) => {
    const allFormValues = createForm.getFieldsValue();
    const newSelectedUsers = new Set<string>();

    // Lấy tất cả users đã chọn từ các trường khác
    Object.entries(allFormValues).forEach(([key, val]) => {
      if (key !== fieldName && val) {
        if (Array.isArray(val)) {
          val.forEach(v => {
            if (typeof v === 'string') {
              newSelectedUsers.add(v);
            }
          });
        } else if (typeof val === 'string') {
          newSelectedUsers.add(val);
        }
      }
    });

    // Thêm user(s) mới được chọn
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === 'string') {
          newSelectedUsers.add(v);
        }
      });
    } else if (typeof value === 'string') {
      newSelectedUsers.add(value);
    }

    setSelectedUsers(newSelectedUsers);
  };

  // Hàm xử lý chọn user cho form chỉnh sửa
  const handleEditUserSelect = (value: string | string[], fieldName: string) => {
    const allFormValues = editForm.getFieldsValue();
    const newSelectedUsers = new Set<string>();

    // Lấy tất cả users đã chọn từ các trường khác
    Object.entries(allFormValues).forEach(([key, val]) => {
      if (key !== fieldName && val) {
        if (Array.isArray(val)) {
          val.forEach(v => {
            if (typeof v === 'string') {
              newSelectedUsers.add(v);
            }
          });
        } else if (typeof val === 'string') {
          newSelectedUsers.add(val);
        }
      }
    });

    // Thêm user(s) mới được chọn
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === 'string') {
          newSelectedUsers.add(v);
        }
      });
    } else if (typeof value === 'string') {
      newSelectedUsers.add(value);
    }

    setSelectedUsers(newSelectedUsers);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBarAdminProject
        favoriteProjects={favoriteProjects}
        projects={projects}
        onCreateProject={handleCreate}
      />
      <div className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            Back to Dashboard
          </Button>

          <Input
            placeholder="Tìm kiếm dự án..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            className="ml-4"
          />
        </div>

        <Card className="shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Projects Overview</h1>
          </div>
          <div className="overflow-auto custom-scrollbar">
            <Table
              columns={columns}
              dataSource={projects}
              rowKey="_id"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng ${total} dự án`
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
                      { role: 'Technical Lead', color: 'blue' },
                      { role: 'Business Analyst', color: 'purple' },
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

        {/* Modal Edit Project */}
        <Modal
          title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Project</h2>}
          open={isEditModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
          width={800}
          className="custom-modal"
        >
          {selectedProject && (
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleEditSubmit}
              initialValues={selectedProject}
            >
              {/* Project Information */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2">
                  <Form.Item
                    name="project_name"
                    label="Project Name"
                    rules={[{ required: true, message: 'Please specify value for this field.' }]}
                  >
                    <Input className="rounded-md" />
                  </Form.Item>
                </div>

                <div className="col-span-2">
                  <Form.Item
                    name="project_code"
                    label="Project Code"
                    rules={[{ required: true, message: 'Please specify value for this field.' }]}
                  >
                    <Input className="rounded-md" />
                  </Form.Item>
                </div>

                <div className="col-span-2">
                  <Form.Item
                    name="project_department"
                    label="Department"
                  >
                    <Select placeholder="Select department">
                      <Select.Option value="CMS">CMS</Select.Option>
                      <Select.Option value="ERP">ERP</Select.Option>
                      <Select.Option value="Blockchain">Blockchain</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-span-2">
                  <Form.Item
                    name="project_description"
                    label="Description"
                    rules={[{ required: true, message: 'Please specify value for this field.' }]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter project description"
                      className="rounded-md"
                    />
                  </Form.Item>
                </div>

                {/* Date Selection in 2 columns */}
                <div>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      className="rounded-md"
                      disabledDate={disabledStartDate}
                      onChange={handleEditStartDateChange}
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="End Date"
                    name="endDate"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      className="rounded-md"
                      disabledDate={disabledEndDate}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Team Members Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Form.Item
                    name="project_manager"
                    label="Project Manager"
                    rules={[{ required: true, message: 'Vui lòng chọn Project Manager!' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn Project Manager"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        user.value === editForm.getFieldValue('project_manager')
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'project_manager')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="qa_leader"
                    label="Quality Analytics"
                    rules={[{ required: true, message: 'Vui lòng chọn QA!' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn QA"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        user.value === editForm.getFieldValue('qa_leader')
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'qa_leader')}
                    />
                  </Form.Item>

                  {/* Các role khác tương tự, bỏ rules */}
                  <Form.Item
                    name="technical_leader"
                    label="Technical Lead"
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select Technical Lead"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        (editForm.getFieldValue('technical_leader') || []).includes(user.value)
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'technical_leader')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="business_analyst"
                    label="Business Analyst"
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select Business Analyst"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        (editForm.getFieldValue('business_analyst') || []).includes(user.value)
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'business_analyst')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="developers"
                    label="Developers"
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select Developers"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        (editForm.getFieldValue('developers') || []).includes(user.value)
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'developers')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="testers"
                    label="Testers"
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select Testers"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        (editForm.getFieldValue('testers') || []).includes(user.value)
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'testers')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="technical_consultant"
                    label="Technical Consultancy"
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Select Technical Consultant"
                      onSearch={handleUserSearch}
                      filterOption={false}
                      options={users.filter(user =>
                        !selectedUsers.has(user.value) ||
                        (editForm.getFieldValue('technical_consultant') || []).includes(user.value)
                      )}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onChange={(value) => handleEditUserSelect(value, 'technical_consultant')}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  onClick={handleEditModalClose}
                  className="px-6 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Update Project
                </Button>
              </div>
            </Form>
          )}
        </Modal>

        {/* Modal Create Project */}
        <Modal
          title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Project</h2>}
          open={isCreateModalVisible}
          onCancel={handleCreateModalClose}
          footer={null}
          width={800}
          className="custom-modal"
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateSubmit}
            className="bg-white p-4"
          >
            {/* Project Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Project Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  name="project_code"
                  label="Project Code"
                  rules={[{ required: true, message: 'Please input project code!' }]}
                >
                  <Input placeholder="Enter project code" />
                </Form.Item>

                <Form.Item
                  name="project_name"
                  label="Project Name"
                  rules={[{ required: true, message: 'Please input project name!' }]}
                >
                  <Input placeholder="Enter project name" />
                </Form.Item>

                <Form.Item
                  name="project_department"
                  label="Department"
                  rules={[{ required: true, message: 'Please select department!' }]}
                >
                  <Select placeholder="Select department">
                    <Select.Option value="IT">IT Department</Select.Option>
                    <Select.Option value="HR">HR Department</Select.Option>
                    <Select.Option value="Marketing">Marketing Department</Select.Option>
                    <Select.Option value="Sales">Sales Department</Select.Option>
                    <Select.Option value="Finance">Finance Department</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="project_description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input project description!' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter project description"
                  />
                </Form.Item>

                <Form.Item
                  label="Start Date"
                  name="startDate"
                  rules={[{ required: true, message: 'Please select start date!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    className="rounded-md"
                    disabledDate={disabledStartDate}
                    onChange={handleCreateStartDateChange}
                  />
                </Form.Item>

                <Form.Item
                  label="End Date"
                  name="endDate"
                  rules={[{ required: true, message: 'Please select end date!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={disabledEndDate}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  name="project_manager"
                  label="Project Manager"
                  rules={[{ required: true, message: 'Vui lòng chọn Project Manager!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn Project Manager"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      user.value === createForm.getFieldValue('project_manager')
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'project_manager')}
                  />
                </Form.Item>

                <Form.Item
                  name="qa_leader"
                  label="Quality Analytics"
                  rules={[{ required: true, message: 'Vui lòng chọn QA!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn QA"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      user.value === createForm.getFieldValue('qa_leader')
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'qa_leader')}
                  />
                </Form.Item>

                <Form.Item
                  name="technical_leader"
                  label="Technical Lead"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select Technical Lead"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      (createForm.getFieldValue('technical_leader') || []).includes(user.value)
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'technical_leader')}
                  />
                </Form.Item>

                <Form.Item
                  name="business_analyst"
                  label="Business Analyst"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select Business Analyst"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      (createForm.getFieldValue('business_analyst') || []).includes(user.value)
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'business_analyst')}
                  />
                </Form.Item>

                <Form.Item
                  name="developers"
                  label="Developers"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select Developers"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      (createForm.getFieldValue('developers') || []).includes(user.value)
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'developers')}
                  />
                </Form.Item>

                <Form.Item
                  name="testers"
                  label="Testers"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select Testers"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      (createForm.getFieldValue('testers') || []).includes(user.value)
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'testers')}
                  />
                </Form.Item>

                <Form.Item
                  name="technical_consultant"
                  label="Technical Consultancy"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select Technical Consultant"
                    onSearch={handleUserSearch}
                    filterOption={false}
                    options={users.filter(user =>
                      !selectedUsers.has(user.value) ||
                      (createForm.getFieldValue('technical_consultant') || []).includes(user.value)
                    )}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onChange={(value) => handleCreateUserSelect(value, 'technical_consultant')}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button onClick={handleCreateModalClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create Project</Button>
            </div>
          </Form>
        </Modal>

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
      </div>
    </div>
  );
};

export default AdminProjectManager;