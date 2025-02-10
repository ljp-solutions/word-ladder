import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useStats } from '../hooks/useStats';
import { calculateWinRate } from '../utils/stats';
import { StatBox } from './StatBox';
import { ShareButton } from './ShareButton';
import { GuessDistribution } from './GuessDistribution';

interface WinningMessageProps {
  turnsTaken: number;
  onClose: () => void;
}

const WinningMessage: React.FC<WinningMessageProps> = ({ turnsTaken, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { stats } = useStats();
  const [timeUntilNext, setTimeUntilNext] = useState('');

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}

      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 md:p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto text-center relative min-h-[60vh] md:min-h-[500px] flex flex-col">
          
          {/* Top Section */}
          <div className="mb-8">
            {/* Trophy Icon & Sparkles */}
            <div className="flex justify-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
              >
                <TrophyIcon className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </div>

            {/* Header */}
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
            >
              Congratulations!
            </motion.h3>

            {/* Success Message */}
            <p className="text-gray-300 text md:text-2xl">
              You solved today's puzzle in <strong className="text-green-400">{turnsTaken} turns!</strong>
            </p>
          </div>

          {/* Stats Section with Borders */}
          <div className="py-8 border-y border-white/10 flex-grow">
            
            {/* Stats in single row */}
            <div className="flex justify-between gap-2 max-w-2xl mx-auto px-4 mb-8">
              <StatBox 
                label="Games" 
                value={stats.totalGames} 
                className="flex-1 min-w-[60px]"
              />
              <StatBox 
                label="Win %" 
                value={`${calculateWinRate(stats.totalWins, stats.totalGames)}`}
                highlight="purple"
                className="flex-1 min-w-[60px]"
              />
              <StatBox 
                label="Streak" 
                value={stats.currentStreak} 
                highlight="gold"
                className="flex-1 min-w-[60px]"
              />
              <StatBox 
                label="Max Streak" 
                value={stats.bestStreak} 
                highlight="gold"
                className="flex-1 min-w-[60px]"
              />
            </div>

            {/* Guess Distribution */}
            <div className="mt-8">
              <h4 className="text-white/80 text-sm font-medium mb-4">Guess Distribution</h4>
              <GuessDistribution distribution={stats.turnDistribution} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8">
            <p className="text-gray-400 text-base mb-3">
              Come back tomorrow for a new challenge!
            </p>

            <p className="text-gray-500 text-sm mb-6">
              Next puzzle in: <span className="text-gray-300">{timeUntilNext}</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <ShareButton won={true} className="flex-1" />
              <motion.button 
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium transition-all duration-200"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
              >
                Awesome!
              </motion.button>
            </div>
          </div>

          {/* Sparkles Effect */}
          <motion.div 
            className="absolute -top-2 -right-2 text-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1.3, rotate: -10 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
          >
            <SparklesIcon className="w-8 h-8" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default WinningMessage;
