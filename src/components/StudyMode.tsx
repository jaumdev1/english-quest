import { useState } from 'react';
import { Check, X, Volume2, ArrowRight, Trophy, Target, Zap } from 'lucide-react';
import { Word } from '../types';

interface StudyModeProps {
  words: Word[];
  onComplete: (correctAnswers: number, totalQuestions: number) => void;
  onBack: () => void;
}

export function StudyMode({ words, onComplete, onBack }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsComplete(true);
      onComplete(correctAnswers + (isCorrect ? 1 : 0), words.length);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-6xl mb-6 animate-float">🎮</div>
        <p className="text-xl text-gray-700 mb-8 font-medium">No words to study.</p>
        <button
          onClick={onBack}
          className="gamified-button px-8 py-4 rounded-xl text-lg"
        >
          <ArrowRight size={24} className="mr-2" />
          BACK TO MENU
        </button>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((correctAnswers / words.length) * 100);
    const getScoreMessage = () => {
      if (percentage >= 90) return "🏆 EXCELLENT! You are a master!";
      if (percentage >= 70) return "🎯 VERY GOOD! Keep it up!";
      if (percentage >= 50) return "👍 GOOD! You are progressing!";
      return "💪 Keep practicing! You will improve!";
    };

    return (
      <div className="text-center py-12 px-4">
        <div className="gamified-card rounded-3xl p-12 max-w-2xl mx-auto">
          <div className="text-8xl mb-6 animate-float">🏆</div>
          <h2 className="gamified-title text-4xl sm:text-5xl mb-6">MISSION COMPLETED!</h2>
          <p className="text-xl text-gray-700 mb-8 font-medium">
            {getScoreMessage()}
          </p>
          <div className="text-6xl sm:text-7xl font-bold text-green-600 mb-8 animate-pulse">
            {percentage}%
          </div>
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-6 mb-8">
            <p className="text-lg text-green-900 font-semibold">
              You got <span className="text-2xl text-green-700">{correctAnswers}</span> out of <span className="text-2xl text-green-700">{words.length}</span> words right!
            </p>
          </div>
          <button
            onClick={onBack}
            className="gamified-button px-10 py-5 rounded-2xl text-xl"
          >
            <Trophy size={28} className="mr-3" />
            BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-800 font-semibold">
            🎯 Word {currentIndex + 1} of {words.length}
          </span>
          <span className="text-lg text-gray-800 font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-500 to-green-700 h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Word Card */}
      <div className="gamified-card rounded-3xl p-8 sm:p-12 mb-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            {currentWord.english}
          </h2>
          
          {currentWord.pronunciation && (
            <p className="text-xl sm:text-2xl text-gray-700 font-mono mb-8 bg-gray-200 px-6 py-3 rounded-2xl inline-block border border-gray-400">
              {currentWord.pronunciation}
            </p>
          )}

          {currentWord.audioUrl && (
            <button
              onClick={() => handlePlayAudio(currentWord.audioUrl!)}
              className="mb-8 p-6 bg-green-200 text-green-700 rounded-full hover:bg-green-300 transition-all duration-300 border-2 border-green-400 hover:scale-110"
              title="Play audio"
            >
              <Volume2 size={40} />
            </button>
          )}

          {currentWord.imageUrl && (
            <div className="mb-10">
              <img
                src={currentWord.imageUrl}
                alt={currentWord.english}
                className="w-full max-w-lg mx-auto h-64 sm:h-80 object-cover rounded-2xl border-4 border-green-300 shadow-2xl"
              />
            </div>
          )}

          {!showAnswer ? (
            <button
              onClick={handleShowAnswer}
              className="gamified-button px-10 py-5 rounded-2xl text-xl mx-auto"
            >
              <Target size={28} className="mr-3" />
              REVEAL ANSWER
              <ArrowRight size={28} className="ml-3" />
            </button>
          ) : (
            <div className="space-y-8">
              <div className="p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <p className="text-3xl sm:text-4xl text-gray-900 font-bold">
                  {currentWord.portuguese}
                </p>
              </div>
              
              {currentWord.notes && (
                <div className="p-6 bg-yellow-100 rounded-2xl border-2 border-yellow-300">
                  <p className="text-lg text-yellow-900 font-medium">{currentWord.notes}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => handleAnswer(false)}
                  className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <X size={32} />
                  WRONG
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Check size={32} />
                  CORRECT!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-200"
        >
          ← Exit Mission
        </button>
        <div className="flex items-center gap-3 text-lg text-gray-800 font-semibold">
          <Target size={24} className="text-green-600" />
          Correct: <span className="text-green-600 text-2xl font-bold">{correctAnswers}</span>
        </div>
      </div>
    </div>
  );
} 