import { useState, useEffect, useCallback } from 'react';
import { Word, WordFormData } from '../types';
import { WordsAPI } from '../api/words';

interface UseWordsAPIState {
  words: Word[];
  loading: boolean;
  error: string | null;
}

interface UseWordsAPIActions {
  // CREATE
  createWord: (wordData: WordFormData) => Promise<void>;
  
  // READ
  loadWords: () => Promise<void>;
  loadWordsByDeck: (deckId: string) => Promise<void>;
  getWordById: (id: string) => Promise<Word | null>;
  searchWords: (searchTerm: string, deckId?: string, difficulty?: string) => Promise<Word[]>;
  
  // UPDATE
  updateWord: (id: string, updates: Partial<Word>) => Promise<void>;
  markAsReviewed: (id: string) => Promise<void>;
  
  // DELETE
  deleteWord: (id: string) => Promise<void>;
  deleteWordsByDeck: (deckId: string) => Promise<void>;
  
  // UTILS
  clearError: () => void;
}

export function useWordsAPI(): UseWordsAPIState & UseWordsAPIActions {
  const [state, setState] = useState<UseWordsAPIState>({
    words: [],
    loading: false,
    error: null,
  });

  // Função para gerenciar loading e erro
  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      throw error;
    }
  }, []);

  // CREATE - Criar nova palavra
  const createWord = useCallback(async (wordData: WordFormData) => {
    await withLoading(
      async () => {
        const newWord = await WordsAPI.create(wordData);
        setState(prev => ({
          ...prev,
          words: [...prev.words, newWord],
        }));
      },
      'Erro ao criar palavra'
    );
  }, [withLoading]);

  // READ - Carregar todas as palavras
  const loadWords = useCallback(async () => {
    await withLoading(
      async () => {
        const words = await WordsAPI.getAll();
        setState(prev => ({ ...prev, words }));
      },
      'Erro ao carregar palavras'
    );
  }, [withLoading]);

  // READ - Carregar palavras de um deck específico
  const loadWordsByDeck = useCallback(async (deckId: string) => {
    await withLoading(
      async () => {
        const words = await WordsAPI.getByDeckId(deckId);
        setState(prev => ({ ...prev, words }));
      },
      'Erro ao carregar palavras do deck'
    );
  }, [withLoading]);

  // READ - Buscar palavra por ID
  const getWordById = useCallback(async (id: string) => {
    return await withLoading(
      () => WordsAPI.getById(id),
      'Erro ao buscar palavra'
    );
  }, [withLoading]);

  // READ - Buscar palavras com filtros
  const searchWords = useCallback(async (searchTerm: string, deckId?: string, difficulty?: string) => {
    return await withLoading(
      () => WordsAPI.search(searchTerm, deckId, difficulty),
      'Erro na busca'
    );
  }, [withLoading]);

  // UPDATE - Atualizar palavra
  const updateWord = useCallback(async (id: string, updates: Partial<Word>) => {
    await withLoading(
      async () => {
        const updatedWord = await WordsAPI.update(id, updates);
        setState(prev => ({
          ...prev,
          words: prev.words.map(word => 
            word.id === id ? updatedWord : word
          ),
        }));
      },
      'Erro ao atualizar palavra'
    );
  }, [withLoading]);

  // UPDATE - Marcar como revisada
  const markAsReviewed = useCallback(async (id: string) => {
    await withLoading(
      async () => {
        const updatedWord = await WordsAPI.markAsReviewed(id);
        setState(prev => ({
          ...prev,
          words: prev.words.map(word => 
            word.id === id ? updatedWord : word
          ),
        }));
      },
      'Erro ao marcar como revisada'
    );
  }, [withLoading]);

  // DELETE - Deletar palavra
  const deleteWord = useCallback(async (id: string) => {
    await withLoading(
      async () => {
        await WordsAPI.delete(id);
        setState(prev => ({
          ...prev,
          words: prev.words.filter(word => word.id !== id),
        }));
      },
      'Erro ao deletar palavra'
    );
  }, [withLoading]);

  // DELETE - Deletar todas as palavras de um deck
  const deleteWordsByDeck = useCallback(async (deckId: string) => {
    await withLoading(
      async () => {
        await WordsAPI.deleteByDeckId(deckId);
        setState(prev => ({
          ...prev,
          words: prev.words.filter(word => word.deckId !== deckId),
        }));
      },
      'Erro ao deletar palavras do deck'
    );
  }, [withLoading]);

  // UTILS - Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Carregar palavras na inicialização
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  return {
    // State
    ...state,
    
    // Actions
    createWord,
    loadWords,
    loadWordsByDeck,
    getWordById,
    searchWords,
    updateWord,
    markAsReviewed,
    deleteWord,
    deleteWordsByDeck,
    clearError,
  };
} 