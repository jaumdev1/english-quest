import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signInWithGoogle, signOut, migrateUserData } from '../api/auth';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
      
      // Executar migração de dados após login
      await migrateUserData();
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
  }, []);

  // Inicialização e migração automática
  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Se já há usuário logado, executar migração
        await migrateUserData();
      }
      
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  return { user, loading, login, logout, initialized };
} 