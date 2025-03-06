// src/services/authService.ts
import  { apiUtils } from "../api/axios";
import { AUTH_URL } from "../constants/authURL";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Email, Info, Token } from "../models/AuthModel";

export const authService = {
  login: async (credentials: Credentials): Promise<ApiResponse<Token>> => {
    const response = await apiUtils.post<ApiResponse<Token>> (`${AUTH_URL}`, credentials);
    console.log("fetch data:", response.data);
    return response.data
  },

  getinfo: async (): Promise<ApiResponse<Info>> => {
    const response = await apiUtils.get<ApiResponse<Info>>(`${AUTH_URL}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/logout`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  verifyToken: async (token: string): Promise<ApiResponse<null>> => {

    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/verify-token`, { token } );
    console.log("fetch data:", response.data);
    return response.data;
  },

  resendToken: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/resend-token`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },

  forgotPassword: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>(`${AUTH_URL}/forgot-password`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },

  triggerVerify: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>(`${AUTH_URL}/trigger-verify-token`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },
};