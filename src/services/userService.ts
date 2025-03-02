// src/services/userService.ts
import api from "../api/axios";

interface CreateUser {
  email: string;
  password: string;
  user_name: string;
  role_code: string;
}

interface SearchParams {
  searchCondition: {
    keyword?: string;
    role_code?: string;
    is_blocked?: boolean;
    is_delete?: boolean;
    is_verified?: string;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

interface UpdateUserData {
  email?: string;
  user_name?: string;
  role_code?: string;
}

const BASE_URL = "/api/users"; // Định nghĩa BASE_URL chung

export const userService = {
  // Tạo người dùng mới
  createUser: async (userData: CreateUser) => {
    const response = await api.post(`${BASE_URL}`, userData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm người dùng
  searchUsers: async (params: SearchParams) => {
    const response = await api.post(`${BASE_URL}/search`, params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id: string) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id: string, userData: UpdateUserData) => {
    const response = await api.put(`${BASE_URL}/${id}`, userData);
    return response.data.data;
  },

  // Xóa người dùng
  deleteUser: async (id: string) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  // Thay đổi mật khẩu
  changePassword: async (old_password: string, new_password: string) => {
    const response = await api.put(`${BASE_URL}/change-password`, {
      old_password,
      new_password,
    });
    return response.data.data;
  },

  // Thay đổi trạng thái người dùng (bị khóa hoặc mở khóa)
  changeStatus: async ({
    user_id,
    is_blocked,
  }: {
    user_id: string;
    is_blocked: boolean;
  }) => {
    const response = await api.put(`${BASE_URL}/change-status`, {
      user_id,
      is_blocked,
    });
    return response.data;
  },

  // Thay đổi vai trò của người dùng
  changeRole: async (user_id: string, role_code: string) => {
    const response = await api.put(`${BASE_URL}/change-role`, {
      user_id,
      role_code,
    });
    return response.data;
  },
};
