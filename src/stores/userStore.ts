import { create } from 'zustand';

interface UserState {
  id: string | null;
  email: string | null;
  user_name: string | null;
  role_code: string | null;
  is_verified: boolean;
  is_blocked: boolean;
  setUser: (userData: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  email: null,
  user_name: null, 
  role_code: null,
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
    id: null,
    email: null,
    user_name: null,
    role_code: null, 
    is_verified: false,
    is_blocked: false
  })
}));