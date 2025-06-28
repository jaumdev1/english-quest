import { Word, WordFormData } from '../types';

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulação de erro aleatório (10% de chance)
const simulateError = () => Math.random() < 0.1;

// Simulação de dados em localStorage
const STORAGE_KEY = 'english-words-api';

const getStoredWords = (): Word[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWords = (words: Word[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
};

export class WordsAPI {
  // CREATE - Criar nova palavra
  static async create(wordData: WordFormData): Promise<Word> {
    await delay(800); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao criar palavra. Tente novamente.');
    }

    const newWord: Word = {
      ...wordData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      reviewCount: 0,
    };

    const words = getStoredWords();
    words.push(newWord);
    saveWords(words);

    return newWord;
  }

  // READ - Buscar todas as palavras
  static async getAll(): Promise<Word[]> {
    await delay(500); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao carregar palavras. Tente novamente.');
    }

    return getStoredWords();
  }

  // READ - Buscar palavras por deck
  static async getByDeckId(deckId: string): Promise<Word[]> {
    await delay(400); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao carregar palavras do deck. Tente novamente.');
    }

    const words = getStoredWords();
    return words.filter(word => word.deckId === deckId);
  }

  // READ - Buscar palavra por ID
  static async getById(id: string): Promise<Word | null> {
    await delay(300); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao buscar palavra. Tente novamente.');
    }

    const words = getStoredWords();
    return words.find(word => word.id === id) || null;
  }

  // UPDATE - Atualizar palavra
  static async update(id: string, updates: Partial<Word>): Promise<Word> {
    await delay(600); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao atualizar palavra. Tente novamente.');
    }

    const words = getStoredWords();
    const wordIndex = words.findIndex(word => word.id === id);
    
    if (wordIndex === -1) {
      throw new Error('Palavra não encontrada.');
    }

    words[wordIndex] = { ...words[wordIndex], ...updates };
    saveWords(words);

    return words[wordIndex];
  }

  // DELETE - Deletar palavra
  static async delete(id: string): Promise<void> {
    await delay(400); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao deletar palavra. Tente novamente.');
    }

    const words = getStoredWords();
    const filteredWords = words.filter(word => word.id !== id);
    
    if (filteredWords.length === words.length) {
      throw new Error('Palavra não encontrada.');
    }

    saveWords(filteredWords);
  }

  // DELETE - Deletar todas as palavras de um deck
  static async deleteByDeckId(deckId: string): Promise<void> {
    await delay(500); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao deletar palavras do deck. Tente novamente.');
    }

    const words = getStoredWords();
    const filteredWords = words.filter(word => word.deckId !== deckId);
    saveWords(filteredWords);
  }

  // UPDATE - Marcar como revisada
  static async markAsReviewed(id: string): Promise<Word> {
    await delay(300); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro ao marcar como revisada. Tente novamente.');
    }

    const words = getStoredWords();
    const wordIndex = words.findIndex(word => word.id === id);
    
    if (wordIndex === -1) {
      throw new Error('Palavra não encontrada.');
    }

    words[wordIndex] = {
      ...words[wordIndex],
      lastReviewed: new Date(),
      reviewCount: words[wordIndex].reviewCount + 1
    };

    saveWords(words);
    return words[wordIndex];
  }

  // READ - Buscar palavras com filtros
  static async search(searchTerm: string, deckId?: string, difficulty?: string): Promise<Word[]> {
    await delay(400); // Simula delay de rede
    
    if (simulateError()) {
      throw new Error('Erro na busca. Tente novamente.');
    }

    let words = getStoredWords();

    // Aplicar filtro de deck
    if (deckId) {
      words = words.filter(word => word.deckId === deckId);
    }

    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      words = words.filter(word => 
        word.english.toLowerCase().includes(term) ||
        word.portuguese.toLowerCase().includes(term)
      );
    }

    // Aplicar filtro de dificuldade
    if (difficulty && difficulty !== 'all') {
      words = words.filter(word => word.difficulty === difficulty);
    }

    return words;
  }

  // MIGRATION - Criar palavras padrão para desenvolvimento
  static async createDefaultWords(deckId: string): Promise<Word[]> {
    const defaultWords = [
      {
        english: 'Hello',
        portuguese: 'Olá',
        notes: 'Saudação formal',
        difficulty: 'easy' as const,
        deckId
      },
      {
        english: 'Goodbye',
        portuguese: 'Adeus',
        notes: 'Despedida',
        difficulty: 'easy' as const,
        deckId
      },
      {
        english: 'Thank you',
        portuguese: 'Obrigado',
        notes: 'Expressão de gratidão',
        difficulty: 'easy' as const,
        deckId
      },
      {
        english: 'Beautiful',
        portuguese: 'Bonito',
        notes: 'Adjetivo para descrever algo atraente',
        difficulty: 'medium' as const,
        deckId
      },
      {
        english: 'Wonderful',
        portuguese: 'Maravilhoso',
        notes: 'Adjetivo para algo extraordinário',
        difficulty: 'medium' as const,
        deckId
      }
    ];

    const createdWords: Word[] = [];
    
    for (const wordData of defaultWords) {
      const word = await this.create(wordData);
      createdWords.push(word);
    }

    return createdWords;
  }
} 