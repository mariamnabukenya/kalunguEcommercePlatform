import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { AuthUser, AuthState, LoginForm, RegisterForm } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching fresh user data
          try {
            const userData = await authAPI.getProfile();
            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
          } catch (error) {
            // Token is invalid, clear auth
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const login = async (credentials: LoginForm) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token: userToken } = response;

      setUser(userData);
      setToken(userToken);
      
      // Store in localStorage
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error: any) {
      clearAuth();
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token: userToken } = response;

      setUser(newUser);
      setToken(userToken);
      
      // Store in localStorage
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    } catch (error: any) {
      clearAuth();
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on server, clear local auth
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;