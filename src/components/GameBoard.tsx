import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { StatsButton } from './StatsButton';
import { useStats } from '../hooks/useStats';
import { saveGameResult, fetchDailyAnswer } from '../utils/gameService';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

export const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('');
  const { stats, updateStats } = useStats();
  const [selectedChoice, setSelectedChoice] = useState<'left' | 'right' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [dailyAnswer, setDailyAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDailyAnswer = async () => {
      setIsLoading(true);
      const answer = await fetchDailyAnswer();
      if (answer) {
        setDailyAnswer(answer);
      } else {
        setError("Unable to fetch today's answer");
      }
      setIsLoading(false);
    };

    loadDailyAnswer();
  }, []);

  // Add countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextGame = new Date();
      nextGame.setUTCHours(24, 0, 0, 0);

      const diff = nextGame.getTime() - now.getTime();
      if (diff <= 0) return setTimeLeft("Game Available Now!");

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`Next game in: ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChoice = useCallback(async (choice: 'left' | 'right') => {
    if (isLoading || !dailyAnswer || gameState !== 'playing') return;

    setSelectedChoice(choice);
    const won = choice === dailyAnswer;
    const newStreak = updateStats(won);

    if (won) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5s
    }

    setGameState(won ? 'won' : 'lost');
    setMessage(won ? 'You Win!' : 'Try Again Tomorrow!');

    try {
      await saveGameResult(won, newStreak);
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  }, [dailyAnswer, gameState, isLoading, updateStats]);

  const resetGame = useCallback(() => {
    setGameState('playing');
    setMessage('');
    setSelectedChoice(null); // Reset selected choice
  }, []);

  if (isLoading) return <div>Loading today's game...</div>;
  if (error) return <div>{error}</div>;
  if (!dailyAnswer) return <div>No game available today</div>;

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 -mt-16"
      animate={gameState === 'lost' ? {
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
      } : {}}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <StatsButton />
      
      {/* Title and Tagline */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.1)] inline-flex items-center gap-2">
          Right Today
          <QuestionMarkCircleIcon className="w-[1.1em] h-[1.1em] text-white/70 animate-pulse relative -bottom-[0.05em]" />
        </h1>
        <p className="text-lg md:text-xl text-gray-100 opacity-90 tracking-wide font-light mt-4 drop-shadow">
          A simple choice... or is it?
        </p>
      </div>

      {/* Game Buttons Container */}
      <div className="flex gap-3 md:gap-6 items-center justify-center w-full max-w-2xl">
        {['left', 'right'].map((side) => (
          <motion.button
            key={side}
            onClick={() => handleChoice(side as 'left' | 'right')}
            disabled={gameState !== 'playing'}
            whileTap={{ scale: 0.95 }}
            animate={
              selectedChoice === side && gameState !== 'playing'
                ? { 
                    scale: [1, 1.1, 1.05],
                    transition: { duration: 0.3 }
                  } 
                : {
                    scale: 1,
                    transition: { duration: 0.3 }
                  }
            }
            className={`
              w-28 h-28 md:w-40 md:h-40
              rounded-lg text-lg md:text-2xl font-bold uppercase tracking-wide
              transition-all duration-300 ease-out
              border border-white/20 backdrop-blur-lg
              flex flex-col items-center justify-center gap-2
              ${gameState === 'playing'
                ? `
                  bg-white/10
                  hover:bg-white/15
                  hover:scale-[1.04]
                  hover:shadow-lg
                  ${side === 'left' 
                    ? 'text-blue-300 hover:text-blue-200 hover:shadow-blue-500/20'
                    : 'text-green-300 hover:text-green-200 hover:shadow-green-500/20'
                  }
                  active:scale-95
                `
                : `
                  cursor-not-allowed
                  ${selectedChoice === side 
                    ? gameState === 'won'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-white/5 text-white/20'
                  }
                `
              }
            `}
          >
            <span>{side}</span>
            <span className="text-2xl md:text-3xl opacity-90">
              {side === 'left' ? '←' : '→'}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Results and Countdown Container */}
      <div className="h-40 flex flex-col items-center justify-start mt-6">
        {/* Message Display */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              text-2xl md:text-3xl font-medium text-center 
              flex items-center gap-2 justify-center mb-2
              ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}
            `}
          >
            <span>{message}</span>
            {gameState === 'won' ? (
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-400" />
            )}
          </motion.div>
        )}

        {/* Countdown Timer */}
        {gameState !== 'playing' && (
          <div className="text-gray-400 text-sm">{timeLeft}</div>
        )}

        {/* Reset Button */}
        {gameState !== 'playing' && (
          <button
            onClick={resetGame}
            className="px-6 py-2.5 text-sm font-medium mt-4
              bg-white/10 text-white/90
              rounded-lg transition-all duration-300
              hover:bg-white/15 hover:scale-105 hover:shadow-lg
              active:scale-95 backdrop-blur-sm"
          >
            Play Again
          </button>
        )}
      </div>
    </motion.div>
  );
};