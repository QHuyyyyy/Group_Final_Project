import { apiUtils } from '../api/axios';
import { PROJECTS_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import {
  CreateProjectRequest,
  SearchParams,
  ProjectResponse,
  UpdateProjectRequest,
  ChangeProjectStatusRequest,
  Project,
  ProjectData
} from '../models/ProjectModel';

const projectService = {
  // Tạo dự án mới
  createProject: async (projectData: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await apiUtils.post<ApiResponse<Project>> (`${PROJECTS_ENDPOINT}`, projectData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm dự án với phân trang
  searchProjects: async (params: SearchParams = {
    searchCondition: {},
    pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 0 }
  }): Promise<ApiResponse<ProjectResponse>> => {
    try {
      console.log('Calling searchProjects with params:', params);
      const response = await apiUtils.post<ApiResponse<ProjectResponse>>(`${PROJECTS_ENDPOINT}/search`, {
        searchCondition: {
          keyword: params.searchCondition.keyword || "",
          project_status: params.searchCondition.project_status,
          project_start_date: params.searchCondition.project_start_date,
          project_end_date: params.searchCondition.project_end_date,
          is_delete: params.searchCondition.is_delete || false,
          user_id: params.searchCondition.user_id
        },
        pageInfo: {
          pageNum: params.pageInfo.pageNum,
          pageSize: params.pageInfo.pageSize
        }
      });
      console.log('API response in service:', response);
      return response.data;
    } catch (error) {
      console.error('Error in searchProjects:', error);
      throw error;
    }
  },

  // Lấy thông tin dự án theo ID
  getProjectById: async (id: string, config = {}): Promise<ApiResponse<ProjectData>> => {
    const response = await apiUtils.get<ApiResponse<ProjectData>>(`${PROJECTS_ENDPOINT}/${id}`, {}, config);
    console.log("fetch project data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: UpdateProjectRequest): Promise<ApiResponse<ProjectData>> => {
    const response = await apiUtils.put<ApiResponse<ProjectData>>(`${PROJECTS_ENDPOINT}/${id}`, projectData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Xóa dự án
  deleteProject: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.delete<ApiResponse<null>>(`${PROJECTS_ENDPOINT}/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi trạng thái dự án
  changeProjectStatus: async (statusData: ChangeProjectStatusRequest, config = {}): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${PROJECTS_ENDPOINT}/change-status`, statusData || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  }
};

export default projectService;