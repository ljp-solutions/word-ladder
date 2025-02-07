import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ShareButton } from './ShareButton';

interface GameStatusProps {
  message: string;
  showResult: boolean;
  gameState: 'playing' | 'won' | 'lost';
  showConfetti: boolean;
  timeLeft: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ message, showResult, gameState, showConfetti, timeLeft }) => {
  return (
    <div className="h-40 md:h-auto flex flex-col items-center gap-0">
      {message && !showResult && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-white/10 rounded-full blur-xl"
            />
            <ArrowPathIcon className="w-12 h-12 text-white/80" />
          </motion.div>
        </motion.div>
      )}
      {message && showResult && (
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              text-2xl md:text-3xl font-medium text-center 
              flex items-center gap-2 justify-center
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
          <div className="flex justify-center w-full mt-1">
            <ShareButton won={gameState === 'won'} />
          </div>
        </div>
      )}
      {gameState !== 'playing' && showResult && (
        <div className="text-gray-400 text-sm mt-2">
          {timeLeft}
        </div>
      )}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </div>
  );
};

export default GameStatus;
