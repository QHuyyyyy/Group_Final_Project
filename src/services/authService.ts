// src/services/authService.ts
import api from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Email, Info, Token } from "../models/AuthModel";

const AUTH_URL = "/api/auth"; // Biến chung để tránh lặp lại URL

export const authService = {
  login: async (credentials: Credentials): Promise<ApiResponse<Token>> => {
    const response = await api.post(`${AUTH_URL}`, credentials);
    console.log("fetch data:", response.data);
    return response.data;
  },

  getinfo: async (): Promise<ApiResponse<Info>> => {
    const response = await api.get(`${AUTH_URL}`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post(`${AUTH_URL}/logout`);
    console.log("fetch data:", response.data);
    return response.data;
  },

  verifyToken: async (token: Token): Promise<ApiResponse<null>> => {
    const response = await api.post(`${AUTH_URL}/verify-token`, { token });
    console.log("fetch data:", response.data);
    return response.data;
  },

  resendToken: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await api.post(`${AUTH_URL}/resend-token`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },

  forgotPassword: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await api.put(`${AUTH_URL}/forgot-password`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },

  triggerVerify: async (email: Email): Promise<ApiResponse<null>> => {
    const response = await api.post(`${AUTH_URL}/trigger-verify-token`, { email });
    console.log("fetch data:", response.data);
    return response.data;
  },
};