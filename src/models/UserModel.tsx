export interface CreateUser{
    email: string;
    password: string;
    user_name: string;
    role_code: string;
}

export interface UserData{
    _id: string;
    email: string;
    user_name: string;
    role_code:string;
    is_verified:boolean;
    verification_token:string;
    verification_token_expires:string;
    token_version:number;
    is_blocked:boolean;
    created_at:string;
    updated_at:string;
    is_deleted:boolean;
    __v:number
}

export interface SearchCondition {
    keyword?: string;
    role_code?: string;
    is_blocked?: boolean;
    is_delete?: boolean;
    is_verified?: string;
}

export interface Page {
    pageNum: number;
    pageSize: number;
}

export interface SearchParams {
    searchCondition: SearchCondition;
    pageInfo: Page;
}

export interface User {
    _id: string;
    email: string;
    user_name: string;
    role_code: string;
    is_verified: boolean;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    token_version: number;
}

export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;  
    totalPages: number;
}

export interface UpdateUserData {
    email?: string;     
    user_name?: string;  
}

export interface PaginatedResponse {
    success: boolean;
    data: {
        pageData: User[];
        pageInfo: PageInfo;
    };
}

export interface UserResponse {
    success: boolean;
    data: UserData;
}
export interface DeleteUserResponse {
    success: boolean;
    data: {};
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface ChangeStatusRequest {
    user_id: string;
    is_blocked: boolean;
}

export interface ChangeRoleRequest {
    user_id: string;
    role_code: string;
}
export interface ChangeResponse {
    success: boolean;
    data: {};
}


