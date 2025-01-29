import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export const GameBoard: React.FC = () => {
  const [winningChoice, setWinningChoice] = useState<'left' | 'right'>('left');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Randomly select winning choice when component mounts
    setWinningChoice(Math.random() < 0.5 ? 'left' : 'right');
  }, []);

  const handleChoice = (choice: 'left' | 'right') => {
    if (choice === winningChoice) {
      setGameState('won');
      setMessage('You Win!');
    } else {
      setGameState('lost');
      setMessage('Try Again Tomorrow!');
    }
  };

  const resetGame = () => {
    setGameState('playing');
    setMessage('');
    setWinningChoice(Math.random() < 0.5 ? 'left' : 'right');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 -mt-16">
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
          <button
            key={side}
            onClick={() => handleChoice(side as 'left' | 'right')}
            disabled={gameState !== 'playing'}
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
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            <span>{side}</span>
            <span className="text-2xl md:text-3xl opacity-90">
              {side === 'left' ? '←' : '→'}
            </span>
          </button>
        ))}
      </div>

      {/* Fixed Height Results Container */}
      <div className="h-32 flex flex-col items-center justify-center mt-6">
        {/* Message Display */}
        {message && (
          <div 
            className={`
              text-2xl md:text-3xl font-medium text-center 
              flex items-center gap-2 justify-center
              transition-all duration-300 ease-out
              opacity-0 scale-95 animate-fade-in animate-delay-200
              ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}
            `}
          >
            <span className="animate-[scale-105] transform-gpu">
              {message}
            </span>
            {gameState === 'won' ? (
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-400" />
            )}
          </div>
        )}

        {/* Reset Button (with adjusted positioning) */}
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
    </div>
  );
};