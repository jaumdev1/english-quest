import { Deck, DeckFormData, Word } from '../types';
import { WordsAPI } from './words';

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulação de erro aleatório (8% de chance)
const simulateError = () => Math.random() < 0.08;

// Simulação de dados em localStorage
const DECKS_STORAGE_KEY = 'english-decks-api';

const getStoredDecks = (): Deck[] => {
  try {
    const stored = localStorage.getItem(DECKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveDecks = (decks: Deck[]) => {
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
};

export class DecksAPI {
  // CREATE - Criar novo deck
  static async create(deckData: DeckFormData, userId: string): Promise<Deck> {
    await delay(700);
    
    if (simulateError()) {
      throw new Error('Erro ao criar deck. Tente novamente.');
    }

    const newDeck: Deck = {
      ...deckData,
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      isPublic: deckData.isPublic ?? false,
    };

    const decks = getStoredDecks();
    decks.push(newDeck);
    saveDecks(decks);

    return newDeck;
  }

  // READ - Buscar todos os decks de um usuário
  static async getByUserId(userId: string): Promise<Deck[]> {
    await delay(500);
    
    if (simulateError()) {
      throw new Error('Erro ao carregar decks. Tente novamente.');
    }

    const decks = getStoredDecks();
    return decks.filter(deck => deck.userId === userId);
  }

  // READ - Buscar deck por ID
  static async getById(id: string): Promise<Deck | null> {
    await delay(300);
    
    if (simulateError()) {
      throw new Error('Erro ao buscar deck. Tente novamente.');
    }

    const decks = getStoredDecks();
    return decks.find(deck => deck.id === id) || null;
  }

  // UPDATE - Atualizar deck
  static async update(id: string, updates: Partial<DeckFormData>): Promise<Deck> {
    await delay(600);
    
    if (simulateError()) {
      throw new Error('Erro ao atualizar deck. Tente novamente.');
    }

    const decks = getStoredDecks();
    const deckIndex = decks.findIndex(deck => deck.id === id);
    
    if (deckIndex === -1) {
      throw new Error('Deck não encontrado.');
    }

    decks[deckIndex] = { 
      ...decks[deckIndex], 
      ...updates,
      updatedAt: new Date()
    };
    saveDecks(decks);

    return decks[deckIndex];
  }

  // DELETE - Deletar deck
  static async delete(id: string): Promise<void> {
    await delay(500);
    
    if (simulateError()) {
      throw new Error('Erro ao deletar deck. Tente novamente.');
    }

    const decks = getStoredDecks();
    const filteredDecks = decks.filter(deck => deck.id !== id);
    
    if (filteredDecks.length === decks.length) {
      throw new Error('Deck não encontrado.');
    }

    saveDecks(filteredDecks);
  }

  // READ - Buscar decks públicos
  static async getPublicDecks(): Promise<Deck[]> {
    await delay(400);
    
    if (simulateError()) {
      throw new Error('Erro ao carregar decks públicos. Tente novamente.');
    }

    const decks = getStoredDecks();
    return decks.filter(deck => deck.isPublic);
  }

  // UPDATE - Atualizar contagem de palavras do deck
  static async updateWordCount(deckId: string): Promise<Deck> {
    await delay(200);
    
    if (simulateError()) {
      throw new Error('Erro ao atualizar contagem de palavras. Tente novamente.');
    }

    const decks = getStoredDecks();
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    
    if (deckIndex === -1) {
      throw new Error('Deck não encontrado.');
    }

    // Buscar palavras do deck para contar
    const words = await WordsAPI.getByDeckId(deckId);
    
    decks[deckIndex] = {
      ...decks[deckIndex],
      wordCount: words.length,
      updatedAt: new Date()
    };
    saveDecks(decks);

    return decks[deckIndex];
  }

  // MIGRATION - Criar deck padrão para desenvolvimento
  static async createDefaultDeck(userId: string): Promise<Deck> {
    const userDecks = await this.getByUserId(userId);
    const defaultDeck = userDecks.find(deck => deck.name === 'Meu Primeiro Deck');
    
    if (defaultDeck) {
      return defaultDeck;
    }

    return await this.create({
      name: 'Meu Primeiro Deck',
      description: 'Deck criado automaticamente para começar seus estudos',
      isPublic: false,
    }, userId);
  }
} 