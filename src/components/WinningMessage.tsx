import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { TrophyIcon, SparklesIcon, ChartBarIcon, GlobeAltIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useStats } from '../hooks/useStats';
import { calculateWinRate } from '../utils/stats';
import { StatBox } from './StatBox';
import { ShareButton } from './ShareButton';
import { GuessDistribution } from './GuessDistribution';
import { CountdownTimer } from './CountdownTimer';

import { fetchGlobalStats } from '../utils/gameService';
import type { GlobalStats } from '../types';

interface WinningMessageProps {
  turnsTaken: number;
  onClose: () => void;
  onShowStats: () => void;  // Add new prop
}

const WinningMessage: React.FC<WinningMessageProps> = ({ turnsTaken, onClose, onShowStats }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { stats } = useStats();
  const [timeValues, setTimeValues] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadGlobalStats = async () => {
      const data = await fetchGlobalStats();
      setGlobalStats(data);
    };
    loadGlobalStats();
  }, [])

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

  const getComparisonMessage = () => {
    if (!globalStats?.ave_turns) return null;
  
    const minTurns = 3;
    const avgTurns = globalStats.ave_turns;
    const playerTurns = turnsTaken;
    
    // Check if scores match (within 0.1 to handle floating point)
    const isExactMatch = Math.abs(avgTurns - playerTurns) < 0.3;
    
    // Calculate position using min and max turns
    const maxTurns = Math.max(avgTurns, playerTurns) + 1;
    const position = ((playerTurns - minTurns) / (maxTurns - minTurns)) * 100;
    const avgPosition = ((avgTurns - minTurns) / (maxTurns - minTurns)) * 100;
    const isWinner = playerTurns <= avgTurns;

    return (
      <motion.div
        className="mt-3 rounded-lg px-6 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Progress Bar Container */}
        <div className="relative w-full h-4 bg-gray-600 rounded overflow-hidden mt-3">
          {isExactMatch ? (
            // Single yellow marker for exact match
            <motion.div
              className="absolute h-full bg-yellow-400/80"
              initial={{ width: 0 }}
              animate={{ 
                width: '4px',
                left: `calc(${position}% - 2px)`
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ) : (
            // Standard progress bar for different scores
            <>
              <motion.div
                className="absolute left-0 h-full bg-gray-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(avgPosition, position)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.div
                className={`absolute h-full ${isWinner ? "bg-green-400" : "bg-red-400"}`}
                initial={{ width: 0 }}
                animate={{
                  left: `${Math.min(avgPosition, position)}%`,
                  width: `${Math.abs(avgPosition - position)}%`
                }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </>
          )}
        </div>

        {/* Markers + Labels */}
        <div className="relative w-full">
          {isExactMatch ? (
            // Single marker for matching scores
            <>
              <div
                className="absolute w-[1.5px] h-5 bg-yellow-400 rounded-full"
                style={{ left: `calc(${position}% - 0.75px)`, top: "-18px" }}
              />
              <span
                className="absolute text-xs text-yellow-400 font-semibold whitespace-nowrap"
                style={{ left: `calc(${position}% - 60px)`, top: "-38px" }}
              >
                You matched average!
              </span>
              <span
                className="absolute text-sm text-yellow-400"
                style={{ left: `calc(${position}% - 4px)`, top: "4px" }}
              >
                {playerTurns}
              </span>
            </>
          ) : (
            // Separate markers for different scores
            <>
              <div
                className="absolute w-[1.5px] h-5 bg-gray-300 rounded-full"
                style={{ left: `calc(${avgPosition}% - 0.75px)`, top: "-18px" }}
              />
              <span
                className="absolute text-xs text-gray-300 font-semibold whitespace-nowrap"
                style={{ left: `calc(${avgPosition}% - 24px)`, top: "-38px" }}
              >
                Average
              </span>
              <span
                className="absolute text-sm text-gray-400"
                style={{ left: `calc(${avgPosition}% - 11px)`, top: "4px" }}
              >
                {avgTurns.toFixed(1)}
              </span>

              <div
                className="absolute w-[1.5px] h-5 rounded-full"
                style={{
                  left: `calc(${position}% - 0.75px)`,
                  top: "-18px",
                  backgroundColor: isWinner ? "#4ade80" : "#f87171",
                }}
              />
              <span
                className="absolute text-xs font-semibold whitespace-nowrap"
                style={{
                  left: `calc(${position}% - 12px)`,
                  top: "-38px",
                  color: isWinner ? "#4ade80" : "#f87171",
                }}
              >
                You
              </span>
              <span
                className="absolute text-sm text-gray-400"
                style={{ left: `calc(${position}% - 4px)`, top: "4px" }}
              >
                {playerTurns}
              </span>
            </>
          )}
        </div>
      </motion.div>
    );
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
                <TrophyIcon className="w-12 h-10 md:w-20 md:h-20 text-yellow-400 drop-shadow-lg" />
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
            <p className="text-gray-300 text-l md:text-2xl">
              You solved today's puzzle in <strong className="text-green-400">{turnsTaken} turns!</strong>
            </p>
            {getComparisonMessage()}
          </div>

          {/* Stats Section with Borders */}
          <div className="py-4 md:py-8 border-y border-white/10 flex-grow">
            
            {/* Stats in single row */}
            <div className="flex justify-between gap-1 md:gap-2 max-w-2xl mx-auto px-2 md:px-4 mb-4 md:mb-8">
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
            <div className="mt-6 md:mt-8">
              <h4 className="text-white/80 text-sm font-medium mb-1 md:mb-4">Moves Distribution</h4>
              <GuessDistribution distribution={stats.turnDistribution} />
              
              {/* Stats Button - Moved below distribution */}
              <motion.button 
                className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg 
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
