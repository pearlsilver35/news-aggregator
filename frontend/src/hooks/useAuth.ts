import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await authService.login(credentials);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    try {
      await authService.register(data);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    setUser,
    handleLogin,
    handleRegister,
    handleLogout
  };
} 