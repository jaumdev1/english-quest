import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Search, Filter, ArrowLeft, Users, Settings } from 'lucide-react';
import { AddWordModal } from '../components/AddWordModal';
import { WordCard } from '../components/WordCard';
import { StudyMode } from '../components/StudyMode';
import { Notification } from '../components/Notification';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { useDecks } from '../hooks/useDecks';
import { useWordsAPI } from '../hooks/useWordsAPI';
import { Word, WordFormData } from '../types';

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const {
    getDeckById,
    updateDeckWordCount,
  } = useDecks();
  
  const {
    words,
    loading: wordsLoading,
    error: wordsError,
    createWord,
    updateWord,
    deleteWord,
    markAsReviewed,
    loadWordsByDeck,
    clearError: clearWordsError,
  } = useWordsAPI();

  // State
  const [deck, setDeck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Carregar deck e palavras
  useEffect(() => {
    const loadDeckData = async () => {
      if (!deckId) return;
      
      setLoading(true);
      try {
        const deckData = await getDeckById(deckId);
        if (deckData) {
          setDeck(deckData);
          await loadWordsByDeck(deckId);
        } else {
          navigate('/decks');
        }
      } catch (error) {
        console.error('Erro ao carregar deck:', error);
        navigate('/decks');
      } finally {
        setLoading(false);
      }
    };

    loadDeckData();
  }, [deckId, getDeckById, loadWordsByDeck, navigate]);

  // Limpar mensagem de sucesso após 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // CREATE - Adicionar nova palavra
  const handleAddWord = async (wordData: WordFormData) => {
    if (!deckId) return;

    try {
      await createWord(wordData);
      await updateDeckWordCount(deckId);
      setSuccessMessage('Palavra criada com sucesso! 🎉');
      setIsAddWordModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar palavra:', error);
    }
  };

  // UPDATE - Editar palavra
  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setIsAddWordModalOpen(true);
  };

  // UPDATE - Atualizar palavra
  const handleUpdateWord = async (wordData: WordFormData) => {
    if (!editingWord) return;

    try {
      await updateWord(editingWord.id, wordData);
      if (deckId) {
        await updateDeckWordCount(deckId);
      }
      setSuccessMessage('Palavra atualizada com sucesso! ✨');
      setIsAddWordModalOpen(false);
      setEditingWord(null);
    } catch (error) {
      console.error('Erro ao atualizar palavra:', error);
    }
  };

  // DELETE - Deletar palavra
  const handleDeleteWord = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta palavra?')) {
      try {
        await deleteWord(id);
        if (deckId) {
          await updateDeckWordCount(deckId);
        }
        setSuccessMessage('Palavra deletada com sucesso! 🗑️');
      } catch (error) {
        console.error('Erro ao deletar palavra:', error);
      }
    }
  };

  // Função para reproduzir áudio
  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  // Função chamada quando o estudo é completado
  const handleStudyComplete = async (correctAnswers: number, totalQuestions: number) => {
    try {
      // Marcar todas as palavras como revisadas
      const promises = words.map(word => markAsReviewed(word.id));
      await Promise.all(promises);
      
      if (deckId) {
        await updateDeckWordCount(deckId);
      }
      
      setSuccessMessage(`Missão completada! ${correctAnswers}/${totalQuestions} acertos! 🏆`);
      setIsStudyMode(false);
    } catch (error) {
      console.error('Erro ao marcar palavras como revisadas:', error);
    }
  };

  // Filtrar palavras
  const filteredWords = words.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.portuguese.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <p className="text-dark-100">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (isStudyMode) {
    return (
      <div className="min-h-screen bg-dark-950">
        <StudyMode
          words={filteredWords}
          onComplete={handleStudyComplete}
          onBack={() => setIsStudyMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 pb-20">
      {/* Notifications */}
      <Notification
        type="error"
        message={wordsError || ''}
        onClose={clearWordsError}
        show={!!wordsError}
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
        show={wordsLoading}
      />

      {/* Header */}
      <header className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate('/decks')}
                  className="text-dark-200 hover:text-white transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="modern-title text-4xl sm:text-5xl lg:text-6xl">
                  {deck?.name}
                </h1>
              </div>
              {deck?.description && (
                <p className="text-dark-100 font-body text-lg lg:text-xl mb-4">
                  {deck.description}
                </p>
              )}
              {user && (
                <div className="flex items-center gap-3">
                  <Users className="text-neon-500" size={20} />
                  <span className="text-dark-100">{user.name}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsStudyMode(true)}
                disabled={words.length === 0 || wordsLoading}
                className="modern-button primary w-full sm:w-auto px-8 py-4 text-lg"
              >
                <BookOpen size={24} />
                <span>Study Deck</span>
                <span className="bg-dark-800/50 px-3 py-1.5 rounded-lg text-sm font-bold text-neon-500">
                  {words.length}
                </span>
              </button>
              <button
                onClick={() => setIsAddWordModalOpen(true)}
                disabled={wordsLoading}
                className="modern-button w-full sm:w-auto px-8 py-4 text-lg"
              >
                <Plus size={24} />
                <span>Add Word</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <label htmlFor="search" className="block text-dark-100 font-ui text-sm mb-2 ml-1">
                  Search Words in "{deck?.name}"
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-dark-200" size={20} />
                  <input
                    id="search"
                    type="text"
                    placeholder="Type to search for words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={wordsLoading}
                    className="modern-input w-full pl-14 pr-5 py-5 font-ui text-lg"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-dark-100 font-ui text-sm mb-2 ml-1">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-3">
                  <Filter size={20} className="text-neon-500 ml-2" />
                  <select
                    id="difficulty"
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    disabled={wordsLoading}
                    className="modern-input flex-1 px-5 py-5 font-ui text-lg appearance-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Beginner</option>
                    <option value="medium">Intermediate</option>
                    <option value="hard">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">{words.length}</div>
              <div className="text-dark-100 font-ui">Total Words</div>
            </div>
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {words.filter(w => w.difficulty === 'easy').length}
              </div>
              <div className="text-dark-100 font-ui">Beginner</div>
            </div>
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {words.filter(w => w.difficulty === 'medium').length}
              </div>
              <div className="text-dark-100 font-ui">Intermediate</div>
            </div>
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {words.filter(w => w.difficulty === 'hard').length}
              </div>
              <div className="text-dark-100 font-ui">Advanced</div>
            </div>
          </div>

          {/* Words Grid */}
          {filteredWords.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-12">
                <div className="text-9xl mb-8 animate-float">✨</div>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-neon-500 mb-6">
                  {words.length === 0 ? 'Add Your First Word' : 'No Words Found'}
                </h3>
                <p className="text-dark-100 mb-12 max-w-lg mx-auto text-xl font-body leading-relaxed">
                  {words.length === 0 
                    ? `Start building your vocabulary in "${deck?.name}" by adding your first word.`
                    : 'Adjust your search criteria to discover more words.'
                  }
                </p>
              </div>
              {words.length === 0 && (
                <button
                  onClick={() => setIsAddWordModalOpen(true)}
                  disabled={wordsLoading}
                  className="modern-button primary px-10 py-5 text-xl"
                >
                  <Plus size={28} className="mr-3" />
                  Add First Word
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
              {filteredWords.map((word, index) => (
                <div 
                  key={word.id}
                  className="animate-slideInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <WordCard
                    word={word}
                    onEdit={handleEditWord}
                    onDelete={handleDeleteWord}
                    onPlayAudio={handlePlayAudio}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Word Modal */}
      <AddWordModal
        isOpen={isAddWordModalOpen}
        onClose={() => {
          setIsAddWordModalOpen(false);
          setEditingWord(null);
        }}
        onAdd={handleAddWord}
        onUpdate={handleUpdateWord}
        editingWord={editingWord}
        decks={deck ? [deck] : []}
        selectedDeckId={deckId}
        onDeckChange={() => {}}
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
} 