// Interface cho response của getClaimById
export interface CreateClaim {
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
  }
  
  // Interface cho response của searchClaims
  export interface Claim {
    _id: string;
    staff_id: string;
    staff_name: string;
    staff_email: string;
    staff_role: string | null;
    employee_info: any | null;
    approval_info: {
      _id: string;
      email: string;
      user_name: string;
      role_code: string;
      is_verified: boolean;
      is_blocked: boolean;
      is_deleted: boolean;
      created_at: string;
      updated_at: string;
      __v: number;
    };
    project_info: {
      _id: string;
      project_name: string;
      project_code: string;
      project_department: string;
      project_description: string;
      project_members: {
        user_id: string;
        project_role: string;
        _id: string;
      }[];
      project_status: string;
      project_start_date: string;
      project_end_date: string;
      updated_by: string;
      is_deleted: boolean;
      created_at: string;
      updated_at: string;
      __v: number;
      project_comment: string;
    };
    role_in_project: string | null;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    claim_status: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface SearchResponse {
    pageData: Claim[];
    pageInfo: PageInfo;
  }
  
  export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  
  export interface SearchCondition {
    keyword?: string;
    claim_status?: string;
    claim_start_date?: string;
    claim_end_date?: string;
    is_delete?: boolean;
  }
  
  export interface SearchParams {
    searchCondition: SearchCondition;
    pageInfo: {
      pageNum: number;
      pageSize: number;
    };
  }
  
  export interface CreateClaimRequest {
    project_id: string;
    approval_id: string;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    total_work_time: number;
    remark?: string;
  }
  
  export interface UpdateClaimRequest {
    project_id: string;
    approval_id: string;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    total_work_time: number;
    remark?: string;
  }
  
  export interface ChangeClaimStatusRequest {
    _id: string;
    claim_status: string;
    comment?: string;
  }
    
  export interface ClaimById {
    _id: string;
    user_id: string;
    project_id: string;
    approval_id: string;
    claim_name:string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    total_work_time: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
   }