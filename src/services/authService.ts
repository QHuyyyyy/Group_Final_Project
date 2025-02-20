// src/services/authService.ts
import api from '../api/axios';

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/api/auth', credentials);
    console.log(response.data.success);
    return response.data.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    console.log(response.data.success);
    return response.data.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post('/api/auth/verify-token', { token });
    console.log(response.data.success);
    return response.data.data;
  },

  resendToken: async (email: string) => {
    const response = await api.post('/api/auth/resend-token', { email });
    console.log(response.data.success);
    return response.data.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.put('/api/auth/forgot-password', { email });
    console.log(response.data.success);
    return response.data.data;
  }
};