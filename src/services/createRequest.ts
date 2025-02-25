import api from '../api/axios';

interface Request {
    user_id: string;
    project_id: string;
    approval_id: string;
    claim_name: string;
    claim_status: "Draft" | "Approved" | "Rejected"; // Thêm các trạng thái khác nếu có
    claim_start_date: Date; // ISO date string
    claim_end_date: Date; // ISO date string
    total_work_time: number;
    is_deleted: boolean;
    _id: string;
    created_at: Date; // ISO date string
    updated_at: Date; // ISO date string
}


async function createRequest(data: Request): Promise<any> {
    try {
        const response = await api.post('/api/claims', data);
        return response.data;
    } catch (error) {
        console.error('Error creating request:', error);
        throw error;
    }
}

export default createRequest;