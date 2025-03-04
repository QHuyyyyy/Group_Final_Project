import { Page, PageInfo } from "./PageModel";
import { SearchClaimLogsCondition } from "./SearchConditionModel";

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

export interface SearchClaimLogsRequest {
    searchCondition: SearchClaimLogsCondition;
    pageInfo: Page;
}

export interface SearchClaimLogsResponse {

        pageData: ClaimLog[];
        pageInfo: PageInfo;

}
