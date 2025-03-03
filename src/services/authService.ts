// src/services/authService.ts
import { apiUtils } from "../api/axios";

interface User {
  id: string;
  email: string;
  user_name: string;
  role_code: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginCredentials) => {
    return apiUtils.post<ApiResponse<User>>('/api/auth', credentials);
  },

  // Lấy thông tin user
  getInfo: async () => {
    return apiUtils.get<ApiResponse<User>>('/api/auth');
  },

  // Đăng xuất
  logout: async () => {
    return apiUtils.post<ApiResponse<void>>('/api/auth/logout');
  },

  // Xác thực token
  verifyToken: async (token: string) => {
    return apiUtils.post<ApiResponse<boolean>>('/api/auth/verify-token', { token });
  },

  // Gửi lại token
  resendToken: async (email: string) => {
    return apiUtils.post<ApiResponse<void>>('/api/auth/resend-token', { email });
  },

  // Quên mật khẩu
  forgotPassword: async (email: string) => {
    return apiUtils.put<ApiResponse<void>>('/api/auth/forgot-password', { email });
  }
};
