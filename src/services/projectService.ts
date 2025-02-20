import api from '../api/axios';


interface ProjectMember {
    user_id: string;
    project_role: string;
  }
  
  interface ProjectData {
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
  }

  interface SearchCondition {
  keyword?: string;
  project_start_date?: string;
  project_end_date?: string;
  is_delete?: boolean;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}




export const projectService = {
  // Tạo dự án mới
  createProject: async (projectData: ProjectData) => {
    const response = await api.post('/api/projects', projectData);
    console.log("fetch data:", response.data.success);
    return response.data;
  },

  // Tìm kiếm dự án với phân trang
  searchProjects: async (params: SearchParams) => {
    const response = await api.post('/api/projects/search', {
      searchCondition: {
        keyword: params.searchCondition.keyword || "",
        project_start_date: params.searchCondition.project_start_date,
        project_end_date: params.searchCondition.project_end_date,
        is_delete: params.searchCondition.is_delete || false
      },
      pageInfo: {
        pageNum: params.pageInfo.pageNum,
        pageSize: params.pageInfo.pageSize
      }
    });
    console.log("fetch data:", response.data.success);
    return response.data;
  },

  // Lấy thông tin dự án theo ID
  getProjectById: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    console.log("fetch data:", response.data.success);
    return response.data;
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: ProjectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    console.log("fetch data:", response.data.success);
    return response.data;
  },

  // Xóa dự án
  deleteProject: async (id: string): Promise<void> => {
    const response = await api.delete(`/api/projects/${id}`);
    console.log("fetch data:", response.data.success);
    return response.data;
  },

  // Thay đổi trạng thái dự án
  changeProjectStatus: async (project_id: string, project_status: string, project_comment: string)=> {
    const response = await api.put('/api/projects/change-status', {
      project_id,
      project_status,
      project_comment
    });
    console.log("fetch data:", response.data.success);
    return response.data;
  }
};