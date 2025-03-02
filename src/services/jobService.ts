import api from "../api/axios";

interface Job {
    _id: string;
    job_rank: string;
    job_title: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}

const BASE_URL = "/api/jobs"; // Định nghĩa BASE_URL chung

export const jobService = {
    // Lấy tất cả jobs hoặc tìm kiếm theo từ khóa
    getAllJobs: async (keyword?: string): Promise<Job[]> => {
        const response = await api.get(`${BASE_URL}/get-all`, {
            params: { keyword },
        });
        console.log("fetch data:", response.data.data);
        return response.data.data;
    },
};
