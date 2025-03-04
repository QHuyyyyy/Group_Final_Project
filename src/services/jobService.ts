import { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { Job } from '../models/JobModel';


export const jobService = {
    getAllJobs: async (keyword?: string): Promise<ApiResponse<Job[]>> => {
        const response = await apiUtils.get<ApiResponse<Job[]>>('/api/jobs/get-all', {
            params: { keyword }
        });
        console.log("fetch data:", response.data);
        return response.data;
    },
}