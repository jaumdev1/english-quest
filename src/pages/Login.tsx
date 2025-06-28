import { GoogleButton } from '../components/GoogleButton';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Palavras para animação de fundo
const FLOATING_WORDS = [
  'Hello', 'Journey', 'Learn', 'Discover', 'Growth',
  'Knowledge', 'Practice', 'Study', 'Vocabulary', 'Master',
  'Success', 'Progress', 'Achievement', 'Excellence', 'Focus',
  'Dedication', 'Wisdom', 'Understanding', 'Fluency', 'Skills'
];

export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-dark-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {FLOATING_WORDS.map((word, index) => (
          <div
            key={word}
            className="absolute text-dark-400/10 font-display font-bold select-none pointer-events-none"
            style={{
              fontSize: `${Math.random() * 2 + 1}rem`,
              left: `${(index * 25) % 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'rotate(-30deg)',
              animation: `float-word ${Math.random() * 10 + 20}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-950/50 via-dark-950/80 to-dark-950"></div>

      {/* Login Container */}
      <div className="relative w-full max-w-md px-4">
        <div className="modern-card p-8 sm:p-10 flex flex-col items-center gap-10">
          {/* Title */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <h1 className="modern-title text-6xl sm:text-7xl lg:text-8xl mb-4">
                Word<span className="text-neon-500">In</span>
              </h1>
              <div className="absolute -inset-4 bg-neon-500/20 rounded-full blur-xl"></div>
            </div>
            <p className="text-dark-100 font-body text-lg sm:text-xl">
              Your gateway to vocabulary mastery
            </p>
          </div>

          {/* Login Button */}
          <div className="w-full">
            <GoogleButton onClick={login} loading={loading}>
              Continue with Google
            </GoogleButton>
          </div>

          {/* Terms */}
          <div className="text-dark-200 text-sm text-center font-ui">
            By continuing, you agree to our{' '}
            <button className="text-neon-500 hover:text-neon-400 transition-colors">
              terms
            </button>{' '}
            and{' '}
            <button className="text-neon-500 hover:text-neon-400 transition-colors">
              privacy policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 