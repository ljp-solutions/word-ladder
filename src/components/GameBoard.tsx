import { useState, useEffect, useCallback, useRef } from 'react';

import { StatsButton } from './StatsButton';
import { useStats } from '../hooks/useStats';
import { saveGameResult, fetchDailyGame } from '../utils/gameService';
import { isValidMove } from '../utils/moveValidation';
import { motion } from 'framer-motion';
import HowToPlayModal from './HowToPlayModal';
import { ShareButton } from './ShareButton';
import InvalidMoveModal from './InvalidMoveModal';
import WinningMessage from "./WinningMessage";
import type { TodayResult } from '../types';

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

const InputRow: React.FC<{ 
  userInput: string[], 
  rowIndex: number, // Add rowIndex prop
  handleInputChange: (index: number, value: string) => void, 
  handleKeyPress: (e: React.KeyboardEvent) => void, 
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  isActive: boolean
}> = ({ userInput, rowIndex, handleInputChange, handleKeyPress, inputRefs, isActive }) => {
  return (
    <div className="flex justify-center gap-4 mt-1">
      {userInput.map((letter, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={letter}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyPress={handleKeyPress}
          ref={(el) => (inputRefs.current[rowIndex * 4 + index] = el)} // Update ref with correct index
          disabled={!isActive}
          className={`bg-gray-800 font-light text-white p-4 rounded-lg text-center w-16 h-16 uppercase text-4xl flex items-center justify-center
            ${!isActive ? 'opacity-80 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
};

export const GameBoard: React.FC = () => {
  // Add new state to track if game was just completed
  const [justCompleted, setJustCompleted] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('');
  const { stats, updateStats } = useStats();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [startWord, setStartWord] = useState<string | null>(null);
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [jokerSteps, setJokerSteps] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allResults, setAllResults] = useState<Array<{ correct_answer: string; game_date: string }>>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const storageAvailable = isLocalStorageAvailable();
  const [showPlayedMessage, setShowPlayedMessage] = useState(false);
  const [todayResult, setTodayResult] = useState<TodayResult | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [userInputs, setUserInputs] = useState<string[][]>([['', '', '', '']]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(100).fill(null)); // Increase array size to handle multiple rows
  const [invalidMoveMessage, setInvalidMoveMessage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pendingFocus, setPendingFocus] = useState<number | null>(null);
  const [showWinningMessage, setShowWinningMessage] = useState(false);
  const [turnsTaken, setTurnsTaken] = useState(0);

  useEffect(() => {
    const loadDailyGame = async () => {
      setIsLoading(true);
      const gameData = await fetchDailyGame();
      if (gameData) {
        setStartWord(gameData.start_word);
        setTargetWord(gameData.target_word);
        setJokerSteps(gameData.joker_steps);
      } else {
        setError("Unable to fetch today's game data");
      }
      setIsLoading(false);
    };

    loadDailyGame();
  }, []);

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

  // Add this new useEffect to handle focusing on new rows
  useEffect(() => {
    const lastRowIndex = userInputs.length - 1;
    if (lastRowIndex > 0) { // Only focus if we have more than one row
      inputRefs.current[lastRowIndex * 4]?.focus();
    }
  }, [userInputs.length]); // Trigger when number of rows changes

  // Add useEffect to handle scrolling
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [userInputs.length]);

  // Add new useEffect for initial focus
  useEffect(() => {
    if (!isLoading && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isLoading]);

  // Add new useEffect to handle focusing after new row is added
  useEffect(() => {
    if (pendingFocus !== null) {
      const inputToFocus = inputRefs.current[pendingFocus];
      if (inputToFocus) {
        inputToFocus.focus();
      }
      setPendingFocus(null);
    }
  }, [pendingFocus]);

  const handleMove = async (newWord: string, rowIndex: number) => {
    if (!startWord || !targetWord) return;

    const lastWord = userInputs[rowIndex - 1]?.join('') || startWord;

    if (await isValidMove(lastWord, newWord)) {
      const currentTurn = rowIndex + 1;
      setTurnsTaken(currentTurn);

      const normalizedNew = newWord.toUpperCase();
      const normalizedTarget = targetWord.toUpperCase();
      const won = normalizedNew === normalizedTarget;

      if (won) {
        setGameState('won');
        setShowWinningMessage(true);
        setShowConfetti(true);
        setJustCompleted(true);
        
        const newStreak = updateStats(true);
        try {
          // Save to database
          await saveGameResult(true, newStreak, currentTurn);
          
          // Save to localStorage (removed incorrect condition)
          const resultData: TodayResult = {
            word: newWord,
            won: true,
            turns: currentTurn,
            streak: newStreak
          };
          
          localStorage.setItem("lastPlayedDate", new Date().toDateString());
          localStorage.setItem("todayResult", JSON.stringify(resultData));
          setTodayResult(resultData);
          setHasPlayedToday(true);
        } catch (error) {
          console.error('Failed to save game result:', error);
        }
        return;
      }

      // If this was the last allowed guess and they didn't win
      if (currentTurn >= 6) {  // Assuming 6 is max turns
        setGameState('lost');
        setJustCompleted(true); // Set flag when game is lost too
        
        try {
          const newStreak = updateStats(false); // Reset streak for loss
          await saveGameResult(false, newStreak, currentTurn);
          
          const resultData: TodayResult = {
            word: newWord,
            won: false,
            turns: currentTurn,
            streak: 0  // Reset streak for loss
          };
          
          localStorage.setItem("lastPlayedDate", new Date().toDateString());
          localStorage.setItem("todayResult", JSON.stringify(resultData));
          setTodayResult(resultData);
          setHasPlayedToday(true);
        } catch (error) {
          console.error('Failed to save game result:', error);
        }
        return;
      }
      
      // Continue game if not won or lost
      const nextRowIndex = rowIndex + 1;
      setUserInputs([...userInputs, ['', '', '', '']]);
      
      setTimeout(() => {
        const firstInput = inputRefs.current[nextRowIndex * 4];
        if (firstInput) firstInput.focus();
      }, 50);
    } else {
      setInvalidMoveMessage("Invalid move! You can only change one letter or swap two letters.");
    }
  };



  const handleInputChange = (rowIndex: number, index: number, value: string) => {
    if (value.length > 1) return;
    
    // Update input value
    const newInputs = [...userInputs];
    newInputs[rowIndex][index] = value.toUpperCase();
    setUserInputs(newInputs);
    
    // Move to next input in same row if value was entered
    if (value && index < 3) { // Only move if not last input in row
      const nextInputIndex = rowIndex * 4 + index + 1;
      const nextInput = inputRefs.current[nextInputIndex];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, rowIndex: number) => {
    if (e.key === 'Enter') {
      handleMove(userInputs[rowIndex].join(''), rowIndex);
    }
  };

  const handleInvalidMoveClose = () => {
    setInvalidMoveMessage(null);
    const newInputs = [...userInputs];
    newInputs[newInputs.length - 1] = ['', '', '', ''];
    setUserInputs(newInputs);
  };

  // Update the render logic to consider justCompleted
  if (isLoading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (!startWord) return <div>No game available today</div>;

  return (
    <motion.div className="flex flex-col w-full">
      <div className="flex flex-col flex-grow space-y-8 md:space-y-10 pt-8 pb-0 md:py-6">
        {(!hasPlayedToday || isTestMode || justCompleted) ? (
          <>
            {/* Starting Word Panel */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
                <div className="text-gray-400 font-medium text-sm mb-3 text-center">START</div>
                <div className="flex justify-center gap-4">
                  {startWord?.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 font-light text-white p-4 rounded-lg text-center w-16 h-16 uppercase text-4xl flex items-center justify-center"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div 
              ref={scrollContainerRef}
              className="h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              <div className="flex flex-col gap-1">
                {userInputs.map((userInput, rowIndex) => (
                  <InputRow
                    key={rowIndex}
                    rowIndex={rowIndex} // Pass rowIndex to InputRow
                    userInput={userInput}
                    handleInputChange={(index, value) => handleInputChange(rowIndex, index, value)}
                    handleKeyPress={(e) => handleKeyPress(e, rowIndex)}
                    inputRefs={inputRefs}
                    isActive={rowIndex === userInputs.length - 1} // Only last row is active
                  />
                ))}
              </div>
            </div>

            {/* Target Word Panel */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg">
                <div className="text-gray-400 font-medium text-sm mb-3 text-center">TARGET</div>
                <div className="flex gap-4">
                  {targetWord?.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 font-light text-gray-200 p-4 rounded-lg text-center w-16 h-16 uppercase text-4xl flex items-center justify-center shadow-lg"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-sm mx-auto bg-gray-800/50 rounded-xl p-6
                      backdrop-blur-md border border-gray-700/30
                      flex flex-col items-center gap-4 mt-6"
          >
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-gray-100 font-medium text-lg font-sans">
                  You've already played today
                </h3>
                <p className="text-gray-400 text-sm mt-0.5 font-sans">
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
                  <span className="font-medium font-sans">
                    {todayResult.won 
                      ? `Success! You reached ${todayResult.word} in ${todayResult.turns} ${todayResult.turns === 1 ? 'turn' : 'turns'}` 
                      : `You chose ${todayResult.word} - Wrong!`}
                  </span>
                </div>
                {todayResult.won && (
                  <div className="text-gray-300 text-sm font-sans">
                    Current streak: {todayResult.streak}
                  </div>
                )}
                <div className="text-gray-400 text-sm font-sans">
                  {timeLeft}
                </div>
              </div>
            )}
            <div className="w-full flex justify-center mt-4">
              <ShareButton won={todayResult?.won} />
            </div>
          </motion.div>
        )}
      </div>
      
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {invalidMoveMessage && (
        <InvalidMoveModal
          onClose={handleInvalidMoveClose}
          message={invalidMoveMessage}
        />
      )}
      {showWinningMessage && (
        <WinningMessage 
          turnsTaken={turnsTaken} 
          onClose={() => setShowWinningMessage(false)} 
        />
      )}
    </motion.div>
  );
};