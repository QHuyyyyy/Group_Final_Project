import { apiUtils } from '../api/axios';
import { ApiResponse } from '../models/ApiResponse';
import { SearchClaimLogsRequest, SearchClaimLogsResponse } from '../models/ClaimLogsModel';

const CLAIM_LOGS_ENDPOINT = '/api/claim-logs';

export const claimLogService = {
  // Search claim logs with pagination
  searchClaimLogs: async (requestData: SearchClaimLogsRequest): Promise<ApiResponse<SearchClaimLogsResponse>> => {
    const response = await apiUtils.post<ApiResponse<SearchClaimLogsResponse>>(`${CLAIM_LOGS_ENDPOINT}/search`, requestData);
    console.log("fetch data:", response.data); // Log dữ liệu phản hồi để debug
    return response.data;
  },
};