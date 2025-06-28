export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  isPublic: boolean;
}

export interface DeckFormData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface Word {
  id: string;
  english: string;
  portuguese: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deckId: string;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
}

export interface WordFormData {
  english: string;
  portuguese: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deckId: string;
}

export interface StudySession {
  id: string;
  deckId: string;
  date: Date;
  wordsStudied: string[];
  correctAnswers: number;
  totalQuestions: number;
} 