import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any | null;
  token: string | null;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth info:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(token: string, userData: any) {
    try {
      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userData', JSON.stringify(userData)),
      ]);
      setToken(token);
      setUser(userData);
      router.replace('/');
    } catch (e) {
      console.error('Failed to save auth info:', e);
    }
  }

  async function signOut() {
    try {
      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('userData'),
      ]);
      setToken(null);
      setUser(null);
      router.replace('/login');
    } catch (e) {
      console.error('Failed to remove auth info:', e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
