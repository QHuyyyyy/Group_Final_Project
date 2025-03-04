import api from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { SearchClaimLogsRequest, SearchClaimLogsResponse } from '../models/ClaimLogsModel';

export const claimLogService = {
  // Search claim logs with pagination
  searchClaimLogs: async (requestData: SearchClaimLogsRequest): Promise<ApiResponse<SearchClaimLogsResponse>> => {
    const response = await api.post<ApiResponse<SearchClaimLogsResponse>>('/api/claim-logs/search', requestData);
    console.log("fetch data:", response.data);
    return response.data; // This will now be typed as SearchClaimLogsResponse
  },
};