import { apiUtils } from '../api/axios';
import { ROLES_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { Role, RoleTypes } from '../models/RoleModel';

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: RoleTypes): Promise<ApiResponse<Role[]>> => {
    try {
      const response = await apiUtils.get<ApiResponse<Role[]>>(`${ROLES_ENDPOINT}/get-all`, {
        params: keyword ? { keyword } : {}
      });
   
      return response.data;
    } catch (error) {
   
      throw error;
    }
  },
};