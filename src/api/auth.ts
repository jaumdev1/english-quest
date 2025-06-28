import { User } from '../types';
import { UsersAPI } from './users';

// Simula um usuário logado no localStorage
const USER_KEY = 'english-quest-user';

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function signInWithGoogle(): Promise<User> {
  // Simulação: retorna um usuário fake ou cria um novo
  const existingUser = getCurrentUser();
  
  if (existingUser) {
    // Atualizar último login
    await UsersAPI.updateLastLogin(existingUser.id);
    return existingUser;
  }

  // Criar usuário padrão para desenvolvimento
  const defaultUser = await UsersAPI.createDefaultUser();
  
  // Atualizar último login
  const updatedUser = await UsersAPI.updateLastLogin(defaultUser.id);
  
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

export function signOut(): void {
  localStorage.removeItem(USER_KEY);
}

// Função para migração automática de dados
export async function migrateUserData(): Promise<void> {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // Se não há usuário logado, criar um padrão
      const defaultUser = await UsersAPI.createDefaultUser();
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      
      // Criar deck padrão para o usuário
      const { DecksAPI } = await import('./decks');
      const defaultDeck = await DecksAPI.createDefaultDeck(defaultUser.id);
      
      // Criar palavras padrão para o deck
      const { WordsAPI } = await import('./words');
      await WordsAPI.createDefaultWords(defaultDeck.id);
      
      // Atualizar contagem de palavras do deck
      await DecksAPI.updateWordCount(defaultDeck.id);
    }
  } catch (error) {
    console.error('Erro na migração de dados:', error);
  }
} 