import { apiUtils } from '../api/axios';
import { CLAIM_LOGS_ENDPOINT } from '../constants/authURL';
import { ApiResponse } from '../models/ApiResponse';
import { SearchClaimLogsRequest, SearchClaimLogsResponse } from '../models/ClaimLogsModel';

export const claimLogService = {
  // Search claim logs with pagination
  searchClaimLogs: async (requestData: SearchClaimLogsRequest, config = {}): Promise<ApiResponse<SearchClaimLogsResponse>> => {
    const response = await apiUtils.post<ApiResponse<SearchClaimLogsResponse>>(`${CLAIM_LOGS_ENDPOINT}/search`, requestData || {}, config);
    console.log("fetch data:", response.data); // Log dữ liệu phản hồi để debug
    return response.data;
  },
};