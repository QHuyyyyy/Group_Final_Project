import api from '../api/axios';
import { CreateProjectRequest, CreateProjectResponse, SearchParams, SearchResponse, ProjectResponse, UpdateProjectRequest, ChangeProjectStatusRequest, ChangeProjectStatusResponse } from '../models/ProjectModel';

const projectService = {
  // Create a new projec
  createProject: async (projectData: CreateProjectRequest): Promise<CreateProjectResponse> => {
    const response = await api.post('/api/projects', projectData);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  // Tìm kiếm dự án với phân trang
  searchProjects: async (params: SearchParams = {
    searchCondition: {},
    pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 0 }
  }): Promise<SearchResponse> => {
    try {
      console.log('Calling searchProjects with params:', params);
      const response = await api.post('/api/projects/search', {
        searchCondition: {
          keyword: params.searchCondition.keyword || "",
          project_status: params.searchCondition.project_status,
          project_start_date: params.searchCondition.project_start_date,
          project_end_date: params.searchCondition.project_end_date,
          is_delete: params.searchCondition.is_delete || false
        },
        pageInfo: {
          pageNum: params.pageInfo.pageNum,
          pageSize: params.pageInfo.pageSize
        }
      });
      console.log('API response in service:', response);

      // Kiểm tra và trả về dữ liệu
      if (response && response.data) {
        return {
          success: true,
          data: {
            pageData: response.data.pageData || [],
            pageInfo: {
              pageNum: response.data.pageInfo?.pageNum || 1,
              pageSize: response.data.pageInfo?.pageSize || 10,
              totalItems: response.data.pageInfo?.totalItems || 0,
              totalPages: response.data.pageInfo?.totalPages || 0
            }
          }
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error in searchProjects:', error);
      throw error;
    }
  },

  // Lấy thông tin dự án theo ID
  getProjectById: async (id: string): Promise<ProjectResponse> => {
    const response = await api.get(`/api/projects/${id}`);
    console.log("fetch project data:", response.data.data);
    return response.data;
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: UpdateProjectRequest) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  // Xóa dự án
  deleteProject: async (id: string): Promise<void> => {
    const response = await api.delete(`/api/projects/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Change project status
  changeProjectStatus: async (statusData: ChangeProjectStatusRequest): Promise<ChangeProjectStatusResponse> => {
    const response = await api.put<ChangeProjectStatusResponse>('/api/projects/change-status', statusData);
    console.log("fetch data:", response.data.data);
    return response.data;
  }
};

export default projectService;