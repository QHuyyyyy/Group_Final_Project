import React, { createContext, useState, useContext } from "react";
import { useApiStore } from '../stores/apiStore';
import { authService } from '../services/authService';


interface AuthContextType {

  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const { setLoading, setError } = useApiStore();



  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      console.log(response.token)
      setToken(response.token);
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {

    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
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