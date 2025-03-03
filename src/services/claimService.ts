import api from "../api/axios";
import { CreateClaimRequest, CreateClaimResponse, SearchParams, SearchResponse, UpdateClaimRequest, UpdateClaimResponse, ChangeClaimStatusRequest, ChangeClaimStatusResponse } from "../models/ClaimModel";

export const claimService = {
  // Tạo claim mới
  createClaim: async (claimData: CreateClaimRequest): Promise<CreateClaimResponse> => {
    const response = await api.post('/api/claims', claimData);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  // Tìm kiếm claims với phân trang
  searchClaims: async (params: SearchParams) => {
    const response = await api.post('/api/claims/search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims theo người yêu cầu
  searchClaimsByClaimer: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.post('/api/claims/claimer-search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims cần phê duyệt
  searchClaimsForApproval: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.post('/api/claims/approval-search', params);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  // Tìm kiếm claims cho bộ phận tài chính
  searchClaimsForFinance: async (params: SearchParams): Promise<SearchResponse> => {
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
  updateClaim: async (id: string, claimData: UpdateClaimRequest): Promise<UpdateClaimResponse> => {
    const response = await api.put(`/api/claims/${id}`, claimData);
    console.log("fetch data:", response.data.data);
    return response.data;
  },

  // Thay đổi trạng thái claim
  changeClaimStatus: async (requestBody: ChangeClaimStatusRequest): Promise<ChangeClaimStatusResponse> => {
    const response = await api.put('/api/claims/change-status', requestBody);
    console.log("fetch data:", response.data.data);
    return response.data;
  }
};