import { useState, useEffect } from 'react';
import { Word } from '../types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useWords() {
  const [words, setWords] = useLocalStorage<Word[]>('english-words', []);

  const addWord = (word: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>) => {
    const newWord: Word = {
      ...word,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      reviewCount: 0,
    };
    setWords(prev => [...prev, newWord]);
  };

  const updateWord = (id: string, updates: Partial<Word>) => {
    setWords(prev => prev.map(word => 
      word.id === id ? { ...word, ...updates } : word
    ));
  };

  const deleteWord = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
  };

  const markAsReviewed = (id: string) => {
    setWords(prev => prev.map(word => 
      word.id === id 
        ? { 
            ...word, 
            lastReviewed: new Date(), 
            reviewCount: word.reviewCount + 1 
          } 
        : word
    ));
  };

  return {
    words,
    addWord,
    updateWord,
    deleteWord,
    markAsReviewed,
  };
} 