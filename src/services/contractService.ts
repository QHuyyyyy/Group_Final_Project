import api from '../api/axios';
import { ContractsResponse } from '../models/ContractModel';

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<ContractsResponse> => {
        const response = await api.get('/api/contracts/get-all', {
            params: { keyword }
        });
        console.log("fetch data:", response.data.data);
        return response.data;
    },

};