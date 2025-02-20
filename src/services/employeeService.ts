import api from '../api/axios';

interface EmployeeUpdateData {
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
}
interface Employee {
    _id: string;
    username: string;
    staffName: string;
    email: string;
    phone: string;
    department: string;
    jobRank: string;
    salary: number;
    address: string;
    role: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  }

export const employeeService = {
  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/api/employees/${id}`);
    console.log("fetch data:",response.data.success)
    return response.data.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: EmployeeUpdateData): Promise<Employee> => {
    const response = await api.put(`/api/employees/${id}`, employeeData);
    console.log("fetch data:",response.data.success)
    return response.data.data;
  }
};