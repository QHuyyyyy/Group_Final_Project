import api from "../api/axios";

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

const BASE_URL = "/api/employees"; // Định nghĩa BASE_URL chung

export const employeeService = {
  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, employeeData: EmployeeUpdateData): Promise<Employee> => {
    const response = await api.put(`${BASE_URL}/${id}`, employeeData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },
};
