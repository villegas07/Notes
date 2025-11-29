'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@/app/infrastructure/http/AuthService';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      console.log('Loading token from localStorage:', storedToken ? 'Token found' : 'No token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Starting login process...');
    try {
      // AuthService.signIn ahora retorna el token directamente
      const token = await AuthService.signIn({ email, password });
      
      console.log('AuthContext: Token received, saving...');
      localStorage.setItem('token', token);
      setToken(token);
      console.log('AuthContext: Login successful');
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    localStorage.removeItem('token');
    setToken(null);
  };

  // Mostrar un loading mientras se carga el token inicial
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}