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
        console.log(response.data.pageData[0].employee_info)
        return response.data;
    },
    getPendingClaims: async() =>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Pending Approval",
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
    getApprovedClaims: async()=>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Approved",
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
    getRejectedClaims: async()=>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Rejected",
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
    getPaidClaims: async()=>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Paid",
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
    getDraftClaims: async()=>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Draft",
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
    getCanceledClaims: async()=>{
        const response = await api.post('/api/claims/search', {
            searchCondition: {
                keyword: "",
                claim_status:"Canceled",
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
}