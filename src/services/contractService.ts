import { apiUtils } from "../api/axios";

interface Contract {
    _id: string;
    job_rank: string;
    job_title: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}

interface SearchCondition {
    keyword?: string;
    is_deleted?: boolean;
}

interface PageInfo {
    pageNum: number;
    pageSize: number;
}

interface SearchParams {
    searchCondition: SearchCondition;
    pageInfo: PageInfo;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const contractService = {
    // Tạo hợp đồng mới
    createContract: async (contractData: Partial<Contract>) => {
        return apiUtils.post<ApiResponse<Contract>>('/api/contracts', contractData);
    },

    // Tìm kiếm hợp đồng với phân trang
    searchContracts: async (params: SearchParams) => {
        return apiUtils.post<ApiResponse<Contract[]>>('/api/contracts/search', params);
    },

    // Lấy tất cả hợp đồng hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string) => {
        return apiUtils.get<ApiResponse<Contract[]>>('/api/contracts/get-all', { params: { keyword } });
    },

    // Lấy thông tin hợp đồng theo ID
    getContractById: async (id: string) => {
        return apiUtils.get<ApiResponse<Contract>>(`/api/contracts/${id}`);
    },

    // Cập nhật thông tin hợp đồng
    updateContract: async (id: string, contractData: Partial<Contract>) => {
        return apiUtils.put<ApiResponse<Contract>>(`/api/contracts/${id}`, contractData);
    },

    // Xóa hợp đồng (soft delete)
    deleteContract: async (id: string) => {
        return apiUtils.delete<ApiResponse<Contract>>(`/api/contracts/${id}`);
    },

    // Khôi phục hợp đồng đã xóa
    restoreContract: async (id: string) => {
        return apiUtils.put<ApiResponse<Contract>>(`/api/contracts/${id}/restore`);
    }
};