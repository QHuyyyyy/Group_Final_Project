import api from "../api/axios";

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

export const claimService = {
  // Tạo claim mới
  createClaim: async (claimData: Partial<Claim>) => {
    const response = await api.post('/api/claims', claimData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims với phân trang
  searchClaims: async (params: SearchParams) => {
    const response = await api.post('/api/claims/search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims theo người yêu cầu
  searchClaimsByClaimer: async (params: SearchParams) => {
    const response = await api.post('/api/claims/claimer-search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims cần phê duyệt
  searchClaimsForApproval: async (params: SearchParams) => {
    const response = await api.post('/api/claims/approval-search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims cho bộ phận tài chính
  searchClaimsForFinance: async (params: SearchParams) => {
    const response = await api.post('/api/claims/finance-search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Lấy thông tin claim theo ID
  getClaimById: async (id: string) => {
    const response = await api.get(`/api/claims/${id}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Cập nhật thông tin claim
  updateClaim: async (id: string, claimData: Partial<Claim>) => {
    const response = await api.put(`/api/claims/${id}`, claimData);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Thay đổi trạng thái claim
  changeClaimStatus: async (claimId: string, newStatus: string) => {
    const response = await api.put('/api/claims/change-status', {
      claim_id: claimId,
      claim_status: newStatus
    });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  }
};