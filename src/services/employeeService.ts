import api from '../api/axios';
import { EmployeeByIdResponse, EmployeeUpdateData, UpdateEmployeeResponse } from '../models/EmployeeModel';

export const employeeService = {
  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string): Promise<EmployeeByIdResponse> => {
    const response = await api.get(`/api/employees/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: EmployeeUpdateData): Promise<UpdateEmployeeResponse> => {
    const response = await api.put(`/api/employees/${id}`, employeeData);
    console.log("fetch data:", response.data.data);
    return response.data;
  }
};