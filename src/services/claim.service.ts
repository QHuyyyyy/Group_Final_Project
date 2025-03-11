import api, { apiUtils } from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { CreateClaimRequest, SearchParams, SearchResponse, UpdateClaimRequest,  ChangeClaimStatusRequest, CreateClaim, ClaimById } from "../models/ClaimModel";

export const claimService = {
  // Tạo claim mới
  createClaim: async (claimData: CreateClaimRequest, config={}): Promise<ApiResponse<CreateClaim>> => {
    const response = await apiUtils.post<ApiResponse<CreateClaim>>('/api/claims', claimData || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims với phân trang
  searchClaims: async (params: SearchParams, config={}) /*Promise<ApiResponse<SearchResponse>> */ => {
    const response = await api.post('/api/claims/search', params || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims theo người yêu cầu
  searchClaimsByClaimer: async (params: SearchParams, config={}): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/claimer-search', params || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims cần phê duyệt
  searchClaimsForApproval: async (params: SearchParams, config={}): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/approval-search', params || {}, config );
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Tìm kiếm claims cho bộ phận tài chính
  searchClaimsForFinance: async (params: SearchParams, config={}): Promise<ApiResponse<SearchResponse>> => {
    const response = await  apiUtils.post<ApiResponse<SearchResponse>>('/api/claims/finance-search', params || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Lấy thông tin claim theo ID
  getClaimById: async (id: string, config={}): Promise<ApiResponse<ClaimById>> => {
    const response = await  apiUtils.get<ApiResponse<ClaimById>>(`/api/claims/${id}`, {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Cập nhật thông tin claim
  updateClaim: async (id: string, claimData: UpdateClaimRequest, config={}) => {
    const response = await  apiUtils.put(`/api/claims/${id}`, claimData || {}, config);
    console.log("fetch data:", response.data);
    return response.data;
  },

  // Thay đổi trạng thái claim
  changeClaimStatus: async (requestBody: ChangeClaimStatusRequest, config={}): Promise<ApiResponse<null>> => {
    const response = await  api.put('/api/claims/change-status', requestBody || {}, config);

    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  getPendingClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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
  
  getApprovedClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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

  getRejectedClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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

  getPaidClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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

  getDraftClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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
  
  getCanceledClaims: async (): Promise<ApiResponse<SearchResponse>> => {
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
    return response.data;
  },
  getPendingApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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
  
  getApprovedApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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

  getRejectedApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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

  getPaidApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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

  getDraftApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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
  
  getCanceledApprovalClaims: async (): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.post('/api/claims/approval-search', {
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
    return response.data;
  }
};