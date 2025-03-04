// src/services/authService.ts
import  { apiUtils } from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Email, Info, Token } from "../models/AuthModel";

export const authService = {
  login: async (credentials: Credentials) : Promise<ApiResponse<Token>> => {
    const response = await apiUtils.post<ApiResponse<Token>>("/api/auth", credentials);
    console.log("fetch data:", response.data);
    return response.data;
  },     
  getinfo: async () : Promise<ApiResponse<Info>> => {
    const response = await apiUtils.get<ApiResponse<Info>>("/api/auth");
    console.log("fetch data:", response.data);
    return response.data;
  },

  logout: async () : Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>("/api/auth/logout");
    console.log("fetch data:", response.data);
    return response.data;
  },

  verifyToken: async (token: Token) : Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>("/api/auth/verify-token", token);
    console.log("fetch data:", response.data);
    return response.data;
  },

  resendToken: async (email: Email) : Promise<ApiResponse<null>> =>  {
    const response = await apiUtils.post<ApiResponse<null>>("/api/auth/resend-token", email);
    console.log("fetch data:", response.data);
    return response.data;
  },

  forgotPassword: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await apiUtils.put<ApiResponse<null>>("/api/auth/forgot-password", email);
    console.log("fetch data:", response.data);
    return response.data;
  },
  triggerVerify: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await apiUtils.post<ApiResponse<null>>("/api/auth/trigger-verify-token", email);
    console.log("fetch data:", response.data); 
    return response.data;
  },
};
