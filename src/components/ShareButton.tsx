import { ShareIcon } from '@heroicons/react/24/outline';
import { formatShareMessage } from '../utils/shareMessage';
import { loadGameState } from '../utils/localStorage';
import { fetchDailyGame, calculateGameNumber } from '../utils/gameService';
import { useEffect, useState } from 'react';

export const ShareButton: React.FC = () => {
  const [dailyGame, setDailyGame] = useState<{ start_word: string; target_word: string } | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      const gameData = await fetchDailyGame();
      if (gameData) {
        setDailyGame({
          start_word: gameData.start_word,
          target_word: gameData.target_word
        });
      }
    };
    loadGame();
  }, []);

  const handleShare = async () => {
    const gameState = loadGameState();
    if (!gameState || !dailyGame) return;

    // Get completed words (excluding start and target words)
    const completedWords = gameState.userInputs
      .filter(row => row.every(cell => cell !== ''))
      .map(row => row.join(''));
    
    const todayResult = localStorage.getItem("todayResult");
    if (!todayResult) return;
    
    const result = JSON.parse(todayResult);
    const message = formatShareMessage(
      calculateGameNumber(),
      completedWords,
      dailyGame.target_word,
      result.won,
      result.turns
    );
    
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (error) {
        await navigator.clipboard.writeText(message);
      }
    } else {
      await navigator.clipboard.writeText(message);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Share
    </button>
  );
};
