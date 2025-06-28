import React, { useState, useEffect } from 'react';
import { Deck, DeckFormData } from '../types';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deckData: DeckFormData) => Promise<void>;
  deck?: Deck | null;
  loading?: boolean;
}

export function DeckModal({ isOpen, onClose, onSubmit, deck, loading = false }: DeckModalProps) {
  const [formData, setFormData] = useState<DeckFormData>({
    name: '',
    description: '',
    isPublic: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher formulário quando editar
  useEffect(() => {
    if (deck) {
      setFormData({
        name: deck.name,
        description: deck.description || '',
        isPublic: deck.isPublic,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isPublic: false,
      });
    }
    setErrors({});
  }, [deck, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.name.length > 50) {
      newErrors.name = 'Nome deve ter no máximo 50 caracteres';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Descrição deve ter no máximo 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar deck:', error);
    }
  };

  const handleInputChange = (field: keyof DeckFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {deck ? 'Editar Deck' : 'Criar Novo Deck'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Deck *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.name ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Digite o nome do deck"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.description ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Digite uma descrição (opcional)"
              rows={3}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Deck público (visível para outros usuários)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`
                px-4 py-2 text-white rounded-md transition-colors
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
              disabled={loading}
            >
              {loading ? 'Salvando...' : (deck ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 