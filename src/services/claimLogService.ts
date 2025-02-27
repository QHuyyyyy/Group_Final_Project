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
  
  // Thêm function search logs vào claimService
  export const claimLogService = {
    // ... các function khác
  
    searchClaimLogs: async (params: SearchLogsParams) => {
      const response = await api.post('/api/claim-logs/search', params);
      console.log(response.data.data)
      return response.data.data;
    }
  };