import api from '../api/axios';

interface User {
  username: string;
  password: string;
  role: string;
}

export const authService = {
  async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await api.get('/users');
      const users: User[] = response.data;
      
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      
      return user || null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};