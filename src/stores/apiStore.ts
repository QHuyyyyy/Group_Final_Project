import { create } from 'zustand';

interface ApiState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useApiStore = create<ApiState>((set) => ({
  isLoading: false,
  error: null,
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  resetState: () => set({ isLoading: false, error: null })
}));