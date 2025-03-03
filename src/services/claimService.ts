import { apiUtils } from "../api/axios";

interface Claim {
  _id: string;
  user_id: string;
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
  project_info: {
    project_name: string;
  }
}

interface SearchCondition {
  keyword?: string;
  claim_start_date?: string;
  claim_end_date?: string;
  claim_status?: string;
  is_delete?: boolean;
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

export const claimService = {
  // Tạo claim mới
  createClaim: async (claimData: Partial<Claim>) => {
    return apiUtils.post<ApiResponse<Claim>>('/api/claims', claimData);
  },

  // Tìm kiếm claims với phân trang
  searchClaims: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<Claim[]>>('/api/claims/search', params);
  },

  // Tìm kiếm claims theo người yêu cầu
  searchClaimsByClaimer: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<Claim[]>>('/api/claims/claimer-search', params);
  },

  // Tìm kiếm claims cần phê duyệt
  searchClaimsForApproval: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<Claim[]>>('/api/claims/approval-search', params);
  },

  // Tìm kiếm claims cho bộ phận tài chính
  searchClaimsForFinance: async (params: SearchParams) => {
    return apiUtils.post<ApiResponse<Claim[]>>('/api/claims/finance-search', params);
  },

  // Lấy thông tin claim theo ID
  getClaimById: async (id: string) => {
    return apiUtils.get<ApiResponse<Claim>>(`/api/claims/${id}`);
  },

  // Cập nhật thông tin claim
  updateClaim: async (id: string, claimData: Partial<Claim>) => {
    return apiUtils.put<ApiResponse<Claim>>(`/api/claims/${id}`, claimData);
  },

  // Thay đổi trạng thái claim
  changeClaimStatus: async (claimId: string, newStatus: string) => {
    return apiUtils.put<ApiResponse<Claim>>('/api/claims/change-status', {
      claim_id: claimId,
      claim_status: newStatus
    });
  }
};