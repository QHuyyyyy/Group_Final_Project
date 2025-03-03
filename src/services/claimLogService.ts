import { apiUtils } from "../api/axios";

interface ClaimLog {
  _id: string;
  claim_id: string;
  user_id: string;
  action: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface SearchCondition {
  claim_id?: string;
  is_deleted?: boolean;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const claimLogService = {
  // Tạo log mới
  createLog: async (logData: Partial<ClaimLog>) => {
    return apiUtils.post<ApiResponse<ClaimLog>>('/api/claim-logs', logData);
  },

  // Tìm kiếm logs
  searchClaimLogs: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<ClaimLog[]>>('/api/claim-logs/search', params);
  },

  // Lấy log theo ID
  getLogById: async (id: string) => {
    return apiUtils.get<ApiResponse<ClaimLog>>(`/api/claim-logs/${id}`);
  },

  // Lấy logs theo claim ID
  getLogsByClaimId: async (claimId: string) => {
    return apiUtils.get<ApiResponse<ClaimLog[]>>(`/api/claim-logs/claim/${claimId}`);
  },

  // Cập nhật log
  updateLog: async (id: string, logData: Partial<ClaimLog>) => {
    return apiUtils.put<ApiResponse<ClaimLog>>(`/api/claim-logs/${id}`, logData);
  },

  // Xóa log (soft delete)
  deleteLog: async (id: string) => {
    return apiUtils.delete<ApiResponse<ClaimLog>>(`/api/claim-logs/${id}`);
  }
};