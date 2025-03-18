import React, { useState, useEffect } from 'react';
import { Space, Typography, Row, Col, Card, Tag, Spin } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import projectService from '../../services/project.service';
import { useUserStore } from '../../stores/userStore';
import dayjs from 'dayjs';

const { Title } = Typography;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((state) => state.id);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <ProjectOutlined /> My Projects
        </Title>

        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col xs={24} sm={12} md={8} lg={6} key={project._id}>
              <Card
                hoverable
                className="h-full"
                style={{ 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}
              >
                <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
                  {project.project_name}
                </Title>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>Code:</strong> {project.project_code}
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>Department:</strong> {project.project_department}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong>Description:</strong>
                  <p style={{ marginTop: '4px' }}>{project.project_description}</p>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong>Status:</strong>{' '}
                  <Tag color={project.project_status === 'Active' ? 'green' : 'orange'}>
                    {project.project_status}
                  </Tag>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong>Project Members:</strong>
                  <div style={{ marginTop: '8px' }}>
                    {project.project_members?.map((member: any) => (
                      <Tag 
                        key={member.user_id}
                        color="blue"
                        style={{ marginBottom: '4px' }}
                      >
                        {member.user_name || 'N/A'} ({member.project_role})
                      </Tag>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                  <p><strong>Start Date:</strong> {dayjs(project.project_start_date).format('DD/MM/YYYY')}</p>
                  <p><strong>End Date:</strong> {dayjs(project.project_end_date).format('DD/MM/YYYY')}</p>
                  <p><strong>Created:</strong> {dayjs(project.created_at).format('DD/MM/YYYY HH:mm')}</p>
                  <p><strong>Last Updated:</strong> {dayjs(project.updated_at).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};

export default Projects;