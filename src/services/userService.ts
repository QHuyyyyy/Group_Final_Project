// src/services/userService.ts
import api from '../api/axios';
interface createUser {
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
export const userService = {
  createUser: async (userData: createUser) => {
    const response = await api.post('/api/users', userData);
    console.log("fetch data:",response.data)
    return response.data;
  },

  searchUsers: async (params: SearchParams) => {
    const response = await api.post('/api/users/search', params);
    console.log("fetch data:",response.data)
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    console.log("fetch data:",response.data)
    return response.data;
  },

  updateUser: async (id: string, userData: UpdateUserData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  changePassword: async ( old_password: string, new_password: string) => {
    const response = await api.put(`/api/users/change-password`, {old_password,new_password});
    return response.data;
  },

  changeStatus: async ({ user_id, is_blocked }: { user_id: string; is_blocked: boolean }) => {
    const response = await api.put(`/api/users/change-status`, { user_id, is_blocked });
    return response.data;
  },

  changeRole: async (user_id: string, role_code: string) => {
    const response = await api.put(`/api/users/change-role`, { user_id, role_code });
    return response.data;
  }
};