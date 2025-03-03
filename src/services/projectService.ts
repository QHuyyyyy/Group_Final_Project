import api from '../api/axios';


interface ProjectMember {
    user_id: string;
    project_role: string;
    employee_id: string;
    user_name: string;
    full_name: string;
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
  project_status?:string;
  project_start_date?: string;
  project_end_date?: string;
  is_delete?: boolean;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface SearchResponse {
  success: boolean;
  data: {
    pageData: Project[];
    pageInfo: PageInfo;
  };
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
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

const projectService = {
  // Tạo dự án mới
  createProject: async (projectData: ProjectData) => {
    const response = await api.post('/api/projects', projectData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
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
  getProjectById: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    console.log("fetch project data:", response.data.data);
    return response.data.data;
  },

  // Cập nhật thông tin dự án
  updateProject: async (id: string, projectData: ProjectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Xóa dự án
  deleteProject: async (id: string): Promise<void> => {
    const response = await api.delete(`/api/projects/${id}`);
    console.log("fetch data:",response.data.data);
    return response.data.data;
  },

  // Thay đổi trạng thái dự án
  changeProjectStatus: async (project_id: string, project_status: string, project_comment: string)=> {
    const response = await api.put('/api/projects/change-status', {
      project_id,
      project_status,
      project_comment
    });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  }
};

export default projectService;