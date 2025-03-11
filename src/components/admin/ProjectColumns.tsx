import { Button, Space, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Project, ProjectData } from '../../models/ProjectModel';

interface ProjectColumnsProps {
  handleViewDetails: (record: ProjectData) => void;
  handleEdit: (record: ProjectData) => void;
  handleDelete: (id: string) => void;
  handleToggleFavorite: (id: string) => void;
  handleChangeStatus: (record: ProjectData) => void;
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
    title: 'Status',
    dataIndex: 'project_status',
    key: 'project_status',
    width: 150,
    render: (status: string, record: ProjectData) => (
      <Space>
        <Tag color={
          status === 'New' ? 'blue' :
          status === 'Active' ? 'green' :
          status === 'Pending' ? 'orange' :
          status === 'Closed' ? 'red' :
          'default'
        }>
          {status}
        </Tag>
        <Tooltip title="Change Status">
          <Button
            type="text"
            icon={<SyncOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeStatus(record);
            }}
          />
        </Tooltip>
      </Space>
    ),
  },
  {
    title: 'From',
    dataIndex: 'project_start_date',
    key: 'project_start_date',
    width: 150,
    render: (date: string) => dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
  },
  {
    title: 'To',
    dataIndex: 'project_end_date',
    key: 'project_end_date',
    width: 150,
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