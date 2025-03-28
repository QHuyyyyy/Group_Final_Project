import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from '../services/auth.service';
import { useUserStore } from "../stores/userStore";

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));


  useEffect(() => {
    const initializeAuth = async () => {

      if (token) {
        try {
   
          const userInfo = await authService.getinfo();
          useUserStore.getState().setUser(userInfo.data);
        } catch (error) {
        
          localStorage.removeItem("token");
          useUserStore.getState().clearUser();
        } 
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {

      const response = await authService.login({ email, password }, {showSpinner:false});
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token); 

      const userInfo = await authService.getinfo();

      useUserStore.getState().setUser(userInfo.data);
  };

  const logout  = async () => {
      await authService.logout(); 
      localStorage.removeItem("token");
      useUserStore.getState().clearUser(); 
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
