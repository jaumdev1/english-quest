import { useState } from 'react';
import { Plus, Folder, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeckModal } from '../components/DeckModal';
import { DeckCard } from '../components/DeckCard';
import { Notification } from '../components/Notification';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { useDecks } from '../hooks/useDecks';
import { Deck, DeckFormData } from '../types';

export default function Decks() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    decks,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
  } = useDecks();

  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Limpar mensagem de sucesso após 3 segundos
  if (successMessage) {
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  // CREATE - Adicionar novo deck
  const handleCreateDeck = async (deckData: DeckFormData) => {
    try {
      const newDeck = await createDeck(deckData);
      setSuccessMessage('Deck criado com sucesso! 🎉');
      setIsDeckModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar deck:', error);
    }
  };

  // UPDATE - Editar deck
  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setIsDeckModalOpen(true);
  };

  // UPDATE - Atualizar deck
  const handleUpdateDeck = async (deckData: DeckFormData) => {
    if (!editingDeck) return;

    try {
      await updateDeck(editingDeck.id, deckData);
      setSuccessMessage('Deck atualizado com sucesso! ✨');
      setIsDeckModalOpen(false);
      setEditingDeck(null);
    } catch (error) {
      console.error('Erro ao atualizar deck:', error);
    }
  };

  // DELETE - Deletar deck
  const handleDeleteDeck = async (deck: Deck) => {
    if (window.confirm(`Tem certeza que deseja deletar o deck "${deck.name}"? Todas as palavras serão perdidas.`)) {
      try {
        await deleteDeck(deck.id);
        setSuccessMessage('Deck deletado com sucesso! 🗑️');
      } catch (error) {
        console.error('Erro ao deletar deck:', error);
      }
    }
  };

  // Navegar para o deck selecionado
  const handleSelectDeck = (deck: Deck) => {
    navigate(`/deck/${deck.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 pb-20">
      {/* Notifications */}
      <Notification
        type="error"
        message={error || ''}
        onClose={() => {}}
        show={!!error}
      />
      
      <Notification
        type="success"
        message={successMessage}
        onClose={() => setSuccessMessage('')}
        show={!!successMessage}
      />

      <Notification
        type="loading"
        message="Loading..."
        show={loading}
      />

      {/* Header */}
      <header className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <h1 className="modern-title text-4xl sm:text-5xl lg:text-6xl mb-4">
                Word<span className="text-neon-500">In</span>
              </h1>
              <p className="text-dark-100 font-body text-lg lg:text-xl">
                Your gateway to vocabulary mastery
              </p>
              {user && (
                <div className="flex items-center gap-3 mt-4">
                  <Users className="text-neon-500" size={20} />
                  <span className="text-dark-100">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-dark-200 hover:text-white transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsDeckModalOpen(true)}
                disabled={loading}
                className="modern-button w-full sm:w-auto px-8 py-4 text-lg"
              >
                <Folder size={24} />
                <span>New Deck</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Your Decks</h2>
            {decks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-display font-bold text-neon-500 mb-4">
                  Create Your First Deck
                </h3>
                <p className="text-dark-100 mb-6">
                  Start organizing your vocabulary by creating your first deck.
                </p>
                <button
                  onClick={() => setIsDeckModalOpen(true)}
                  disabled={loading}
                  className="modern-button primary px-6 py-3"
                >
                  <Folder size={20} />
                  Create Deck
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    onSelect={handleSelectDeck}
                    onEdit={handleEditDeck}
                    onDelete={handleDeleteDeck}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Deck Modal */}
      <DeckModal
        isOpen={isDeckModalOpen}
        onClose={() => {
          setIsDeckModalOpen(false);
          setEditingDeck(null);
        }}
        onSubmit={editingDeck ? handleUpdateDeck : handleCreateDeck}
        deck={editingDeck}
        loading={loading}
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
} 