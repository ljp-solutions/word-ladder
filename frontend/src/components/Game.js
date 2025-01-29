import React, { useState, useEffect } from 'react';

const Game = () => {
  const [winningChoice, setWinningChoice] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setWinningChoice(Math.random() < 0.5 ? 'left' : 'right');
  }, []);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowResult(true);
  };

  const resetGame = () => {
    setSelectedChoice(null);
    setShowResult(false);
    setWinningChoice(Math.random() < 0.5 ? 'left' : 'right');
  };

  const isWinner = selectedChoice === winningChoice;

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="flex flex-row gap-4 mb-8">
        <button
          onClick={() => handleChoice('left')}
          disabled={showResult}
          className={`flex-1 h-32 sm:h-40 text-2xl sm:text-3xl font-bold rounded-2xl transition-all duration-300
            backdrop-blur-md bg-white/10 border border-white/20
            ${showResult ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-white/20 hover:shadow-glow active:scale-95'}
            text-white shadow-lg flex flex-col items-center justify-center`}
        >
          <span>Left</span>
          <span className="text-3xl sm:text-4xl mt-2">←</span>
        </button>
        <button
          onClick={() => handleChoice('right')}
          disabled={showResult}
          className={`flex-1 h-32 sm:h-40 text-2xl sm:text-3xl font-bold rounded-2xl transition-all duration-300
            backdrop-blur-md bg-white/10 border border-white/20
            ${showResult ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-white/20 hover:shadow-glow active:scale-95'}
            text-white shadow-lg flex flex-col items-center justify-center`}
        >
          <span>Right</span>
          <span className="text-3xl sm:text-4xl mt-2">→</span>
        </button>
      </div>

      {showResult && (
        <div className="text-center animate-fade-in">
          <p className={`text-3xl font-bold mb-6 ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
            {isWinner ? 'You Win! 🎉' : 'Try Again Tomorrow 😢'}
          </p>
          <button
            onClick={resetGame}
            className="px-8 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
              transition-all duration-300 backdrop-blur-md border border-white/20
              hover:shadow-glow active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
