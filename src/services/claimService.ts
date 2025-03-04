import api, { apiUtils } from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { CreateClaimRequest, SearchParams, SearchResponse, UpdateClaimRequest,  ChangeClaimStatusRequest, CreateClaim, ClaimById } from "../models/ClaimModel";

export const claimService = {
  // Tạo claim mới
  createClaim: async (claimData: CreateClaimRequest): Promise<ApiResponse<CreateClaim>> => {
    const response = await apiUtils.post<ApiResponse<CreateClaim>>('/api/claims', claimData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims với phân trang
  searchClaims: async (params: SearchParams) => {
    const response = await  apiUtils.post('/api/claims/search', params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims theo người yêu cầu
  searchClaimsByClaimer: async (params: SearchParams): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/claimer-search', params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims cần phê duyệt
  searchClaimsForApproval: async (params: SearchParams): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/approval-search', params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims cho bộ phận tài chính
  searchClaimsForFinance: async (params: SearchParams): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/finance-search', params);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Lấy thông tin claim theo ID
  getClaimById: async (id: string): Promise<ApiResponse<ClaimById>> => {
    const response = await  apiUtils.get<ApiResponse<ClaimById>>(`/api/claims/${id}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin claim
  updateClaim: async (id: string, claimData: UpdateClaimRequest) => {
    const response = await  apiUtils.put(`/api/claims/${id}`, claimData);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi trạng thái claim
  changeClaimStatus: async (requestBody: ChangeClaimStatusRequest): Promise<ApiResponse<null>> => {
    const response = await  api.put('/api/claims/change-status', requestBody);

    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  getPendingClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Pending Approval",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
    return response.data;
  },
  
  getApprovedClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Approved",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
    return response.data;
  },

  getRejectedClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Rejected",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
    return response.data;
  },

  getPaidClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Paid",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
    return response.data;
  },

  getDraftClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Draft",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
    return response.data;
  },
  
  getCanceledClaims: async () => {
    const response = await api.post('/api/claims/search', {
      searchCondition: {
        keyword: "",
        claim_status: "Canceled",
        claim_start_date: "",
        claim_end_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })

    console.log("fetch data:", response.data);

    return response.data;
  }

};
