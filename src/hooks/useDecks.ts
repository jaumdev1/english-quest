import { useState, useEffect, useCallback } from 'react';
import { Deck, DeckFormData } from '../types';
import { DecksAPI } from '../api/decks';
import { useAuth } from './useAuth';

export function useDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar decks do usuário
  const loadDecks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    
    try {
      const userDecks = await DecksAPI.getByUserId(user.id);
      setDecks(userDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar decks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Criar novo deck
  const createDeck = useCallback(async (deckData: DeckFormData) => {
    if (!user) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);
    
    try {
      const newDeck = await DecksAPI.create(deckData, user.id);
      setDecks(prev => [...prev, newDeck]);
      return newDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar deck');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Atualizar deck
  const updateDeck = useCallback(async (deckId: string, updates: Partial<DeckFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedDeck = await DecksAPI.update(deckId, updates);
      setDecks(prev => prev.map(deck => 
        deck.id === deckId ? updatedDeck : deck
      ));
      return updatedDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar deck');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar deck
  const deleteDeck = useCallback(async (deckId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await DecksAPI.delete(deckId);
      setDecks(prev => prev.filter(deck => deck.id !== deckId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar deck');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar deck por ID
  const getDeckById = useCallback(async (deckId: string) => {
    try {
      return await DecksAPI.getById(deckId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar deck');
      throw err;
    }
  }, []);

  // Atualizar contagem de palavras
  const updateDeckWordCount = useCallback(async (deckId: string) => {
    try {
      const updatedDeck = await DecksAPI.updateWordCount(deckId);
      setDecks(prev => prev.map(deck => 
        deck.id === deckId ? updatedDeck : deck
      ));
      return updatedDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar contagem de palavras');
      throw err;
    }
  }, []);

  // Carregar decks quando usuário mudar
  useEffect(() => {
    if (user) {
      loadDecks();
    } else {
      setDecks([]);
    }
  }, [user, loadDecks]);

  return {
    decks,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeckById,
    updateDeckWordCount,
    loadDecks,
  };
} 