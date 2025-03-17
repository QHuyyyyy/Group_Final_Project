import { SearchProjectCondition } from "./SearchConditionModel";
import { PageInfo } from "./PageModel";

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
    project_status: string;
    project_start_date: string;
    project_end_date: string;
    project_comment: string | null;
    project_members: ProjectMember[];
    updated_by: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
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
    __v:number;
}

export interface SearchParams {
    searchCondition: SearchProjectCondition;
    pageInfo: PageInfo;
}

export interface ProjectResponse {
    pageData: ProjectData[];
    pageInfo: PageInfo;
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
    _id: string;
    project_status: string;
    project_comment?: string; 
}

export interface CreateClaim_ProjectData {
    _id: string;
    project_name: string;
    project_department: string;
    project_members: ProjectMemberInfo[];
    project_start_date: string;
    project_end_date: string;
    project_description: string;
}




