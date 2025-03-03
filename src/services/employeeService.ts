import { apiUtils } from "../api/axios";

interface Employee {
  _id: string;
  user_id: string;
  job_rank: string;
  contract_type: string;
  account: string;
  address: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  department_name: string;
  salary: number;
  start_date: string;
  end_date: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  __v: number;
}

interface SearchCondition {
  keyword?: string;
  department_name?: string;
  is_deleted?: boolean;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const employeeService = {
  // Tạo nhân viên mới
  createEmployee: async (employeeData: Partial<Employee>) => {
    return apiUtils.post<ApiResponse<Employee>>('/api/employees', employeeData);
  },

  // Tìm kiếm nhân viên với phân trang
  searchEmployees: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<Employee[]>>('/api/employees/search', params);
  },

  // Lấy tất cả nhân viên
  getAllEmployees: async () => {
    return apiUtils.get<ApiResponse<Employee[]>>('/api/employees/get-all');
  },

  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string) => {
    return apiUtils.get<ApiResponse<Employee>>(`/api/employees/${id}`);
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: Partial<Employee>) => {
    return apiUtils.put<ApiResponse<Employee>>(`/api/employees/${id}`, employeeData);
  },

  // Xóa nhân viên (soft delete)
  deleteEmployee: async (id: string) => {
    return apiUtils.delete<ApiResponse<Employee>>(`/api/employees/${id}`);
  },

  // Khôi phục nhân viên đã xóa
  restoreEmployee: async (id: string) => {
    return apiUtils.put<ApiResponse<Employee>>(`/api/employees/${id}/restore`);
  },

  // Upload avatar nhân viên
  uploadAvatar: async (id: string, file: File) => {
    return apiUtils.uploadFiles<ApiResponse<{ avatar_url: string }>>(`/api/employees/${id}/avatar`, file);
  }
};