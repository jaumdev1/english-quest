import { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Edit, Type, Languages, BarChart3, Folder } from 'lucide-react';
import { WordFormData, Word, Deck } from '../types';
import { Input } from './Input';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (word: WordFormData) => void;
  onUpdate?: (word: WordFormData) => void;
  editingWord?: Word | null;
  decks: Deck[];
  selectedDeckId?: string;
  onDeckChange?: (deckId: string) => void;
}

export function AddWordModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate, 
  editingWord, 
  decks,
  selectedDeckId,
  onDeckChange
}: AddWordModalProps) {
  const [formData, setFormData] = useState<WordFormData>({
    english: '',
    portuguese: '',
    difficulty: 'medium',
    deckId: selectedDeckId || '',
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingWord) {
      setFormData({
        english: editingWord.english,
        portuguese: editingWord.portuguese,
        difficulty: editingWord.difficulty,
        notes: editingWord.notes,
        deckId: editingWord.deckId,
      });
    } else {
      // Resetar formulário quando não estiver editando
      setFormData({
        english: '',
        portuguese: '',
        difficulty: 'medium',
        deckId: selectedDeckId || '',
      });
    }
  }, [editingWord, isOpen, selectedDeckId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deckId) {
      alert('Por favor, selecione um deck');
      return;
    }
    
    if (editingWord && onUpdate) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    
    // Resetar formulário
    setFormData({
      english: '',
      portuguese: '',
      difficulty: 'medium',
      deckId: selectedDeckId || '',
    });
  };

  const handleDeckChange = (deckId: string) => {
    setFormData(prev => ({ ...prev, deckId }));
    onDeckChange?.(deckId);
  };

  const isEditing = !!editingWord;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] shadow-xl shadow-dark-950/50">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <Edit className="text-neon-500" size={24} />
              ) : (
                <Plus className="text-neon-500" size={24} />
              )}
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {isEditing ? 'Edit Word' : 'Add New Word'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-dark-200 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Deck */}
            <div>
              <label className="block text-sm font-ui font-medium text-dark-100 mb-2 ml-1">
                Select Deck
              </label>
              <div className="relative">
                <Folder className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-200" size={20} />
                <select
                  name="deckId"
                  value={formData.deckId}
                  onChange={(e) => handleDeckChange(e.target.value)}
                  required
                  className="modern-input w-full font-ui text-base pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 focus:border-neon-500/50 focus:ring-2 focus:ring-neon-500/20"
                >
                  <option value="">Select a deck</option>
                  {decks.map(deck => (
                    <option key={deck.id} value={deck.id}>
                      {deck.name} ({deck.wordCount} words)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="English Word"
              name="english"
              value={formData.english}
              onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
              required
              placeholder="Enter word in English"
              icon={Type}
            />

            <Input
              label="Portuguese Translation"
              name="portuguese"
              value={formData.portuguese}
              onChange={(e) => setFormData(prev => ({ ...prev, portuguese: e.target.value }))}
              required
              placeholder="Enter translation in Portuguese"
              icon={Languages}
            />

            <div>
              <label className="block text-sm font-ui font-medium text-dark-100 mb-2 ml-1">
                Difficulty Level
              </label>
              <div className="relative">
                <BarChart3 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-200" size={20} />
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  required
                  className="modern-input w-full font-ui text-base pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 focus:border-neon-500/50 focus:ring-2 focus:ring-neon-500/20"
                >
                  <option value="">Select difficulty</option>
                  <option value="easy">Beginner</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-ui transition-all duration-300 border border-dark-600 hover:border-dark-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-neon-500 hover:bg-neon-400 text-dark-950 font-semibold rounded-xl font-ui transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-neon-500/25 hover:shadow-neon-500/40"
              >
                {isEditing ? (
                  <>
                    <Edit size={20} />
                    Update Word
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Word
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 