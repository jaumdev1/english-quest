import { useState } from 'react';
import { X, Plus, Upload, Mic, Sparkles } from 'lucide-react';
import { WordFormData } from '../types';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (word: WordFormData) => void;
}

export function AddWordModal({ isOpen, onClose, onAdd }: AddWordModalProps) {
  const [formData, setFormData] = useState<WordFormData>({
    english: '',
    portuguese: '',
    pronunciation: '',
    difficulty: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      english: '',
      portuguese: '',
      pronunciation: '',
      difficulty: 'medium',
    });
    onClose();
  };

  const handleFileChange = (field: 'audioFile' | 'imageFile') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="gamified-card rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md lg:max-w-lg mx-auto shadow-2xl border-2 border-green-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="text-green-500" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">✨ New Magic Word</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              🎯 English Word *
            </label>
            <input
              type="text"
              required
              value={formData.english}
              onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 placeholder-gray-600 font-medium shadow-lg"
              placeholder="Ex: Hello"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              🇧🇷 Portuguese Translation *
            </label>
            <input
              type="text"
              required
              value={formData.portuguese}
              onChange={(e) => setFormData(prev => ({ ...prev, portuguese: e.target.value }))}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 placeholder-gray-600 font-medium shadow-lg"
              placeholder="Ex: Olá"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              🔊 Pronunciation
            </label>
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={formData.pronunciation}
                onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 placeholder-gray-600 font-medium shadow-lg"
                placeholder="Ex: /həˈloʊ/"
              />
              <button
                type="button"
                className="px-3 sm:px-4 py-3 sm:py-4 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-xl transition-colors duration-200"
                title="Record audio"
              >
                <Mic size={18} className="text-green-600" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              ⚡ Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 font-medium shadow-lg"
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              🎵 Audio (optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange('audioFile')}
                className="hidden"
                id="audio-file"
              />
              <label
                htmlFor="audio-file"
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl cursor-pointer hover:bg-white transition-colors duration-200 text-gray-700 font-medium shadow-lg w-full sm:w-auto justify-center"
              >
                <Upload size={18} className="text-green-600" />
                Choose file
              </label>
              {formData.audioFile && (
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg break-all">
                  {formData.audioFile.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              🖼️ Image (optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange('imageFile')}
                className="hidden"
                id="image-file"
              />
              <label
                htmlFor="image-file"
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl cursor-pointer hover:bg-white transition-colors duration-200 text-gray-700 font-medium shadow-lg w-full sm:w-auto justify-center"
              >
                <Upload size={18} className="text-green-600" />
                Choose image
              </label>
              {formData.imageFile && (
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg break-all">
                  {formData.imageFile.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              📝 Notes (optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/90 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 placeholder-gray-600 font-medium shadow-lg resize-none"
              placeholder="Ex: Used in informal greetings"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-xl text-gray-700 transition-colors duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gamified-button flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
            >
              <Plus size={18} />
              ADD WORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 