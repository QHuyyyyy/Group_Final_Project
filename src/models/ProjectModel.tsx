export interface ProjectMember {
    user_id: string;
    project_role: string;
}

export interface CreateProjectRequest {
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
}

export interface Project {
    _id: string;
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
    created_at: string;
    updated_at: string;
    __v: number;
}

export interface CreateProjectResponse {
    success: boolean;
    data: Project;
}

export interface ProjectMemberInfo {
    user_id: string;
    project_role: string;
    employee_id: string;
    user_name: string;
    full_name: string;
}

export interface ProjectData {
    _id: string;
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_status: string;
    project_start_date: string;
    project_end_date: string;
    project_comment: string | null;
    project_members: ProjectMemberInfo[];
    updated_by: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    
}

export interface SearchCondition {
    keyword?: string;
    project_start_date?: string;
    project_end_date?: string;
    is_delete?: boolean;
}

export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface SearchParams {
    searchCondition: SearchCondition;
    pageInfo: PageInfo;
}

export interface SearchResponse {
    success: boolean;
    data: {
        pageData: ProjectData[];
        pageInfo: PageInfo;
    };
}

export interface ProjectResponse {
    success: boolean;
    data: ProjectData;
}

export interface UpdateProjectRequest {
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: ProjectMember[];
}

export interface ChangeProjectStatusRequest {
    project_id: string;
    project_status: string;
    project_comment?: string; 
}

export interface ChangeProjectStatusResponse {
    success: boolean;
    data: {}; 
}




