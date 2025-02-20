// src/services/userService.ts
import api from '../api/axios';
export const userService = {
  createUser: async (userData: any) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  searchUsers: async (params: any) => {
    const response = await api.post('/api/users/search', params);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  changePassword: async (id: string, passwords: any) => {
    const response = await api.put(`/api/users/change-password`, passwords);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/users/change-status`, { id, status });
    return response.data;
  },

  changeRole: async (id: string, role: string) => {
    const response = await api.put(`/api/users/change-role`, { id, role });
    return response.data;
  }
};