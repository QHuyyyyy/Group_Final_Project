import React, { createContext, useState, useContext, useEffect } from "react";
import { useApiStore } from '../stores/apiStore';
import { authService } from '../services/authService';
import { useUserStore } from "../stores/userStore";

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const { setLoading, setError } = useApiStore();

  useEffect(() => {
    const initializeAuth = async () => {

      if (token) {
        try {
          setLoading(true);
          const userInfo = await authService.getinfo();
          useUserStore.getState().setUser(userInfo);
        } catch (error) {
          console.error("Lỗi khi khôi phục phiên đăng nhập:", error);
          localStorage.removeItem("token");
          useUserStore.getState().clearUser();
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token); 

      const userInfo = await authService.getinfo();
      
      useUserStore.getState().setUser(userInfo);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout  = async () => {
    try {
      await authService.logout(); 
      localStorage.removeItem("token");
      useUserStore.getState().clearUser(); 
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider value={{  token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
