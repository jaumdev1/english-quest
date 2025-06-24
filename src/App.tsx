import { useState } from 'react';
import { Plus, BookOpen, Search, Filter, Trophy, Target, Zap } from 'lucide-react';
import { AddWordModal } from './components/AddWordModal';
import { WordCard } from './components/WordCard';
import { StudyMode } from './components/StudyMode';
import { useWords } from './hooks/useLocalStorage';
import { Word, WordFormData } from './types';
import './App.css';

function App() {
  const { words, addWord, updateWord, deleteWord, markAsReviewed } = useWords();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const handleAddWord = (wordData: WordFormData) => {
    // Simulate file upload (in a real app, you would upload to a server)
    const newWord = {
      ...wordData,
      audioUrl: wordData.audioFile ? URL.createObjectURL(wordData.audioFile) : undefined,
      imageUrl: wordData.imageFile ? URL.createObjectURL(wordData.imageFile) : undefined,
    };
    
    addWord(newWord);
  };

  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setIsAddModalOpen(true);
  };

  const handleDeleteWord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      deleteWord(id);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  const handleStudyComplete = (correctAnswers: number, totalQuestions: number) => {
    // Mark words as reviewed
    words.forEach(word => markAsReviewed(word.id));
    setIsStudyMode(false);
  };

  // Filter words
  const filteredWords = words.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.portuguese.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (isStudyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <StudyMode
          words={filteredWords}
          onComplete={handleStudyComplete}
          onBack={() => setIsStudyMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="gamified-card border-b-0 rounded-b-3xl shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-8 gap-6">
            <div className="text-center sm:text-left">
              <h1 className="gamified-title text-3xl sm:text-4xl lg:text-5xl mb-2">
                🎮 English Quest
              </h1>
              <p className="text-gray-700 font-medium">Transform your studies into an adventure!</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsStudyMode(true)}
                disabled={words.length === 0}
                className="gamified-button w-full sm:w-auto px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
              >
                <BookOpen size={20} />
                <span className="hidden sm:inline">START MISSION</span>
                <span className="sm:hidden">MISSION</span>
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">
                  {words.length}
                </span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-white/90 hover:bg-white text-gray-800 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold border-2 border-green-300 hover:border-green-400 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">ADD WORD</span>
                <span className="sm:hidden">+ NEW</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="🔍 Search for magical words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 placeholder-gray-600 font-medium shadow-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-green-600" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-800 font-medium shadow-lg"
              >
                <option value="all">🎯 All difficulties</option>
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="gamified-stats p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{words.length}</div>
            <div className="text-sm text-gray-700 font-medium">📚 Total Words</div>
          </div>
          <div className="gamified-stats p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {words.filter(w => w.difficulty === 'easy').length}
            </div>
            <div className="text-sm text-gray-700 font-medium">🟢 Easy</div>
          </div>
          <div className="gamified-stats p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {words.filter(w => w.difficulty === 'medium').length}
            </div>
            <div className="text-sm text-gray-700 font-medium">🟡 Medium</div>
          </div>
          <div className="gamified-stats p-6 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {words.filter(w => w.difficulty === 'hard').length}
            </div>
            <div className="text-sm text-gray-700 font-medium">🔴 Hard</div>
          </div>
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="text-8xl mb-6 animate-float">🎮</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {words.length === 0 ? 'No words added yet' : 'No words found'}
              </h3>
              <p className="text-gray-700 mb-8 max-w-md mx-auto text-lg">
                {words.length === 0 
                  ? 'Start your journey by adding your first magical word!'
                  : 'Try adjusting the search filters to find more treasures.'
                }
              </p>
            </div>
            {words.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="gamified-button px-8 py-4 rounded-xl text-lg animate-pulse"
              >
                <Zap size={24} className="mr-2" />
                ADD FIRST WORD
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
      </main>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingWord(null);
        }}
        onAdd={handleAddWord}
      />
    </div>
  );
}

export default App; 