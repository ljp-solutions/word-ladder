import { useState, useEffect, useCallback, useRef } from 'react';

import { useStats } from '../hooks/useStats';
import { saveGameResult, fetchDailyGame } from '../utils/gameService';
import { isValidMove } from '../utils/moveValidation';
import { motion } from 'framer-motion';
import HowToPlayModal from './HowToPlayModal';
import { ShareButton } from './ShareButton';
import InvalidMoveModal from './InvalidMoveModal';
import WinningMessage from "./WinningMessage";
import type { TodayResult } from '../types';
import Keyboard from "./Keyboard"; // ✅ Import the custom keyboard


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
  rowIndex: number, 
  isActive: boolean 
}> = ({ userInput, rowIndex, isActive }) => {
  return (
    <div className="flex justify-center gap-3 px-2 py-1">
      {userInput.map((letter, index) => (
        <div
          key={index}
          className={`bg-gray-800 font-light text-white p-3 rounded-lg text-center 
            w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl 
            flex items-center justify-center border-2 
            ${isActive ? 'border-blue-500' : 'border-gray-600'}`}
        >
          {letter || ""}
        </div>
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
  const [pendingFocus, setPendingFocus] = useState<number | null>(null);
  const [showWinningMessage, setShowWinningMessage] = useState(false);
  const [turnsTaken, setTurnsTaken] = useState(0);

  const handleCustomKeyPress = (key: string) => {
    setUserInputs((prevInputs) => {
      // Create a deep copy of the array to avoid direct mutation
      const newInputs = prevInputs.map(row => [...row]); 
      const activeRow = newInputs[newInputs.length - 1];
  
      // Find the first empty slot in the row
      const emptyIndex = activeRow.findIndex((letter) => letter === "");
      if (emptyIndex !== -1) {
        activeRow[emptyIndex] = key; // Only update one box at a time
      }
  
      return newInputs;
    });
  };
  
  const handleDelete = () => {
    setUserInputs((prevInputs) => {
      const newInputs = prevInputs.map(row => [...row]); // Create a deep copy to avoid modifying state directly
      const activeRow = newInputs[newInputs.length - 1];
  
      // Find the last non-empty letter in the row
      let lastIndex = activeRow.length - 1;
      while (lastIndex >= 0 && activeRow[lastIndex] === "") {
        lastIndex--; // Move backwards to find the last filled letter
      }
  
      if (lastIndex >= 0) {
        activeRow[lastIndex] = ""; // Remove the last letter
      }
  
      return newInputs;
    });
  };
  
  
  const handleEnter = () => {
    const currentWord = userInputs[userInputs.length - 1].join("");
    if (currentWord.length === 4) {
      handleMove(currentWord, userInputs.length - 1);
    }
  };
  

  // Add containerRef for scrolling management
  const containerRef = useRef<HTMLDivElement>(null);

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
            console.log("🏆 Winning condition met! Showing message.");
            setGameState('won');
            setShowWinningMessage(true); // ✅ Ensure the message is shown
            setShowConfetti(true);
            setJustCompleted(true);

            const newStreak = updateStats(true);
            try {
                await saveGameResult(true, newStreak, currentTurn);

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
                console.error('❌ Failed to save game result:', error);
            }
            return;
        }

        // Continue the game if not won
        const nextRowIndex = rowIndex + 1;
        setUserInputs([...userInputs, ['', '', '', '']]);

        setTimeout(() => {
            const firstInput = inputRefs.current[nextRowIndex * 4];
            if (firstInput) firstInput.focus();
        }, 50);
    } else {
        console.warn("❌ Invalid move detected! Showing modal.");
        setInvalidMoveMessage("Invalid move! You can only change one letter or swap two letters.");
        setTimeout(() => {
            setInvalidMoveMessage(null); // Clears modal after 2 seconds
        }, 2000);
    }
  };



  useEffect(() => {
    if (userInputs.length > 1) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const firstInput = inputRefs.current[(userInputs.length - 1) * 4];
          if (firstInput) {
            firstInput.focus({ preventScroll: true }); // Focus the first box of the new row
          }
          // Ensure scrolling to the bottom of the input area
          if (containerRef.current) {
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth", // Smooth scrolling animation
            });
          }
        });
      });
    }
  }, [userInputs]);
  
  
  const handleInputChange = (rowIndex: number, index: number, value: string) => {
    if (value.length > 1) return;
    
    const newInputs = [...userInputs];
    newInputs[rowIndex][index] = value.toUpperCase();
    setUserInputs(newInputs);
    
    // Only handle focus, no scrolling
    if (value && index < 3) {
      const nextInputIndex = rowIndex * 4 + index + 1;
      const nextInput = inputRefs.current[nextInputIndex];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter behavior
      const word = userInputs[rowIndex].join('');
      if (word.length === 4) {
        console.log('Processing word:', word); // Debug log
        handleMove(word, rowIndex);
      }
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
    <motion.div className="flex flex-col w-full min-h-[100dvh]">
      <div className="flex flex-col h-full">
        {(!hasPlayedToday || isTestMode || justCompleted) ? (
          <div className="grid grid-rows-[auto_1fr_auto] h-full gap-3 pt-4">
            
            {/* Section 1: Start Word - Fixed at Top */}
            <div className="flex flex-col items-center px-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-2">
                <div className="text-gray-400 font-medium text-sm mb-2 text-center">START</div>
                <div className="flex justify-center gap-3">
                  {startWord?.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 font-light text-white p-3 rounded-lg text-center w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl flex items-center justify-center"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Section 2: Input Area - Scrollable middle section */}
            <div className="flex flex-col px-4">
              <div ref={containerRef} className="h-[198px] relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="flex flex-col space-y-1">
                  {userInputs.map((userInput, idx) => (
                    <div key={`input-${idx}`} className="input-row">
                      <InputRow
                        rowIndex={idx}
                        userInput={userInput}
                        isActive={idx === userInputs.length - 1}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

  
            {/* Section 3: Target Word - Fixed Above the Keyboard */}
            <div className="flex flex-col items-center px-4 pb-2">
              <div className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-2">
                <div className="text-gray-400 font-medium text-sm mb-2 text-center">TARGET</div>
                <div className="flex justify-center gap-3">
                  {targetWord?.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 font-light text-gray-200 p-3 rounded-lg text-center w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl flex items-center justify-center"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Section 4: Custom Keyboard at Bottom */}
            <div className="fixed bottom-0 w-full max-w-2xl bg-gray-900 py-5">
              <div className="w-[min(460px,100%-32px)] mx-auto">
                <Keyboard onKeyPress={handleCustomKeyPress} onDelete={handleDelete} onEnter={handleEnter} />
              </div>
            </div>


            {invalidMoveMessage && (
              <InvalidMoveModal 
                message={invalidMoveMessage}
                onClose={() => setInvalidMoveMessage(null)}
              />
            )}
            {showWinningMessage && (
                <WinningMessage 
                    turnsTaken={turnsTaken} 
                    onClose={() => setShowWinningMessage(false)} 
                />
            )}


          </div>

          
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
              <ShareButton 
                won={todayResult?.won} 
                turns={todayResult?.turns}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
  
  
};