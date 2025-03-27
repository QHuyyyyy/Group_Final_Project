import { Button, Space, Tag,  Dropdown, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Project, ProjectData } from '../../models/ProjectModel';

interface ProjectColumnsProps {
  handleViewDetails: (record: ProjectData) => void;
  handleEdit: (record: ProjectData) => void;
  handleDelete: (id: string) => void;
  handleToggleFavorite: (id: string) => void;
  handleChangeStatus: (record: ProjectData, status: string) => void;
  favoriteProjects: string[];
}

export const getProjectColumns = ({
  handleViewDetails,
  handleEdit,
  handleDelete,
  handleToggleFavorite,
  handleChangeStatus,
  favoriteProjects,
}: ProjectColumnsProps) => [
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
    title: 'From',
    dataIndex: 'project_start_date',
    key: 'project_start_date',
    width: 100,
    render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
  },
  {
    title: 'To',
    dataIndex: 'project_end_date',
    key: 'project_end_date',
    width: 100,
    render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
  },
  {
    title: 'Status',
    dataIndex: 'project_status',
    key: 'project_status',
    width: 140,
    render: (status: string, record: ProjectData) => {
      const getStatusLabel = (status: string): string => {
        switch(status) {
          case 'New': return 'New';
          case 'Active': return 'Active';
          case 'Pending': return 'Pending';
          case 'Closed': return 'Closed';
          default: return status;
        }
      };

      const getStatusColor = (status: string): string => {
        switch(status) {
          case 'New': return 'blue';
          case 'Active': return 'green';
          case 'Pending': return 'orange';
          case 'Closed': return 'red';
          default: return 'default';
        }
      };

      const items = [
        { value: 'New', label: 'New' },
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Closed', label: 'Closed' }
      ].map(option => ({
        key: option.value,
        label: (
          <Popconfirm
            title="Change Status"
            description={`Are you sure to change status to ${option.label}?`}
            onConfirm={() => handleChangeStatus(record, option.value)}
            okText="Yes"
            cancelText="No"
          >
            <div style={{ padding: '4px 8px' }}>{option.label}</div>
          </Popconfirm>
        )
      }));

      return (
        <Dropdown 
          menu={{ items }}
          trigger={['click']}
        >
          <a onClick={e => e.preventDefault()} className="cursor-pointer">
            <Tag 
              color={getStatusColor(status)}
              style={{ 
                padding: '2px 8px',
                height: '24px',
                lineHeight: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                minWidth: '90px',
                justifyContent: 'space-between'
              }}
            >
              {getStatusLabel(status)}
              <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </Tag>
          </a>
        </Dropdown>
      );
    }
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
    render: (_: any, record: ProjectData) => (
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