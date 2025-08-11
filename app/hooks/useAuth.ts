"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthManager from '@/app/utils/AuthManager';
import { User, AuthResponse } from '@/type';

interface AuthHookReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<AuthResponse>;
  refreshUser: () => void;
  clearError: () => void;
}

export function useAuth(): AuthHookReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        setError(null);
        const currentUser = AuthManager.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setError('Erreur lors de la vérification de l\'authentification');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Vérifier l'authentification côté client seulement
    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await AuthManager.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      } else if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      const errorMessage = 'Erreur lors de la connexion';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      const result = await AuthManager.register(email, password, userData);
      if (result.success && result.user) {
        setUser(result.user);
      } else if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      const errorMessage = 'Erreur lors de l\'inscription';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    try {
      setError(null);
      AuthManager.logout();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      setError('Erreur lors de la déconnexion');
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    try {
      setError(null);
      const result = await AuthManager.updateProfile(updatedData);
      if (result.success && result.user) {
        setUser(result.user);
      } else if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      const errorMessage = 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const refreshUser = () => {
    try {
      setError(null);
      const currentUser = AuthManager.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement:', err);
      setError('Erreur lors du rafraîchissement des données utilisateur');
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError
  };
}
