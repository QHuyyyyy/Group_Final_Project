// src/services/authService.ts
import  { apiUtils } from "../api/axios";
import { AUTH_URL } from "../constants/authURL";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Info, Token } from "../models/AuthModel";

export const authService = {
  login: async (credentials: Credentials, config={}): Promise<ApiResponse<Token>> => {
    const response = await apiUtils.post<ApiResponse<Token>> (`${AUTH_URL}`, credentials || {}, config);
    
    return response.data
  },

  getinfo: async (): Promise<ApiResponse<Info>> => {
    const response = await apiUtils.get<ApiResponse<Info>>(`${AUTH_URL}`);
    
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/logout`);
    
    return response.data;
  },

  verifyToken: async (token: string): Promise<ApiResponse<null>> => {

    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/verify-token`, { token } );
    
    return response.data;
  },

  resendToken: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/resend-token`, { email });
    
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${AUTH_URL}/forgot-password`, { email });
    
    return response.data;
  },

  triggerVerify: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/trigger-verify-token`, { email });
    
    return response.data;
  },
};