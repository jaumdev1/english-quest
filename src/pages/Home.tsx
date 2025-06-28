import { useNavigate } from 'react-router-dom';
import { BookOpen, Folder, Users, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDecks } from '../hooks/useDecks';
import { Navigation } from '../components/Navigation';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { decks, loading } = useDecks();

  const totalWords = decks.reduce((sum, deck) => sum + deck.wordCount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 pb-20">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="text-9xl mb-8 animate-float">✨</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neon-500 mb-6">
              Welcome to WordIn!
            </h2>
            <p className="text-dark-100 mb-12 max-w-2xl mx-auto text-xl font-body leading-relaxed">
              Master your vocabulary through organized decks and interactive study sessions. 
              Create your own collections and track your progress as you learn.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {decks.length}
              </div>
              <div className="text-dark-100 font-ui">Total Decks</div>
            </div>
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {totalWords}
              </div>
              <div className="text-dark-100 font-ui">Total Words</div>
            </div>
            <div className="modern-stats p-8 text-center">
              <div className="text-4xl font-display font-bold text-neon-500 mb-3">
                {decks.filter(d => d.isPublic).length}
              </div>
              <div className="text-dark-100 font-ui">Public Decks</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/decks')}
              disabled={loading}
              className="modern-button primary w-full sm:w-auto px-10 py-5 text-xl"
            >
              <Folder size={28} className="mr-3" />
              Manage Decks
            </button>
            
            {decks.length > 0 && (
              <button
                onClick={() => navigate('/decks')}
                disabled={loading}
                className="modern-button w-full sm:w-auto px-10 py-5 text-xl"
              >
                <BookOpen size={28} className="mr-3" />
                Start Studying
              </button>
            )}
          </div>

          {/* Recent Decks */}
          {decks.length > 0 && (
            <div className="mt-20">
              <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">
                Recent Decks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {decks.slice(0, 3).map((deck) => (
                  <div
                    key={deck.id}
                    onClick={() => navigate(`/deck/${deck.id}`)}
                    className="modern-card p-6 cursor-pointer hover:border-neon-500/50 transition-all duration-300"
                  >
                    <h4 className="text-xl font-display font-bold text-white mb-2">
                      {deck.name}
                    </h4>
                    {deck.description && (
                      <p className="text-dark-100 text-sm mb-4">
                        {deck.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-neon-500 font-bold">
                        {deck.wordCount} words
                      </span>
                      {deck.isPublic && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {decks.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate('/decks')}
                    className="text-neon-500 hover:text-neon-400 transition-colors"
                  >
                    View all {decks.length} decks →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
} 