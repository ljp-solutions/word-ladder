import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SwitchIcon from "../components/appIcon";
import { StatsButton } from './StatsButton';
import { useStats } from '../hooks/useStats';
import { saveGameResult, fetchDailyAnswer, fetchLastFiveAnswers, fetchAllPreviousAnswers } from '../utils/gameService';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import HowToPlayModal from './HowToPlayModal';
import HowToPlayButton from './HowToPlayButton';
import { ShareButton } from './ShareButton';

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
  const [recentAnswers, setRecentAnswers] = useState<Array<{ correct_answer: string; game_date: string }>>([]);
  const [showModal, setShowModal] = useState(false);
  const [allResults, setAllResults] = useState<Array<{ correct_answer: string; game_date: string }>>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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

  useEffect(() => {
    const loadAnswers = async () => {
      const answers = await fetchLastFiveAnswers();
      setRecentAnswers(answers);
    };
    loadAnswers();
  }, []);

  // Add new effect to fetch all results
  useEffect(() => {
    const loadAllResults = async () => {
      const results = await fetchAllPreviousAnswers();
      setAllResults(results);
    };
    loadAllResults();
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

  if (isLoading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (!dailyAnswer) return <div>No game available today</div>;

  return (
    <motion.div className="relative flex flex-col min-h-screen h-screen w-full max-w-full 
                px-6 md:px-8 overflow-hidden">
      {/* Stats and Help Buttons - Fixed positioning without relative */}
      <div className="fixed top-4 right-4 z-10 flex items-center justify-end space-x-2">
        <HowToPlayButton onClick={() => setShowHowToPlay(true)} />
        <StatsButton />
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col flex-grow 
                space-y-4 md:space-y-10 pt-8 pb-0 md:py-6 md:justify-center">
        
        {/* Title Section */}
        <div className="h-36 md:h-auto flex flex-col items-center justify-center md:pb-4">
          <div className="inline-flex flex-col items-center gap-2">
            <SwitchIcon />
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Right Today
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-100 opacity-90 mt-2">
            A simple choice... or is it?
          </p>
        </div>

        {/* Recent Answers */}
        <div className="h-36 md:h-auto flex flex-col items-center justify-center 
                    mt-4 md:mt-0 md:py-6">
          <div className="text-center mb-2">
            <div className="relative inline-flex flex-col items-center">
              <h3 className="text-white/90 text-sm font-medium">Recent Answers</h3>
              <p className="text-gray-400 text-xs italic mt-1">Can you spot the pattern?</p>
              <button 
                onClick={() => setShowModal(true)}
                className="absolute -right-10 top-1/2 -translate-y-1/2
                         w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 
                         transition-all duration-300 flex items-center justify-center
                         border border-white/10"
                aria-label="View More Results"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700/30 my-3"></div>
          
          {/* Rest of Recent Answers content */}
          <div className="flex justify-center gap-4 items-center">
            {[...recentAnswers].reverse().map((answer, index) => {
              const dayName = new Intl.DateTimeFormat("en-US", { 
                weekday: "short" 
              }).format(new Date(answer.game_date));
              
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      w-6 h-6 md:w-7 md:h-7 rounded-full 
                      transition-all duration-300
                      flex items-center justify-center
                      ${answer.correct_answer === 'left' 
                        ? 'bg-blue-500/80 border-blue-400/30' 
                        : 'bg-green-500/80 border-green-400/30'
                      }
                      border backdrop-blur-sm
                    `}
                    title={`${answer.correct_answer} (${dayName})`}
                  >
                    <span className="text-[0.65rem] font-bold text-white/90">
                      {answer.correct_answer === 'left' ? 'L' : 'R'}
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-gray-400 font-medium">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Area */}
        <div className="h-52 md:h-auto flex flex-col items-center justify-center md:py-8">
          {/* Game Buttons */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-8 items-center justify-center w-full">
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
                  w-28 h-28 md:w-36 md:h-36
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
        </div>

        {/* Results Area */}
        <div className="h-40 md:h-auto flex flex-col items-center md:justify-center md:py-6">
          {message && (
            <div className="space-y-3">
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
              <ShareButton won={gameState === 'won'} />
            </div>
          )}
          {gameState !== 'playing' && (
            <div className="mt-auto text-gray-400 text-sm">{timeLeft}</div>
          )}
        </div>
      </div>

      {/* Modals remain unchanged */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {showModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900/95 rounded-xl shadow-xl w-full max-w-md
                     border border-white/10 backdrop-blur-sm
                     flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h3 className="text-white/90 text-lg font-semibold">Previous Results</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[75vh] overflow-y-auto overscroll-contain
                        scrollbar-thin scrollbar-track-gray-800/30 
                        scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
              <ul className="divide-y divide-gray-700/50">
                {allResults.map((result, index) => {
                  const date = new Date(result.game_date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <li key={index} className="py-3 first:pt-4 last:pb-4">
                      <div className="px-6 flex items-center justify-between gap-4">
                        <div className="min-w-[200px] text-left">
                          <span className="text-sm md:text-base font-medium text-gray-300">
                            {date}
                          </span>
                        </div>
                        <div className={`
                          w-7 h-7 shrink-0 rounded-full 
                          flex items-center justify-center
                          font-semibold text-sm
                          border border-white/10
                          ${result.correct_answer === 'left' 
                            ? 'bg-blue-500/90 text-white shadow-sm shadow-blue-500/20' 
                            : 'bg-green-500/90 text-white shadow-sm shadow-green-500/20'
                          }
                        `}>
                          {result.correct_answer === 'left' ? 'L' : 'R'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
    </motion.div>
  );
};