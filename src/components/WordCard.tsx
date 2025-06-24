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
      case 'easy': return 'bg-green-200 text-green-900 border-green-400';
      case 'medium': return 'bg-yellow-200 text-yellow-900 border-yellow-400';
      case 'hard': return 'bg-red-200 text-red-900 border-red-400';
      default: return 'bg-gray-200 text-gray-900 border-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢 Easy';
      case 'medium': return '🟡 Medium';
      case 'hard': return '🔴 Hard';
      default: return difficulty;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 border-2 border-green-300 shadow-xl hover:shadow-2xl hover:border-green-400">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-2xl font-bold text-gray-900 truncate">{word.english}</h3>
            <span className="text-lg">{getDifficultyIcon(word.difficulty)}</span>
          </div>
          <p className="text-gray-700 text-lg mb-2 font-medium">{word.portuguese}</p>
          {word.pronunciation && (
            <p className="text-sm text-gray-600 font-mono bg-gray-200 px-3 py-1 rounded-lg inline-block border border-gray-300">
              {word.pronunciation}
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(word)}
            className="p-3 text-green-700 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-green-300"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(word.id)}
            className="p-3 text-red-700 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-red-300"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {word.imageUrl && (
        <div className="mb-6">
          <img
            src={word.imageUrl}
            alt={word.english}
            className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-green-300 shadow-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getDifficultyColor(word.difficulty)}`}>
            {getDifficultyText(word.difficulty)}
          </span>
          {word.audioUrl && (
            <button
              onClick={() => onPlayAudio(word.audioUrl!)}
              className="p-3 text-green-700 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-green-300"
              title="Play audio"
            >
              <Volume2 size={18} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target size={16} />
          <span className="font-bold">{word.reviewCount}</span>
        </div>
      </div>

      {word.notes && (
        <div className="mb-4 p-4 bg-green-100 rounded-xl border-2 border-green-300">
          <p className="text-sm text-green-900 font-medium">{word.notes}</p>
        </div>
      )}

      <div className="text-xs text-gray-600 space-y-1 bg-gray-100 p-3 rounded-lg border border-gray-300">
        <div className="flex items-center gap-2">
          <span className="font-bold">📅</span>
          Created: {new Date(word.createdAt).toLocaleDateString('en-US')}
        </div>
        {word.lastReviewed && (
          <div className="flex items-center gap-2">
            <span className="font-bold">🔄</span>
            Last review: {new Date(word.lastReviewed).toLocaleDateString('en-US')}
          </div>
        )}
      </div>
    </div>
  );
} 