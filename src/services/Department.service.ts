import  { apiUtils } from '../api/axios';
import { DEPARTMENT_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { DepartmentModel } from '../models/DepartmentModel';


export const departmentService = {
    // Lấy tất cả departments hoặc tìm kiếm theo từ khóa
    getAllDepartments: async (keyword?: string): Promise<ApiResponse<DepartmentModel[]>> => {
        const response = await apiUtils.get<ApiResponse<DepartmentModel[]>>(`${DEPARTMENT_ENDPOINT}/get-all`, {
            params: keyword ? { keyword } : {},
        });
        return response.data;
    },
};