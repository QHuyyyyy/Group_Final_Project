import api from "../api/axios";



interface SearchCondition {
    keyword?: string;
    claim_start_date?: string;
    claim_end_date?: string;
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


export const claimService = {
    getAllClaims: async (params: SearchParams) => {
        const response = await api.post('/api/claims/search', params)
        console.log(response.data.pageData[0])
        return response.data;
    }
}