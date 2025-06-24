export interface Word {
  id: string;
  english: string;
  portuguese: string;
  pronunciation: string;
  audioUrl?: string;
  imageUrl?: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
}

export interface WordFormData {
  english: string;
  portuguese: string;
  pronunciation: string;
  audioFile?: File;
  imageFile?: File;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  id: string;
  date: Date;
  wordsStudied: string[];
  correctAnswers: number;
  totalQuestions: number;
} 