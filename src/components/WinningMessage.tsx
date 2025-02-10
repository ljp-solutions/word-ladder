import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { TrophyIcon, SparklesIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useStats } from '../hooks/useStats';
import { calculateWinRate } from '../utils/stats';
import { StatBox } from './StatBox';
import { ShareButton } from './ShareButton';
import { GuessDistribution } from './GuessDistribution';
import { CountdownTimer } from './CountdownTimer';

interface WinningMessageProps {
  turnsTaken: number;
  onClose: () => void;
  onShowStats: () => void;  // Add new prop
}

const WinningMessage: React.FC<WinningMessageProps> = ({ turnsTaken, onClose, onShowStats }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { stats } = useStats();
  const [timeValues, setTimeValues] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
      
      setTimeValues({ hours, minutes, seconds });
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    return () => clearInterval(countdownInterval);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}

      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-2 md:p-8"
        style={{ pointerEvents: 'auto' }}  // Ensure clicks are registered
        onClick={handleOverlayClick}  // Close on overlay click
      >
        <motion.div 
          className="bg-gray-900 p-4 md:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto text-center relative 
                     max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
                     flex flex-col"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}  // Prevent closing when clicking modal content
        >
          
          {/* Top Section - Made more compact on mobile */}
          <div className="mb-4 md:mb-8">
            {/* Trophy Icon & Sparkles */}
            <div className="flex justify-center mb-4 md:mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
              >
                <TrophyIcon className="w-12 h-12 md:w-20 md:h-20 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </div>

            {/* Header */}
            <motion.h3 
              className="text-xl md:text-3xl font-bold text-white drop-shadow-lg mb-2 md:mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
            >
              Congratulations!
            </motion.h3>

            {/* Success Message */}
            <p className="text-gray-300 text-lg md:text-2xl">
              You solved today's puzzle in <strong className="text-green-400">{turnsTaken} turns!</strong>
            </p>
          </div>

          {/* Stats Section with Borders */}
          <div className="py-4 md:py-8 border-y border-white/10 flex-grow">
            
            {/* Stats in single row */}
            <div className="flex justify-between gap-1 md:gap-2 max-w-2xl mx-auto px-2 md:px-4 mb-6 md:mb-8">
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
            <div className="mt-4 md:mt-8">
              <h4 className="text-white/80 text-sm font-medium mb-3 md:mb-4">Guess Distribution</h4>
              <GuessDistribution distribution={stats.turnDistribution} />
              
              {/* Stats Button - Moved below distribution */}
              <motion.button 
                className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg 
                          text-sm font-medium transition-all duration-200
                          flex items-center justify-center gap-2 mx-auto"
                onClick={onShowStats}
                whileHover={{ scale: 1.05 }}
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>More Stats</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-4 md:pt-8">
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
              Come back tomorrow for a new challenge!
            </p>

            <CountdownTimer 
              hours={timeValues.hours}
              minutes={timeValues.minutes}
              seconds={timeValues.seconds}
            />

            {/* Share Button - Centered */}
            <div className="mt-4 md:mt-8 flex justify-center ">
              <ShareButton 
                won={true} 
              />
            </div>
          </div>

          {/* Sparkles Effect - Updated positioning */}
          <motion.div 
            className="absolute top-2 right-2 text-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1.3, rotate: -10 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
          >
            <SparklesIcon className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default WinningMessage;
