export interface SearchUserCondition {
    keyword?: string;
    role_code?: string;
    is_blocked?: boolean;
    is_delete?: boolean;
    is_verified?: string;
}

export interface SearchProjectCondition {
    keyword?: string;
    project_status?:string;
    project_start_date?: string;
    project_end_date?: string;
    is_delete?: boolean;
}
 
export interface SearchClaimCondition {
    keyword?: string;
    claim_status?: string;
    claim_start_date?: string;
    claim_end_date?: string;
    is_delete?: boolean;
  }

  export interface SearchClaimLogsCondition {
    claim_id?: string;
    is_deleted?: boolean;
}