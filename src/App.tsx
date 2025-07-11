import { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, Filter } from 'lucide-react';
import { AddWordModal } from './components/AddWordModal';
import { WordCard } from './components/WordCard';
import { StudyMode } from './components/StudyMode';
import { Notification } from './components/Notification';
import { useWordsAPI } from './hooks/useWordsAPI';
import { Word, WordFormData } from './types';
import './App.css';

function App() {
  const {
    words,
    loading,
    error,
    createWord,
    updateWord,
    deleteWord,
    markAsReviewed,
    clearError,
  } = useWordsAPI();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Limpar mensagem de sucesso após 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // CREATE - Adicionar nova palavra
  const handleAddWord = async (wordData: WordFormData) => {
    try {
      await createWord(wordData);
      setSuccessMessage('Palavra criada com sucesso! 🎉');
      setIsAddModalOpen(false);
    } catch (error) {
      // Erro já é gerenciado pelo hook
      console.error('Erro ao criar palavra:', error);
    }
  };

  // UPDATE - Editar palavra
  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setIsAddModalOpen(true);
  };

  // UPDATE - Atualizar palavra (quando modal é fechado com dados)
  const handleUpdateWord = async (wordData: WordFormData) => {
    if (!editingWord) return;

    try {
      await updateWord(editingWord.id, wordData);
      setSuccessMessage('Palavra atualizada com sucesso! ✨');
      setIsAddModalOpen(false);
      setEditingWord(null);
    } catch (error) {
      console.error('Erro ao atualizar palavra:', error);
    }
  };

  // DELETE - Deletar palavra
  const handleDeleteWord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      try {
        await deleteWord(id);
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
      
      setSuccessMessage(`Missão completada! ${correctAnswers}/${totalQuestions} acertos! 🏆`);
      setIsStudyMode(false);
    } catch (error) {
      console.error('Erro ao marcar palavras como revisadas:', error);
    }
  };

  // Filtrar palavras localmente (pode ser substituído por busca na API)
  const filteredWords = words.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.portuguese.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

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
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* Notifications */}
      <Notification
        type="error"
        message={error || ''}
        onClose={clearError}
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
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsStudyMode(true)}
                disabled={words.length === 0 || loading}
                className="modern-button primary w-full sm:w-auto px-8 py-4 text-lg"
              >
                <BookOpen size={24} />
                <span>Begin Journey</span>
                <span className="bg-dark-800/50 px-3 py-1.5 rounded-lg text-sm font-bold text-neon-500">
                  {words.length}
                </span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                disabled={loading}
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
                  Search Words
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-dark-200" size={20} />
                  <input
                    id="search"
                    type="text"
                    placeholder="Type to search for words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
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
                    disabled={loading}
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
                  {words.length === 0 ? 'Begin Your Journey' : 'No Words Found'}
                </h3>
                <p className="text-dark-100 mb-12 max-w-lg mx-auto text-xl font-body leading-relaxed">
                  {words.length === 0 
                    ? 'Start building your vocabulary by adding your first word.'
                    : 'Adjust your search criteria to discover more words.'
                  }
                </p>
              </div>
              {words.length === 0 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={loading}
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWord}
        onUpdate={handleUpdateWord}
        editingWord={editingWord}
      />
    </div>
  );
}

export default App; 