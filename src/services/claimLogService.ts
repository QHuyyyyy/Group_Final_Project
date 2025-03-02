import api from "../api/axios";

// Thêm interface cho request search logs
interface SearchLogsParams {
  searchCondition: {
    claim_id?: string;
    is_deleted?: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

const BASE_URL = "/api/claim-logs"; // Định nghĩa BASE_URL chung

// Thêm function search logs vào claimLogService
export const claimLogService = {
  // ... các function khác

  searchClaimLogs: async (params: SearchLogsParams) => {
    const response = await api.post(`${BASE_URL}/search`, params);
    console.log(response.data.data);
    return response.data.data;
  },
};
