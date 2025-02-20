import api from '../api/axios';

interface Contract {
    _id: string;
    job_rank: string;
    job_title: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<Contract[]> => {
        const response = await api.get('/api/contracts/get-all', {
            params: { keyword }
        });
        console.log("fetch data:",response.data.success)
        return response.data.data;
    },

};