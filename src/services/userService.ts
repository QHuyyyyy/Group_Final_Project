// src/services/userService.ts
import api from '../api/axios';
import { CreateUser,  SearchParams, UserResponse, PaginatedResponse,  UpdateUserData, DeleteUserResponse, ChangePasswordRequest,  ChangeStatusRequest,ChangeRoleRequest, ChangeResponse } from '../models/UserModel';


export const userService = {
  createUser: async (userData: CreateUser): Promise<UserResponse> => {
    try {
      const response= await api.post('/api/users', userData);
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; 
    }
  }, 

  searchUsers: async (params: SearchParams): Promise<PaginatedResponse> => {
    const response = await api.post('/api/users/search', params);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await api.get(`/api/users/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  
  updateUser: async (id: string, userData: UpdateUserData): Promise<UserResponse> => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  changePassword: async (password: ChangePasswordRequest): Promise<ChangeResponse> => {
    const response = await api.put(`/api/users/change-password`,password);
    return response.data;
  },


  changeStatus: async (statusData: ChangeStatusRequest): Promise<ChangeResponse> => {
    const response = await api.put(`/api/users/change-status`, statusData);
    return response.data;
  },

  changeRole: async (roleData: ChangeRoleRequest): Promise<ChangeResponse> => {
    const response = await api.put(`/api/users/change-role`, roleData);
    return response.data;
  }
};