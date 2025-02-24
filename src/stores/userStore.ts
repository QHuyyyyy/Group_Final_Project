import { create } from 'zustand';

interface UserState {
  id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  setUser: (userData: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: '',
  email: '',
  user_name: '', 
  role_code: '',
  is_verified: false,
  is_blocked: false,
  
  setUser: (userData) => set({
    id: userData._id,
    email: userData.email,
    user_name: userData.user_name,
    role_code: userData.role_code,
    is_verified: userData.is_verified,
    is_blocked: userData.is_blocked
  }),
  
  clearUser: () => set({
    id: '',
    email: '',
    user_name: '',
    role_code: '', 
    is_verified: false,
    is_blocked: false
  })
}));