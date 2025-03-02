// src/services/authService.ts
import api from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Token } from "../models/AuthModel";

const BASE_URL = "/api/auth";  // Định nghĩa một BASE_URL chung

export const authService = {
  login: async (credentials: Credentials): Promise<ApiResponse<Token>> => {
    const response = await api.post(`${BASE_URL}`, credentials);
    console.log("fetch data:", response.data);
    return response.data;
  },

  getinfo: async () => {
    const response = await api.get(`${BASE_URL}`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  logout: async () => {
    const response = await api.post(`${BASE_URL}/logout`);
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post(`${BASE_URL}/verify-token`, { token });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  resendToken: async (email: string) => {
    const response = await api.post(`${BASE_URL}/resend-token`, { email });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.put(`${BASE_URL}/forgot-password`, { email });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },
};
