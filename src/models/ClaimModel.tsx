export interface CreateClaim {
    user_id: string;
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_status: string; 
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;  
  is_deleted: boolean;
  remark: string;
  _id: string;
  created_at: string;
  updated_at: string
  __v: number
 
}

export interface CreateClaimRequest {
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  remark: string;
}

export interface CreateClaimResponse {
  success: boolean;
  data: CreateClaim;
}

export interface SearchCondition {
    keyword?: string;
    claim_status: string; 
    claim_start_date: string;
    claim_end_date: string; 
    is_delete: boolean;
}

export interface Page {
    pageNum: number;
    pageSize: number;
}
export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface SearchParams {
    searchCondition: SearchCondition;
    pageInfo: Page;
}

export interface Claim {
    _id: string;
    staff_id: string;
    staff_name: string;
    staff_email: string;
    staff_role: string;
    role_in_project: string;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    
}

export interface SearchResponse {
    success: boolean;
    data: {
        pageData: {
            _id: string;
            claim_name: string;
            total_work_time?: number;
            claim_status?: string;
            project_info?: {
                project_name: string;
            };
        }[];
        pageInfo: PageInfo;
    };
}

export interface ProjectMember {
    user_id: string;
    project_role: string;
}

export interface UpdateClaimData {
    _id: string;
    project_code: string;
    project_name: string;
    project_department: string;
    project_description: string;
    project_members: {
        user_id: string;
        project_role: string;
        _id: string;
    };
    project_start_date: string;
    project_end_date: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}

export interface UpdateClaimResponse {
    success: boolean;
    data: UpdateClaimData;
}

export interface UpdateClaimRequest {
    project_id: string;
    project_code: string;
    project_name: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
}

export interface ChangeClaimStatusRequest {
    claim_id: string;
    claim_status: string;
    comment?: string; 
}

export interface ChangeClaimStatusResponse {
    success: boolean;
    data: {}; 
}


