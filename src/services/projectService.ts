import { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { CreateProjectRequest, SearchParams, SearchResponse,  UpdateProjectRequest, ChangeProjectStatusRequest,  Project, ProjectData } from '../models/ProjectModel';

const projectService = {
  // Create a new projec
  createProject: async (projectData: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await apiUtils.post<ApiResponse<Project>>('/api/projects', projectData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm dự án với phân trang
  searchProjects: async (params: SearchParams = {
    searchCondition: {},
    pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 0 }
  }): Promise<ApiResponse<SearchResponse>> => {
    try {
      console.log('Calling searchProjects with params:', params);
      const response = await apiUtils.post<ApiResponse<SearchResponse>>('/api/projects/search', {
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
      return response.data;

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error in searchProjects:', error);
      throw error;
    }
  },

  // Lấy thông tin dự án theo ID
  getProjectById: async (id: string): Promise<ApiResponse<ProjectData>> => {
    const response = await apiUtils.get<ApiResponse<ProjectData>>(`/api/projects/${id}`);
    console.log("fetch project data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: UpdateProjectRequest): Promise<ApiResponse<ProjectData>> => {
    const response = await apiUtils.put<ApiResponse<ProjectData>>(`/api/projects/${id}`, projectData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Xóa dự án
  deleteProject: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.delete<ApiResponse<null>>(`/api/projects/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Change project status
  changeProjectStatus: async (statusData: ChangeProjectStatusRequest): Promise<ApiResponse<null>>=> {
    const response = await apiUtils.put<ApiResponse<null>>('/api/projects/change-status', statusData);
    console.log("fetch data:", response.data);
    return response.data;
  }
};

export default projectService;