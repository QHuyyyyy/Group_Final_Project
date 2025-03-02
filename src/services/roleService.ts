import api from "../api/axios";

interface Role {
  _id: string;
  role_code: string;
  role_name: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

const BASE_URL = "/api/roles"; // Định nghĩa BASE_URL chung

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: string): Promise<Role[]> => {
    const response = await api.get(`${BASE_URL}/get-all`, {
      params: { keyword },
    });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },
};
