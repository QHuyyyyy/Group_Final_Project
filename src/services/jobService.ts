import api from '../api/axios';
import { GetAllJobsResponse } from '../models/JobModel';

export const jobService = {
    getAllJobs: async (keyword?: string): Promise<GetAllJobsResponse> => {
        const response = await api.get('/api/jobs/get-all', {
            params: { keyword }
        });
        console.log("fetch data:", response.data.data);
        return response.data;
    },
}