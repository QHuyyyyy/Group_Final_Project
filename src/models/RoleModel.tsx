export interface Role {
  _id: string;
  role_code: string; 
  role_name: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}


export type RoleTypes = {
  ADMIN_ROLE: string;
  FINANCE: string;
  APPROVAL_ROLE: string;
  CLAIMER_ROLE: string;
}

