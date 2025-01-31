import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon, MagnifyingGlassIcon, ArrowPathIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import SwitchIcon from "../components/appIcon";
import { StatsButton } from './StatsButton';
import { useStats } from '../hooks/useStats';
import { saveGameResult, fetchDailyAnswer, fetchLastFiveAnswers, fetchAllPreviousAnswers } from '../utils/gameService';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import HowToPlayModal from './HowToPlayModal';
import HowToPlayButton from './HowToPlayButton';
import { ShareButton } from './ShareButton';

const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
};

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
  const [showResult, setShowResult] = useState(false);
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const storageAvailable = isLocalStorageAvailable();
  const [showPlayedMessage, setShowPlayedMessage] = useState(false);
  const [todayResult, setTodayResult] = useState<{ choice: string; won: boolean } | null>(null);

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

  // Add effect to check last played date
  useEffect(() => {
    if (!storageAvailable || isTestMode) return;
    
    try {
      const lastPlayedDate = localStorage.getItem("lastPlayedDate");
      const today = new Date().toDateString();
      const savedResult = localStorage.getItem("todayResult");
      
      if (lastPlayedDate === today && savedResult) {
        setHasPlayedToday(true);
        setTodayResult(JSON.parse(savedResult));
      }
    } catch (error) {
      console.warn('Failed to check last played date:', error);
    }
  }, [isTestMode, storageAvailable]);

  const handleChoice = useCallback(async (choice: 'left' | 'right') => {
    if (isLoading || !dailyAnswer || gameState !== 'playing') return;
    if (!isTestMode && hasPlayedToday) return;

    setSelectedChoice(choice);
    const won = choice === dailyAnswer;
    const newStreak = updateStats(won);

    // Save play date to localStorage with availability check
    if (!isTestMode && storageAvailable) {
      try {
        localStorage.setItem("lastPlayedDate", new Date().toDateString());
        localStorage.setItem("todayResult", JSON.stringify({ choice, won }));
        setHasPlayedToday(true);
        setTodayResult({ choice, won });
      } catch (error) {
        console.warn('Failed to save play date:', error);
      }
    }

    // Add delay before showing result
    setGameState(won ? 'won' : 'lost');
    setMessage(won ? 'You Win!' : 'Try Again Tomorrow!');
    
    // Show result after delay
    setTimeout(() => {
      setShowResult(true);
      if (won) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 3000);

    try {
      await saveGameResult(won, newStreak);
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  }, [dailyAnswer, gameState, isLoading, updateStats, hasPlayedToday, isTestMode, storageAvailable]);

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
                space-y-12 md:space-y-10 pt-8 pb-0 md:py-6 md:justify-center">
        
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

        {/* Recent Answers - Horizontal Cards */}
        <div className="w-full mt-4 md:mt-0 mb-9 md:mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-white/90 text-sm md:text-base font-medium">Recent Answers</h3>
            <button 
              onClick={() => setShowModal(true)}
              className="w-6 h-6 rounded-full bg-gray-700/60 hover:bg-gray-600/80 
                       transition-all duration-300 flex items-center justify-center
                       border border-white/10"
              aria-label="View All Results"
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-white/70" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2 px-1">
            {[...recentAnswers].reverse().map((answer, index) => {
              const date = new Date(answer.game_date);
              const dayName = new Intl.DateTimeFormat("en-US", { 
                weekday: "short" 
              }).format(date);

              return (
                <div 
                  key={index} 
                  className="bg-gray-800/30 rounded-lg p-2.5
                           border border-white/5 backdrop-blur-sm
                           flex flex-col items-center gap-2
                           hover:bg-gray-800/40 transition-all duration-300"
                >
                  <div className={`
                    w-7 h-7 md:w-8 md:h-8 rounded-full 
                    flex items-center justify-center
                    transition-all duration-300
                    ${answer.correct_answer === 'left'
                      ? 'bg-blue-500/80 border-blue-400/30' 
                      : 'bg-green-500/80 border-green-400/30'
                    }
                    border backdrop-blur-sm
                  `}>
                    <span className="text-xs md:text-sm font-bold text-white/90">
                      {answer.correct_answer === 'left' ? 'L' : 'R'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Area or Already Played Message */}
        <div className="h-auto flex flex-col items-center justify-center">
          {(!hasPlayedToday || isTestMode) ? (
            // Game Buttons
            <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-8 items-center justify-center w-full">
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
                    w-28 h-28 md:w-36 md:h-36
                    rounded-lg text-lg md:text-2xl font-bold uppercase tracking-wide
                    transition-all duration-300 ease-out
                    border border-white/5 backdrop-blur-sm
                    flex flex-col items-center justify-center gap-2
                    ${(gameState === 'playing' && (!hasPlayedToday || isTestMode))
                      ? `
                        bg-gray-800/30
                        hover:bg-gray-800/40
                        hover:scale-[1.02]
                        hover:shadow-lg
                        ${side === 'left' 
                          ? 'text-blue-300 hover:text-blue-200 hover:border-blue-500/20' 
                          : 'text-green-300 hover:text-green-200 hover:border-green-500/20'
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
          ) : (
            // Already played message with today's result
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-sm mx-auto bg-gray-800/50 rounded-xl p-6
                        backdrop-blur-md border border-gray-700/30
                        flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3">
                
                <div>
                  <h3 className="text-gray-100 font-medium text-lg">
                    You've already played today
                  </h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Come back tomorrow for a new challenge!
                  </p>
                </div>
              </div>

              {todayResult && (
                <div className="w-full flex flex-col items-center gap-3 mt-2">
                  <div className={`
                    w-full px-4 py-3 rounded-lg text-center
                    ${todayResult.won 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                    } border
                  `}>
                    <span className="font-medium">
                      You chose {todayResult.choice} - {todayResult.won ? 'Correct!' : 'Wrong!'}
                    </span>
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    {timeLeft}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Area - Only show during gameplay */}
        {(!hasPlayedToday || isTestMode) && (
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
              <div className="text-gray-400 text-sm mt-2">{timeLeft}</div>
            )}
          </div>
        )}
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