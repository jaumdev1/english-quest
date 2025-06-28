import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Folder, Users, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center py-4">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/') 
                ? 'text-neon-500 bg-neon-500/10' 
                : 'text-dark-200 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span className="text-xs font-ui">Home</span>
          </button>

          <button
            onClick={() => navigate('/decks')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/decks') 
                ? 'text-neon-500 bg-neon-500/10' 
                : 'text-dark-200 hover:text-white'
            }`}
          >
            <Folder size={20} />
            <span className="text-xs font-ui">Decks</span>
          </button>

          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-dark-200 hover:text-white"
          >
            <Settings size={20} />
            <span className="text-xs font-ui">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 