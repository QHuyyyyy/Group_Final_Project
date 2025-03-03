import api from '../api/axios';
import { SearchClaimLogsRequest, SearchClaimLogsResponse } from '../models/ClaimLogsModel';

export const claimLogService = {
  // Search claim logs with pagination
  searchClaimLogs: async (requestData: SearchClaimLogsRequest): Promise<SearchClaimLogsResponse> => {
    const response = await api.post<SearchClaimLogsResponse>('/api/claim-logs/search', requestData);
    console.log("fetch data:", response.data.data);
    return response.data; // This will now be typed as SearchClaimLogsResponse
  },
};