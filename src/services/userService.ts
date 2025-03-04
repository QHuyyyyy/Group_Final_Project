// src/services/userService.ts
import api from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import {
  CreateUser,
  SearchParams,
  PaginatedResponse,
  UpdateUserData,
  ChangePasswordRequest,
  ChangeStatusRequest,
  ChangeRoleRequest,
  UserData
} from '../models/UserModel';

const USERS_ENDPOINT = '/api/users';

export const userService = {
  // Tạo người dùng mới
  createUser: async (userData: CreateUser): Promise<ApiResponse<UserData>> => {
    try {
      const response = await api.post(`${USERS_ENDPOINT}`, userData);
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Tìm kiếm người dùng với phân trang
  searchUsers: async (params: SearchParams): Promise<ApiResponse<PaginatedResponse>> => {
    const response = await api.post(`${USERS_ENDPOINT}/search`, params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id: string): Promise<ApiResponse<UserData>> => {
    const response = await api.get(`${USERS_ENDPOINT}/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id: string, userData: UpdateUserData): Promise<ApiResponse<UserData>> => {
    const response = await api.put(`${USERS_ENDPOINT}/${id}`, userData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`${USERS_ENDPOINT}/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi mật khẩu người dùng
  changePassword: async (password: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await api.put(`${USERS_ENDPOINT}/change-password`, password);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi trạng thái người dùng
  changeStatus: async (statusData: ChangeStatusRequest): Promise<ApiResponse<null>> => {
    const response = await api.put(`${USERS_ENDPOINT}/change-status`, statusData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi vai trò người dùng
  changeRole: async (roleData: ChangeRoleRequest): Promise<ApiResponse<null>> => {
    const response = await api.put(`${USERS_ENDPOINT}/change-role`, roleData);
    console.log("fetch data:", response.data);
    return response.data;
  }
};