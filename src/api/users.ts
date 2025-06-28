import { User } from '../types';

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulação de erro aleatório (5% de chance)
const simulateError = () => Math.random() < 0.05;

// Simulação de dados em localStorage
const USERS_STORAGE_KEY = 'english-users-api';

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export class UsersAPI {
  // CREATE - Criar novo usuário
  static async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay(600);
    
    if (simulateError()) {
      throw new Error('Erro ao criar usuário. Tente novamente.');
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const users = getStoredUsers();
    users.push(newUser);
    saveUsers(users);

    return newUser;
  }

  // READ - Buscar usuário por ID
  static async getById(id: string): Promise<User | null> {
    await delay(300);
    
    if (simulateError()) {
      throw new Error('Erro ao buscar usuário. Tente novamente.');
    }

    const users = getStoredUsers();
    return users.find(user => user.id === id) || null;
  }

  // READ - Buscar usuário por email
  static async getByEmail(email: string): Promise<User | null> {
    await delay(300);
    
    if (simulateError()) {
      throw new Error('Erro ao buscar usuário. Tente novamente.');
    }

    const users = getStoredUsers();
    return users.find(user => user.email === email) || null;
  }

  // UPDATE - Atualizar usuário
  static async update(id: string, updates: Partial<User>): Promise<User> {
    await delay(500);
    
    if (simulateError()) {
      throw new Error('Erro ao atualizar usuário. Tente novamente.');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);

    return users[userIndex];
  }

  // UPDATE - Atualizar último login
  static async updateLastLogin(id: string): Promise<User> {
    await delay(200);
    
    if (simulateError()) {
      throw new Error('Erro ao atualizar último login. Tente novamente.');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    users[userIndex] = {
      ...users[userIndex],
      lastLoginAt: new Date()
    };
    saveUsers(users);

    return users[userIndex];
  }

  // DELETE - Deletar usuário
  static async delete(id: string): Promise<void> {
    await delay(400);
    
    if (simulateError()) {
      throw new Error('Erro ao deletar usuário. Tente novamente.');
    }

    const users = getStoredUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('Usuário não encontrado.');
    }

    saveUsers(filteredUsers);
  }

  // MIGRATION - Criar usuário padrão para desenvolvimento
  static async createDefaultUser(): Promise<User> {
    const defaultUser = await this.getByEmail('default@example.com');
    
    if (defaultUser) {
      return defaultUser;
    }

    return await this.create({
      name: 'Usuário Padrão',
      email: 'default@example.com',
      photoURL: 'https://via.placeholder.com/150',
    });
  }
} 