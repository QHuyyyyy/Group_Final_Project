import { apiUtils } from "../api/axios";

interface ProjectMember {
  user_id: string;
  project_role: string;
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

interface SearchCondition {
  keyword?: string;
  project_start_date?: string;
  project_end_date?: string;
  is_delete?: boolean;
  user_id?: string;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const projectService = {
  // Tạo dự án mới
  createProject: async (projectData: Partial<Project>) => {
    return apiUtils.post<ApiResponse<Project>>('/api/projects', projectData);
  },

  // Tìm kiếm dự án với phân trang
  searchProjects: async (params: SearchParams = { 
    searchCondition: {
      keyword: "",
      project_start_date: "",
      project_end_date: "",
      is_delete: false,
      user_id: ""
    }, 
    pageInfo: { 
      pageNum: 1, 
      pageSize: 10 
    } 
  }) => {
    return apiUtils.post<ApiResponse<Project[]>>('/api/projects/search', params);
  },

  // Lấy thông tin dự án theo ID
  getProjectById: async (id: string) => {
    return apiUtils.get<ApiResponse<Project>>(`/api/projects/${id}`);
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: Partial<Project>) => {
    return apiUtils.put<ApiResponse<Project>>(`/api/projects/${id}`, projectData);
  },

  // Xóa dự án (soft delete)
  deleteProject: async (id: string) => {
    return apiUtils.delete<ApiResponse<void>>(`/api/projects/${id}`);
  },

  // Thay đổi trạng thái dự án
  changeProjectStatus: async (project_id: string, project_status: string, project_comment: string) => {
    return apiUtils.put<ApiResponse<Project>>('/api/projects/change-status', {
      project_id,
      project_status,
      project_comment
    });
  },

  // Lấy tất cả dự án
  getAllProjects: async () => {
    return apiUtils.get<ApiResponse<Project[]>>('/api/projects/get-all');
  },

  // Kiểm tra mã dự án đã tồn tại
  checkProjectCode: async (code: string) => {
    return apiUtils.get<ApiResponse<boolean>>(`/api/projects/check-code/${code}`);
  }
};