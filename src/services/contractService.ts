import api from "../api/axios";

interface Contract {
    _id: string;
    job_rank: string;
    job_title: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}

const BASE_URL = "/api/contracts"; // Định nghĩa BASE_URL chung

export const contractService = {
    // Lấy tất cả contracts hoặc tìm kiếm theo từ khóa
    getAllContracts: async (keyword?: string): Promise<Contract[]> => {
        const response = await api.get(`${BASE_URL}/get-all`, {
            params: { keyword },
        });
        console.log("fetch data:", response.data.data);
        return response.data.data;
    },
};
