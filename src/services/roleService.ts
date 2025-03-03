import { apiUtils } from "../api/axios";

interface Role {
  _id: string;
  role_name: string;
  role_code: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface SearchCondition {
  keyword?: string;
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const roleService = {
  // Tạo role mới
  createRole: async (roleData: Partial<Role>) => {
    return apiUtils.post<ApiResponse<Role>>('/api/roles', roleData);
  },

  // Tìm kiếm role với phân trang
  searchRoles: async (params: SearchParams = {
    searchCondition: {
      keyword: "",
      is_delete: false
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    }
  }) => {
    return apiUtils.post<ApiResponse<Role[]>>('/api/roles/search', params);
  },

  // Lấy tất cả role hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: string) => {
    return apiUtils.get<ApiResponse<Role[]>>('/api/roles/get-all', { params: { keyword } });
  },

  // Lấy thông tin role theo ID
  getRoleById: async (id: string) => {
    return apiUtils.get<ApiResponse<Role>>(`/api/roles/${id}`);
  },

  // Cập nhật thông tin role
  updateRole: async (id: string, roleData: Partial<Role>) => {
    return apiUtils.put<ApiResponse<Role>>(`/api/roles/${id}`, roleData);
  },

  // Xóa role (soft delete)
  deleteRole: async (id: string) => {
    return apiUtils.delete<ApiResponse<Role>>(`/api/roles/${id}`);
  },

  // Khôi phục role đã xóa
  restoreRole: async (id: string) => {
    return apiUtils.put<ApiResponse<Role>>(`/api/roles/${id}/restore`);
  },

  // Kiểm tra mã role đã tồn tại
  checkRoleCode: async (code: string) => {
    return apiUtils.get<ApiResponse<boolean>>(`/api/roles/check-code/${code}`);
  }
};