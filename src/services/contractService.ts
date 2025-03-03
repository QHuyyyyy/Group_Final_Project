import api from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Contract } from '../models/ContractModel';

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<ApiResponse<Contract[]>> => {
        const response = await api.get('/api/contracts/get-all', {
            params: { keyword }
        });
        console.log("fetch data:", response.data);
        return response.data;
    },

};