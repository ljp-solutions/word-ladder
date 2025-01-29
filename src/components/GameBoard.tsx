import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.1)]">
          Right Today
        </h1>
        <p className="text-lg md:text-xl text-gray-100 opacity-90 tracking-wide font-light mt-3 drop-shadow">
          A simple choice... or is it?
        </p>
      </div>

      {/* Game Buttons Container */}
      <div className="flex gap-4 md:gap-6 items-center justify-center w-full">
        {['left', 'right'].map((side) => (
          <button
            key={side}
            onClick={() => handleChoice(side as 'left' | 'right')}
            disabled={gameState !== 'playing'}
            className={`
              w-32 h-32 md:w-48 md:h-48
              rounded-lg text-xl md:text-3xl font-bold uppercase
              transition-all duration-300 delay-100 ease-out
              shadow-lg backdrop-blur-sm
              flex flex-col items-center justify-center gap-2
              ${gameState === 'playing'
                ? `
                  bg-white/10
                  hover:bg-white/15
                  hover:scale-[1.04]
                  hover:shadow-2xl
                  hover:[box-shadow:_0_0_20px_rgba(255,255,255,0.1)]
                  active:scale-95
                  ${side === 'left' 
                    ? 'text-blue-200 hover:text-blue-100'
                    : 'text-emerald-200 hover:text-emerald-100'
                  }
                `
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            <span className="transform transition-transform group-hover:scale-105">
              {side}
            </span>
            <span className="text-3xl md:text-4xl opacity-75">
              {side === 'left' ? '←' : '→'}
            </span>
          </button>
        ))}
      </div>

      {/* Fixed Height Results Container */}
      <div className="h-32 flex flex-col items-center justify-start mt-6">
        {/* Message Display */}
        {message && (
          <div className="text-2xl md:text-3xl font-medium text-center mb-4 animate-fade-scale flex items-center gap-2 justify-center">
            <span className={gameState === 'won' ? 'text-green-400' : 'text-red-400'}>
              {message}
            </span>
            {gameState === 'won' ? (
              <CheckCircleIcon className="w-8 h-8 text-green-400 animate-fade-scale" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-400 animate-fade-scale" />
            )}
          </div>
        )}

        {/* Reset Button */}
        {gameState !== 'playing' && (
          <button
            onClick={resetGame}
            className="px-6 py-2.5 text-sm font-medium
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