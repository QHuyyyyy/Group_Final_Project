import  { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Contract } from '../models/ContractModel';

const CONTRACTS_ENDPOINT = '/api/contracts';

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<ApiResponse<Contract[]>> => {
        const response = await apiUtils.get<ApiResponse<Contract[]>>(`${CONTRACTS_ENDPOINT}/get-all`, {
            params: keyword ? { keyword } : {},
        });
        console.log("fetch data:", response.data);
        return response.data;
    },
};