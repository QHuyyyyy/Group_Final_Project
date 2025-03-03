// src/services/userService.ts
import { apiUtils } from "../api/axios";

interface User {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_blocked: boolean;
  is_verified: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface CreateUser {
  email: string;
  password: string;
  user_name: string;
  role_code: string;
}

interface SearchCondition {
  keyword?: string;
  role_code?: string;
  is_blocked?: boolean;
  is_delete?: boolean;
  is_verified?: string;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

interface UpdateUserData {
  email?: string;
  user_name?: string;
  role_code?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const userService = {
  // Tạo user mới
  createUser: async (userData: CreateUser) => {
    return apiUtils.post<ApiResponse<User>>('/api/users', userData);
  },

  // Tìm kiếm users với phân trang
  searchUsers: async (params: SearchParams = {
    searchCondition: {
      keyword: "",
      role_code: "",
      is_blocked: false,
      is_delete: false,
      is_verified: ""
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    }
  }) => {
    return apiUtils.post<ApiResponse<User[]>>('/api/users/search', params);
  },

  // Lấy thông tin user theo ID
  getUserById: async (id: string) => {
    return apiUtils.get<ApiResponse<User>>(`/api/users/${id}`);
  },

  // Cập nhật thông tin user
  updateUser: async (id: string, userData: UpdateUserData) => {
    return apiUtils.put<ApiResponse<User>>(`/api/users/${id}`, userData);
  },

  // Xóa user (soft delete)
  deleteUser: async (id: string) => {
    return apiUtils.delete<ApiResponse<User>>(`/api/users/${id}`);
  },

  // Đổi mật khẩu
  changePassword: async (old_password: string, new_password: string) => {
    return apiUtils.put<ApiResponse<void>>('/api/users/change-password', {
      old_password,
      new_password
    });
  },

  // Thay đổi trạng thái user
  changeStatus: async (user_id: string, old_status: string, new_status: string) => {
    return apiUtils.put<ApiResponse<User>>('/api/users/change-status', {
      user_id,
      old_status,
      new_status
    });
  },

  // Thay đổi role của user
  changeRole: async (user_id: string, role_code: string) => {
    return apiUtils.put<ApiResponse<User>>('/api/users/change-role', {
      user_id,
      role_code
    });
  }
};