import { apiUtils } from '../api/axios';
import { ROLES_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { Role, RoleTypes } from '../models/RoleModel';

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: RoleTypes, config = {showSpinner:false}): Promise<ApiResponse<Role[]>> => {
    try {
      const response = await apiUtils.get<ApiResponse<Role[]>>(`${ROLES_ENDPOINT}/get-all`, {
        params: keyword ? { keyword } : {}, config
      });
      console.log("fetch data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};