import React from 'react';
import { motion } from 'framer-motion';

interface GameButtonsProps {
  handleChoice: (choice: 'left' | 'right') => void;
  gameState: 'playing' | 'won' | 'lost';
  selectedChoice: 'left' | 'right' | null;
  hasPlayedToday: boolean;
  isTestMode: boolean;
}

const GameButtons: React.FC<GameButtonsProps> = ({ handleChoice, gameState, selectedChoice, hasPlayedToday, isTestMode }) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 items-center justify-center w-full">
      {['left', 'right'].map((side) => (
        <motion.button
          key={side}
          onClick={() => handleChoice(side as 'left' | 'right')}
          disabled={gameState !== 'playing' || (!isTestMode && hasPlayedToday)}
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
            w-28 h-28 md:w-32 md:h-32
            rounded-lg text-lg md:text-xl font-semibold uppercase tracking-wide
            transition-all duration-300 ease-out
            border border-white/10 backdrop-blur-md
            flex flex-col items-center justify-center gap-1
            shadow-md
            ${(gameState === 'playing' && (!hasPlayedToday || isTestMode))
              ? `
                bg-gray-800/30
                hover:bg-gray-700/40
                hover:scale-[1.05]
                ${side === 'left' 
                  ? 'text-blue-300 hover:text-blue-200' 
                  : 'text-green-300 hover:text-green-200'
                }
                active:scale-95
              `
              : `
                cursor-not-allowed
                ${selectedChoice === side 
                  ? gameState === 'won'
                    ? 'bg-green-500/10 text-green-300 border-green-500/20'
                    : 'bg-red-500/10 text-red-300 border-red-500/20'
                  : 'bg-gray-800/20 text-white/20'
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
  );
};

export default GameButtons;