// src/services/userService.ts
import  { apiUtils } from '../api/axios';
import { USERS_ENDPOINT } from '../constants/authURL';
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

export const userService = {
  // Tạo người dùng mới
  createUser: async (userData: CreateUser, config = {}): Promise<ApiResponse<UserData>> => {
    try {
      const response = await apiUtils.post<ApiResponse<UserData>>(`${USERS_ENDPOINT}`, userData || {}, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm người dùng với phân trang
  searchUsers: async (params: SearchParams, config = {}): Promise<ApiResponse<PaginatedResponse>> => {
    const response = await apiUtils.post<ApiResponse<PaginatedResponse>>(`${USERS_ENDPOINT}/search`, params || {}, config);

    return response.data;
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id: string, config={}): Promise<ApiResponse<UserData>> => {
    const response = await apiUtils.get<ApiResponse<UserData>>(`${USERS_ENDPOINT}/${id}`, {}, config);

    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id: string, userData: UpdateUserData, config = {}): Promise<ApiResponse<UserData>> => {
    const response = await apiUtils.put<ApiResponse<UserData>>(`${USERS_ENDPOINT}/${id}`, userData || {}, config);

    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id: string, config = {showSpinner:false}): Promise<ApiResponse<null>> => {
    const response = await apiUtils.delete<ApiResponse<null>>(`${USERS_ENDPOINT}/${id}`, config);

    return response.data;
  },

  // Thay đổi mật khẩu người dùng
  changePassword: async (password: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${USERS_ENDPOINT}/change-password`, password);

    return response.data;
  },

  // Thay đổi trạng thái người dùng
  changeStatus: async (statusData: ChangeStatusRequest, config = {}): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${USERS_ENDPOINT}/change-status`, statusData || {}, config);

    return response.data;
  },

  // Thay đổi vai trò người dùng
  changeRole: async (roleData: ChangeRoleRequest, config = {}): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${USERS_ENDPOINT}/change-role`, roleData || {}, config);

    return response.data;
  }
};