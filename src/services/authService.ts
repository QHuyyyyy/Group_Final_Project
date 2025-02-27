// src/services/authService.ts
import api from "../api/axios";
import { ApiResponse } from "../models/ApiResponse";
import { Credentials, Token } from "../models/AuthModel";

export const authService = {
  login: async (credentials: Credentials) : Promise<ApiResponse<Token>> => {
    const response = await api.post("/api/auth", credentials);
    console.log("fetch data:", response.data);
    return response.data;
  },     
  getinfo: async () => {
    const response = await api.get("/api/auth");
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  logout: async () => {
    const response = await api.post("/api/auth/logout");
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post("/api/auth/verify-token", { token });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  resendToken: async (email: string) => {
    const response = await api.post("/api/auth/resend-token", { email });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.put("/api/auth/forgot-password", { email });
    console.log("fetch data:", response.data.data);
    return response.data.data;
  },
};
