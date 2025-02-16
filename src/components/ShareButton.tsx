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
        setDailyGame(gameData);
      }
    };
    loadGame();
  }, []);

  const handleShare = async () => {
    const gameState = loadGameState();
    if (!gameState || !dailyGame) return;

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

    const shareData = {
      text: message,
      title: 'SWAPPLE - Daily Word Game',
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        alert('Copied to clipboard!');
      } else {
        prompt('Copy this text to share:', message);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // User canceled share, do nothing
      }
      // Fallback if sharing failed
      try {
        await navigator.clipboard.writeText(message);
        alert('Copied to clipboard!');
      } catch {
        prompt('Copy this text to share:', message);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-6 py-2.5 text-sm font-medium
        bg-green-700 text-white/90
        rounded-lg transition-all duration-300
        hover:bg-green-700 hover:scale-105 hover:shadow-lg
        active:scale-95 backdrop-blur-sm
        flex items-center justify-center gap-2"
    >
      <ShareIcon className="w-5 h-5" />
      Share Result
    </button>
  );
};
