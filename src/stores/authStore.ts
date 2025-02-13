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
      if (!user) throw new Error('User not found');
      
      set({ 
        user: {
          username: user.username,
          password: user.password,
          role: user.role
        }, 
        isLoading: false,
        error: null
      });
      
      if (user.role) {
        localStorage.setItem('role', user.role);
      }
    } catch (error) {
      set({ 
        user: null,
        error: 'Invalid login account',
        isLoading: false 
      });
    }
  },

  logout: () => {
    set({ user: null, error: null });
    localStorage.removeItem('role');
  }
}));