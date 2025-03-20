import React, { useState, useEffect } from 'react';
import {  Typography, Tag, Spin, Input, Button } from 'antd';
import { ProjectOutlined, ClockCircleOutlined, TeamOutlined, CodeOutlined, BankOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import projectService from '../../services/project.service';
import { useUserStore } from '../../stores/userStore';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const userId = useUserStore((state) => state.id);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.searchProjects({
          searchCondition: {
            user_id: userId,
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100,
            totalItems: 0,
            totalPages: 0
          }
        });

        if (response.success && response.data.pageData) {
          setProjects(response.data.pageData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.project_status === selectedStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (a._id === expandedProject) return -1;
    if (b._id === expandedProject) return 1;
    return 0;
  });

  const handleProjectClick = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const renderProjectCard = (project: any) => (
    <motion.div
      layout="position"
      layoutId={`project-${project._id}`}
      transition={{
        layout: { type: "spring", damping: 30, stiffness: 300 }
      }}
      className={`group relative ${
        expandedProject === project._id 
          ? 'col-span-12 z-30' 
          : 'col-span-3 cursor-pointer'
      }`}
      onClick={() => handleProjectClick(project._id)}
    >
      <div className={`
        relative overflow-hidden rounded-3xl
        backdrop-blur-lg bg-white/80 border border-white/20
        ${expandedProject === project._id ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        transition-all duration-300
      `}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 
          group-hover:opacity-100 opacity-0 transition-opacity duration-500" />

        {/* Main Content */}
        <div className={`relative ${expandedProject === project._id ? 'grid grid-cols-12' : ''}`}>
          {/* Project Info - Always Visible */}
          <div className={`${expandedProject === project._id ? 'col-span-3' : ''} p-6`}>
            {/* Status Badge - Floating */}
            <div className="absolute top-4 right-4 z-10">
              <Tag 
                color={project.project_status === 'Active' ? 'success' : 
                       project.project_status === 'New' ? 'processing' : 
                       project.project_status === 'Pending' ? 'warning' : 
                       project.project_status === 'Closed' ? 'error' : 'default'}
                className="rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm"
              >
                <motion.span 
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    project.project_status === 'Active' ? 'bg-green-400' : 
                    project.project_status === 'New' ? 'bg-blue-400' : 
                    project.project_status === 'Pending' ? 'bg-orange-400' : 
                    'bg-red-400'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                {project.project_status}
              </Tag>
            </div>

            {/* Project Title with Hover Effect */}
            <motion.div 
              className="mb-6 relative"
              whileHover={{ scale: 1.02 }}
            >
              <Title level={4} className="!mb-1 text-gray-800">
                {project.project_name}
              </Title>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 
                transition-all duration-300" />
            </motion.div>

            {/* Project Details with Hover Cards */}
            <div className="space-y-4">
              <motion.div 
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50
                  hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500 text-white">
                    <CodeOutlined />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-500">Project Code</Text>
                    <code className="block text-sm font-mono text-blue-600">
                      {project.project_code}
                    </code>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100/50
                  hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500 text-white">
                    <BankOutlined />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-500">Department</Text>
                    <Text className="block text-sm font-medium text-green-700">
                      {project.project_department}
                    </Text>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Expandable Sections */}
          {expandedProject === project._id && (
            <motion.div 
              className="col-span-9 grid grid-cols-9 divide-x divide-gray-100/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Description Section */}
              <div className="col-span-3 p-6 backdrop-blur-md bg-white/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <Text className="font-medium text-gray-700">Description</Text>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {project.project_description || 'No description available'}
                </div>
              </div>

              {/* Team Members Section with Animated Tags */}
              <div className="col-span-3 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="p-2 rounded-xl bg-purple-500 text-white"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TeamOutlined />
                  </motion.div>
                  <Text className="font-medium text-gray-700">Team</Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.project_members?.map((member: any, index: number) => (
                    <motion.div
                      key={member.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Tag 
                        className="rounded-full px-3 py-1.5 shadow-sm hover:shadow-md
                          transition-all duration-300 cursor-default"
                        color={
                          member.project_role === 'Project Manager' ? 'blue' :
                          member.project_role === 'Developer' ? 'green' :
                          member.project_role === 'Quality Analytics' ? 'purple' :
                          member.project_role === 'Technical Leader' ? 'orange' :
                          'default'
                        }
                      >
                        {member.user_name}
                        <span className="opacity-75 ml-1">• {member.project_role}</span>
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline Section with Interactive Elements */}
              <div className="col-span-3 p-6 backdrop-blur-md bg-white/30">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    className="p-2 rounded-xl bg-orange-500 text-white"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <ClockCircleOutlined />
                  </motion.div>
                  <Text className="font-medium text-gray-700">Timeline</Text>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="relative p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Text className="text-xs text-gray-500">Start Date</Text>
                    <Text className="text-sm font-medium text-gray-700">
                      {dayjs(project.project_start_date).format('DD/MM/YYYY')}
                    </Text>
                  </motion.div>

                  <motion.div 
                    className="relative p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Text className="text-xs text-gray-500">End Date</Text>
                    <Text className="text-sm font-medium text-gray-700">
                      {dayjs(project.project_end_date).format('DD/MM/YYYY')}
                    </Text>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8">
          <motion.div 
            className="flex items-center gap-4 mb-6"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              <ProjectOutlined className="text-2xl" />
            </div>
            <div>
              <Title level={2} className="!mb-0">My Projects</Title>
              <Text className="text-gray-500">Manage your project portfolio</Text>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <Input
              placeholder="Search projects..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl"
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setSelectedStatus(selectedStatus === 'all' ? 'Active' : 'all')}
              className={`rounded-xl ${
                selectedStatus !== 'all' ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {selectedStatus === 'all' ? 'All Status' : selectedStatus}
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-12 gap-6">
            {filteredProjects.map((project) => renderProjectCard(project))}
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Projects;