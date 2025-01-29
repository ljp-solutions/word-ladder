import { useState, useEffect } from 'react';

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
      setMessage('You Win! 🎉');
    } else {
      setGameState('lost');
      setMessage('Try Again Tomorrow! 😢');
    }
  };

  const resetGame = () => {
    setGameState('playing');
    setMessage('');
    setWinningChoice(Math.random() < 0.5 ? 'left' : 'right');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title and Tagline */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
          Right Today
        </h1>
        <p className="text-lg md:text-xl text-gray-300 opacity-90 tracking-wide font-light mt-3">
          A simple choice... or is it?
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className="text-2xl md:text-3xl font-medium text-center mb-8 text-white/90 animate-fade-scale">
          {message}
        </div>
      )}

      {/* Game Buttons Container */}
      <div className="flex gap-4 md:gap-6 items-center justify-center w-full px-4">
        {['left', 'right'].map((side) => (
          <button
            key={side}
            onClick={() => handleChoice(side as 'left' | 'right')}
            disabled={gameState !== 'playing'}
            className={`
              w-32 h-32 md:w-48 md:h-48
              rounded-lg text-xl md:text-3xl font-bold uppercase
              transition-all duration-200 ease-out
              flex flex-col items-center justify-center gap-2
              ${gameState === 'playing'
                ? `
                  bg-white/10 backdrop-blur-sm
                  hover:bg-white/15
                  hover:scale-105 hover:ring-2 hover:ring-white/20
                  active:scale-95
                  ${side === 'left' 
                    ? 'text-blue-200'
                    : 'text-emerald-200'
                  }
                `
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            <span>{side}</span>
            <span className="text-3xl md:text-4xl">
              {side === 'left' ? '←' : '→'}
            </span>
          </button>
        ))}
      </div>

      {/* Reset Button */}
      {gameState !== 'playing' && (
        <button
          onClick={resetGame}
          className="mt-8 px-6 py-2.5 text-sm font-medium
            bg-white/10 text-white/80
            rounded-lg transition-all duration-200
            hover:bg-white/15 hover:scale-105
            active:scale-95"
        >
          Play Again
        </button>
      )}
    </div>
  );
};