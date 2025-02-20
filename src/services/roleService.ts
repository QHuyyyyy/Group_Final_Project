import api from '../api/axios';

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

export const roleService = {
  // Lấy tất cả roles hoặc tìm kiếm theo từ khóa
  getAllRoles: async (keyword?: string): Promise<Role[]> => {
    const response = await api.get('/api/roles/get-all', {
      params: { keyword }
    });
    console.log("fetch data:",response.data.success)
    return response.data.data;
  },

};