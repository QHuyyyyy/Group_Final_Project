export interface ClaimLog {
    _id: string;
    claim_name: string;
    updated_by: string;
    old_status: string;
    new_status: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
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

export interface SearchCondition {
    claim_id?: string;
    is_deleted?: boolean;
}

export interface SearchClaimLogsRequest {
    searchCondition: SearchCondition;
    pageInfo: Page;
}

export interface SearchClaimLogsResponse {

        pageData: ClaimLog[];
        pageInfo: PageInfo;

}
