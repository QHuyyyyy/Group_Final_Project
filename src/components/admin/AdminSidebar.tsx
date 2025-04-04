import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProjectOutlined, UserOutlined, HomeOutlined, ProfileOutlined, TeamOutlined, EyeOutlined, StarOutlined, UserAddOutlined, DownOutlined, RightOutlined, LogoutOutlined, StarFilled } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import ProjectModal from '../admin/ProjectModal';
import projectService from '../../services/project.service';
import { userService } from '../../services/user.service';
import { departmentService } from '../../services/Department.service';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import AddUserModal from './AddUserModal';
import { roleService } from '../../services/role.service';
import { useAuth } from '../../contexts/AuthContext';
import { FormInstance } from 'antd';

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
  const { logout } = useAuth();
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const addUserFormRef = useRef<FormInstance>(null);

  const projectMenuItems = [
    {
      title: "Overviews",
      icon: <ProjectOutlined />,
      path: "/dashboard/project-manager"
    },
    {
      title: "Favorites",
      icon: isFavoriteActive ? <StarFilled className="text-yellow-400" /> : <StarOutlined />,
      path: "/dashboard/project-manager",
      onClick: () => {
        setIsFavoriteActive(!isFavoriteActive);
        window.dispatchEvent(new CustomEvent('toggleFavorites'));
      }
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
      path: "/dashboard/adminprofile"
    },
  ];

  const handleCreateModalOpen = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setTeamMembers([]);
    // Reset form data
    const projectModal = document.querySelector('form'); // Get the form element
    if (projectModal) {
      projectModal.reset(); // Reset all form fields
    }
    setIsCreateModalVisible(false);
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      // Check if there is a Project Manager in team members
      const hasProjectManager = teamMembers.some(member => member.role === 'Project Manager');
      if (!hasProjectManager) {
        toast.error('Project must have Project Manager');
        return;
      }

      setLoading(true);
      const projectData = {
        project_name: values.project_name,
        project_code: values.project_code,
        project_department: values.project_department,
        project_description: values.project_description,
        project_status: values.project_status || 'New',
        project_start_date: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        project_end_date: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        project_members: teamMembers.map(member => ({
          user_id: member.userId,
          project_role: member.role
        }))
      };

      const response = await projectService.createProject(projectData);
      if (response.success) {
        toast.success('Project created successfully');
        window.dispatchEvent(new CustomEvent('projectAdded'));
        handleCreateModalClose();
        
        navigate('/dashboard/project-manager');
      }
    } catch (error: any) {
      toast.error('Error creating project:', error);
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
        // Dispatch a custom event to notify AdminUserManager
        window.dispatchEvent(new CustomEvent('userAdded'));
        
        toast.success('User created successfully');
        if (addUserFormRef.current) {
          addUserFormRef.current.resetFields();
        }
        handleAddUserModalClose();
        navigate('/dashboard/user-manager');
      }
    } catch (error: any) {
      toast.error('Error creating user:', error);
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
      toast.error('Could not load roles');
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
        });

        if (usersResponse && usersResponse.data.pageData) {
          const formattedUsers = usersResponse.data.pageData.map((user: any) => ({
            value: user._id,
            label: `${user.full_name || user.user_name}`,
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
        toast.error('Failed to load necessary data');
      }
    };

    fetchInitialData();
    fetchRoles();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ProjectsSection = () => (
    <div>
      <div
        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-lg transition-all duration-200 ${
          isProjectExpanded ? 'bg-[#2E3754] text-white' : 'text-gray-300 hover:bg-[#2E3754]/50'
        }`}
        onClick={() => setIsProjectExpanded(!isProjectExpanded)}
      >
        <div className="flex items-center gap-2">
          <ProjectOutlined className={`text-xl ${isProjectExpanded ? 'text-white' : 'text-gray-300'}`} />
          <span className={`font-medium text-base ${isProjectExpanded ? 'text-white' : 'text-gray-300'}`}>Project Management</span>
        </div>
        {isProjectExpanded ? (
          <DownOutlined className={`text-xs ${isProjectExpanded ? 'text-white' : 'text-gray-300'}`} />
        ) : (
          <RightOutlined className={`text-xs ${isProjectExpanded ? 'text-white' : 'text-gray-300'}`} />
        )}
      </div>
      {isProjectExpanded && (
        <div className="mt-2">
          {projectMenuItems.map((item) => (
            <Link
              key={item.path + item.title}
              to={item.path}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-8 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path && !item.onClick
                  ? "bg-[#2E3754] text-white"
                  : "text-gray-300 hover:bg-[#2E3754]/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
          <button
            onClick={handleCreateModalOpen}
            className="flex items-center gap-3 px-8 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-white w-full shadow-sm"
          >
            <span className="text-lg">+</span>
            <span>Create New Project</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#1E2640] min-h-screen w-[260px] fixed left-0 top-0 text-white z-50">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="text-xl font-bold mb-8 text-center tracking-wide border-b border-gray-700 pb-4">
          Admin Dashboard
        </div>

        {/* Main Menu */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Menu Items Container */}
          <div className="space-y-4">
            {/* User Management Section */}
            <div>
              <button
                onClick={() => setIsUserExpanded(!isUserExpanded)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isUserExpanded ? 'bg-[#2E3754] text-white' : 'text-gray-300 hover:bg-[#2E3754]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-xl" />
                  <span className="font-medium">User Management</span>
                </div>
                {isUserExpanded ? 
                  <DownOutlined className="text-xs opacity-60" /> : 
                  <RightOutlined className="text-xs opacity-60" />
                }
              </button>

              {isUserExpanded && (
                <div className="mt-2">
                  {userMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center gap-3 px-8 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                        location.pathname === item.path
                          ? 'bg-[#2E3754] text-white font-medium shadow-sm'
                          : 'text-gray-300 hover:bg-[#2E3754]/50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleAddUserModalOpen}
                    className="flex items-center gap-3 px-8 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-white w-full shadow-sm"
                  >
                    <UserAddOutlined className="text-lg" />
                    <span>Add User</span>
                  </button>
                </div>
              )}
            </div>

            {/* Project Management Section */}
            <div>
              <ProjectsSection />
            </div>

            {/* Other Items */}
            <div className="pt-4 border-t border-gray-700">
              {otherItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 mb-1.5 ${
                    location.pathname === item.path
                      ? 'bg-[#2E3754] text-white font-medium shadow-sm'
                      : 'text-gray-300 hover:bg-[#2E3754]/50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Section - Moved to bottom */}
          <div className="mt-auto pt-4">
            <div className="border-t border-gray-700"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-300 hover:bg-[#2E3754]/50 transition-all duration-200 mt-4"
            >
              <LogoutOutlined className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        visible={isAddUserModalVisible}
        onCancel={handleAddUserModalClose}
        onSuccess={handleAddUserSubmit}
        roleOptions={roles}
        formRef={addUserFormRef}
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