import { apiUtils } from '../api/axios';
import { JOB_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { Job } from '../models/JobModel';

export const jobService = {
    getAllJobs: async (keyword?: string): Promise<ApiResponse<Job[]>> => {
        const response = await apiUtils.get<ApiResponse<Job[]>>(`${JOB_ENDPOINT}/get-all`, {
            params: { keyword }
        });
        console.log("fetch data:", response.data);
        return response.data;
    },
}