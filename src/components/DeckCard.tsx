import React from 'react';
import { Deck } from '../types';

interface DeckCardProps {
  deck: Deck;
  onSelect?: (deck: Deck) => void;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
  selected?: boolean;
}

export function DeckCard({ deck, onSelect, onEdit, onDelete, selected = false }: DeckCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:border-blue-300
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
      `}
      onClick={() => onSelect?.(deck)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {deck.name}
          </h3>
          {deck.description && (
            <p className="text-gray-600 text-sm mb-3">
              {deck.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {deck.isPublic && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Público
            </span>
          )}
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {deck.wordCount} palavras
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Criado em: {formatDate(deck.createdAt)}</span>
        <span>Atualizado: {formatDate(deck.updatedAt)}</span>
      </div>

      <div className="flex justify-end space-x-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deck);
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deck);
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Deletar
          </button>
        )}
      </div>
    </div>
  );
} 