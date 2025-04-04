import  { apiUtils } from '../api/axios';
import { CONTRACTS_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { Contract } from '../models/ContractModel';

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<ApiResponse<Contract[]>> => {
        const response = await apiUtils.get<ApiResponse<Contract[]>>(`${CONTRACTS_ENDPOINT}/get-all`, {
            params: keyword ? { keyword } : {},
        });
        return response.data;
    },
};