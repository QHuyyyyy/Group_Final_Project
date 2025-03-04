import  { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Employee, EmployeeUpdateData} from '../models/EmployeeModel';

export const employeeService = {
  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string): Promise<ApiResponse<Employee>> => {
    const response = await apiUtils.get<ApiResponse<Employee>>(`/api/employees/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: EmployeeUpdateData): Promise<ApiResponse<Employee>> => {
    const response = await apiUtils.put<ApiResponse<Employee>>(`/api/employees/${id}`, employeeData);
    console.log("fetch data:", response.data);
    return response.data;
  }
};