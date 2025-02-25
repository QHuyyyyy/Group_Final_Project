// src/services/authService.ts
import api from "../api/axios";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/api/auth", credentials);
    console.log("fetch data:", response.data);
    return response.data;
  },
  getinfo: async () => {
    const response = await api.get("/api/auth");
    console.log("fetch data:", response.data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/api/auth/logout");
    console.log("fetch data:", response.data);
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post("/api/auth/verify-token", { token });
    console.log("fetch data:", response.data);
    return response.data;
  },

  resendToken: async (email: string) => {
    const response = await api.post("/api/auth/resend-token", { email });
    console.log("fetch data:", response.data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.put("/api/auth/forgot-password", { email });
    console.log("fetch data:", response.data);
    return response.data;
  },
};
