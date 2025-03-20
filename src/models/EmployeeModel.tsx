export interface Employee {
    _id: string;
    user_id: string;
    job_rank: string;
    contract_type: string;
    account: string;
    address: string;
    phone: string;
    full_name: string;
    avatar_url: string;
    department_name: string;
    department_code: string;
    salary: number;
    start_date: string;
    end_date: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    __v:number;
} 


export interface EmployeeUpdateData {
    user_id?:string
    job_rank?: string;
    account?: string;
    contract_type?: string;
    address?: string;
    phone?: string;
    full_name?: string;
    avatar_url?: string;
    department_code?: string;
    salary?: number;
    start_date?: string;
    end_date?: string;
    updated_by?: string;
}

export interface CreateClaim_EmployeeInfo {
    _id: string;
    user_id: string;
    full_name: string;
    department_code: string;
    job_rank: string;
    contract_type: string;
}


