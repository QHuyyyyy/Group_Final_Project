// src/services/userService.ts
import  { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { CreateUser,  SearchParams, PaginatedResponse,  UpdateUserData, ChangePasswordRequest,  ChangeStatusRequest,ChangeRoleRequest, UserData } from '../models/UserModel';


export const userService = {
  createUser: async (userData: CreateUser): Promise<ApiResponse<UserData>> => {
    try {
      const response= await apiUtils.post<ApiResponse<UserData>> ('/api/users', userData);
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; 
    }
  }, 

  searchUsers: async (params: SearchParams): Promise<ApiResponse<PaginatedResponse>> => {
    const response = await apiUtils.post<ApiResponse<PaginatedResponse>>('/api/users/search', params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<UserData>> => {
    const response = await apiUtils.get<ApiResponse<UserData>> (`/api/users/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  
  updateUser: async (id: string, userData: UpdateUserData): Promise<ApiResponse<UserData>> => {
    const response = await apiUtils.put<ApiResponse<UserData>>(`/api/users/${id}`, userData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.delete<ApiResponse<null>>(`/api/users/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  changePassword: async (password: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`/api/users/change-password`,password);
    console.log("fetch data:", response.data);
    return response.data;
  },

  changeStatus: async (statusData: ChangeStatusRequest): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`/api/users/change-status`, statusData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  changeRole: async (roleData: ChangeRoleRequest): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`/api/users/change-role`, roleData);
    console.log("fetch data:", response.data);
    return response.data;
  }
};