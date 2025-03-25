import { apiUtils } from '../api/axios';
import { EMPLOYEES_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { Employee, EmployeeUpdateData } from '../models/EmployeeModel';

export const employeeService = {
  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string, config={}): Promise<ApiResponse<Employee>> => {
    const response = await apiUtils.get<ApiResponse<Employee>>(`${EMPLOYEES_ENDPOINT}/${id}`, {}, config);
    return response.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: EmployeeUpdateData, config={}): Promise<ApiResponse<Employee>> => {
    const response = await  apiUtils.put<ApiResponse<Employee>>(`${EMPLOYEES_ENDPOINT}/${id}`, employeeData || {}, config);
    return response.data;
  }
};