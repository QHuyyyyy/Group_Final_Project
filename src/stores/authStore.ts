import { create } from 'zustand';
import { authService } from '../services/authService';
import type { User } from '../types/User';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.login(username, password);
      
      if (user) {
        set({ 
          user: {
            username: user.username,
            password: user.password,
            role: user.role
          }, 
          isLoading: false 
        });
        
        if (user.role) {
          localStorage.setItem('role', user.role);
        }
      } else {
        set({ error: 'Thông tin đăng nhập không hợp lệ', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Đã xảy ra lỗi khi đăng nhập', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, error: null });
    localStorage.removeItem('role');
  }
}));