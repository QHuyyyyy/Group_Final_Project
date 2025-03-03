import api from '../api/axios';
import { Role, RoleTypes } from '../models/RoleModel';

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: RoleTypes): Promise<Role[]> => {
    try {
      const response = await api.get('/api/roles/get-all', {
        params: { keyword }
      });
      console.log("fetch data:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};