import api from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Role, RoleTypes } from '../models/RoleModel';

const ROLES_ENDPOINT = '/api/roles';

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: RoleTypes): Promise<ApiResponse<Role[]>> => {
    try {
      const response = await api.get(`${ROLES_ENDPOINT}/get-all`, {
        params: keyword ? { keyword } : {},
      });
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};