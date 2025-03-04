import api from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Role, RoleTypes } from '../models/RoleModel';

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: RoleTypes): Promise<ApiResponse<Role[]>> => {
    try {
      const response = await api.get('/api/roles/get-all', {
        params: { keyword }
      });
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};