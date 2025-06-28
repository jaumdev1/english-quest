import { Volume2, Edit, Trash2, Star, Target } from 'lucide-react';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onPlayAudio: (audioUrl: string) => void;
}

export function WordCard({ word, onEdit, onDelete, onPlayAudio }: WordCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-neon-500/10 text-neon-500 border-neon-500/30';
      case 'medium': return 'bg-neon-500/20 text-neon-500 border-neon-500/30';
      case 'hard': return 'bg-neon-500/30 text-neon-500 border-neon-500/30';
      default: return 'bg-dark-400/20 text-dark-200 border-dark-300';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Beginner';
      case 'medium': return 'Intermediate';
      case 'hard': return 'Advanced';
      default: return difficulty;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '•';
      case 'medium': return '••';
      case 'hard': return '•••';
      default: return '•';
    }
  };

  return (
    <div className="modern-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-1">
            {word.english}
          </h3>
          <p className="text-dark-100 font-body">
            {word.portuguese}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(word)}
            className="p-2 text-dark-200 hover:text-neon-500 transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(word.id)}
            className="p-2 text-dark-200 hover:text-neon-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-ui border ${getDifficultyColor(
              word.difficulty
            )}`}
          >
            {getDifficultyIcon(word.difficulty)} {getDifficultyText(word.difficulty)}
          </span>
          {word.reviewCount > 0 && (
            <span className="text-dark-200 text-sm font-ui">
              Reviewed {word.reviewCount}x
            </span>
          )}
        </div>
        {word.audioUrl && (
          <button
            onClick={() => onPlayAudio(word.audioUrl)}
            className="p-2 text-dark-200 hover:text-neon-500 transition-colors"
          >
            <Volume2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
} 