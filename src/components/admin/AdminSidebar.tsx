import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProjectOutlined, UserOutlined, HomeOutlined, ProfileOutlined, TeamOutlined, EyeOutlined, HistoryOutlined, ClockCircleOutlined, StarOutlined, PlusOutlined, UserAddOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ProjectModal from '../admin/ProjectModal';
import { message } from 'antd';
import projectService from '../../services/project.service';
import { userService } from '../../services/user.service';
import { departmentService } from '../../services/Department.service';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import AddUserModal from './AddUserModal';
import { roleService } from '../../services/role.service';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isUserExpanded, setIsUserExpanded] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{userId: string, role: string}>>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [roles, setRoles] = useState<Array<{label: string, value: string}>>([]);

  const projectMenuItems = [
    {
      title: "Overviews",
      icon: <ProjectOutlined />,
      path: "/dashboard/project-manager"
    },
    {
      title: "Recents",
      icon: <ClockCircleOutlined />,
      path: "/dashboard/project-manager/recents"
    },
    {
      title: "Favorites",
      icon: <StarOutlined />,
      path: "/dashboard/project-manager/favorites"
    }
  ];

  const userMenuItems = [
    {
      title: "Staff Information",
      icon: <TeamOutlined />,
      path: "/dashboard/user-manager"
    },
    {
      title: "View Claim Request",
      icon: <EyeOutlined />,
      path: "/dashboard/view-claim-request"
    },
    {
      title: "Claim History",
      icon: <HistoryOutlined />,
      path: "/dashboard/transaction"
    }
  ];

  const otherItems = [
    {
      title: "Home",
      icon: <HomeOutlined />,
      path: "/"
    },
    {
      title: "Profile",
      icon: <ProfileOutlined />,
      path: "/dashboard/profile"
    }
  ];

  const handleCreateModalOpen = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setTeamMembers([]);
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
        project_status: values.project_status || 'New',
        project_start_date: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : null,
        project_end_date: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : null,
        project_members: teamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role
        }))
      };

      const response = await projectService.createProject(projectData);
      if (response.success) {
        toast.success('Project created successfully');
        handleCreateModalClose();
        navigate('/dashboard/project-manager');
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      message.error(error.message || 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserModalOpen = () => {
    setIsAddUserModalVisible(true);
  };

  const handleAddUserModalClose = () => {
    setIsAddUserModalVisible(false);
  };

  const handleAddUserSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await userService.createUser(values);
      if (response.success) {
        toast.success('User created successfully');
        handleAddUserModalClose();
        navigate('/dashboard/user-manager');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      message.error(error.message || 'An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      if (response && response.data) {
        const formattedRoles = response.data.map((role: any) => ({
          label: role.role_name,
          value: role.role_code
        }));
        setRoles(formattedRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Could not load roles');
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const usersResponse = await userService.searchUsers({
          searchCondition: {
            keyword: '',
            is_delete: false,
            is_blocked: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100
          }
        }, {showSpinner:false});

        if (usersResponse && usersResponse.data.pageData) {
          const formattedUsers = usersResponse.data.pageData.map((user: any) => ({
            value: user._id,
            label: `${user.full_name || user.user_name} (${user.email})`,
            role_code: user.role_code
          }));
          setUsers(formattedUsers);
        }

        const departmentsResponse = await departmentService.getAllDepartments();
        if (departmentsResponse && departmentsResponse.data) {
          const formattedDepartments = departmentsResponse.data.map(dept => ({
            value: dept.department_code,
            label: dept.department_name
          }));
          setDepartments(formattedDepartments);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        message.error('Failed to load necessary data');
      }
    };

    fetchInitialData();
    fetchRoles();
  }, []);

  return (
    <div className="bg-[#1E2640] min-h-screen w-[260px] fixed left-0 top-0 text-white">
      <div className="p-4">
        <div className="text-xl font-bold mb-8 text-center tracking-wide">
          Admin Dashboard
        </div>

        <div className="space-y-3">
          {/* Project Management Dropdown */}
          <div>
            <button
              onClick={() => setIsProjectExpanded(!isProjectExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2E3754] transition-colors rounded-lg text-gray-300 whitespace-nowrap text-sm"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <ProjectOutlined className="text-base flex-shrink-0" />
                <span>Project Management</span>
              </div>
              {isProjectExpanded ? <DownOutlined className="text-xs flex-shrink-0 ml-1" /> : <RightOutlined className="text-xs flex-shrink-0 ml-1" />}
            </button>
            
            {isProjectExpanded && (
              <div className="ml-4 mt-2 space-y-2">
                {projectMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-[#2E3754] text-gray-300'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
                <button
                  onClick={handleCreateModalOpen}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white w-full"
                >
                  <PlusOutlined className="text-xl" />
                  <span>Create New Project</span>
                </button>
              </div>
            )}
          </div>

          {/* User Management Dropdown */}
          <div>
            <button
              onClick={() => setIsUserExpanded(!isUserExpanded)}
              className="w-full flex items-center justify-between px-3 py-3 hover:bg-[#2E3754] transition-colors rounded-lg text-gray-300"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl w-[1em] flex justify-center">
                  <UserOutlined />
                </span>
                <span>User Management</span>
              </div>
              {isUserExpanded ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
            </button>
            
            {isUserExpanded && (
              <div className="ml-4 mt-2 space-y-2">
                {userMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-[#2E3754] text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
                <button
                  onClick={handleAddUserModalOpen}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white w-full"
                >
                  <UserAddOutlined className="text-xl" />
                  <span>Add User</span>
                </button>
              </div>
            )}
          </div>

          {/* Other Items */}
          {otherItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-[#2E3754] text-gray-300"
            >
              <span className="text-xl w-[1em] flex justify-center">
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <AddUserModal
        visible={isAddUserModalVisible}
        onCancel={handleAddUserModalClose}
        onSuccess={handleAddUserSubmit}
        roleOptions={roles}
      />

      <ProjectModal
        visible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        onSubmit={handleCreateSubmit}
        isEditMode={false}
        users={users}
        departments={departments}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        loading={loading}
        disabledStartDate={(current) => current && current < dayjs().startOf('day')}
        disabledEndDate={(current) => current && current < dayjs().startOf('day')}
        handleStartDateChange={() => {}}
        handleEndDateChange={() => {}}
      />
    </div>
  );
};

export default AdminSidebar; 