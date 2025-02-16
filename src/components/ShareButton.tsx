import { ShareIcon } from '@heroicons/react/24/outline';
import { formatShareMessage } from '../utils/shareMessage';
import { loadGameState } from '../utils/localStorage';
import { fetchDailyGame, calculateGameNumber } from '../utils/gameService';
import { useEffect, useState } from 'react';

export const ShareButton: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dailyGame, setDailyGame] = useState<{ start_word: string; target_word: string } | null>(null);
  const [shareData, setShareData] = useState<string | null>(null);

  useEffect(() => {
    const prepareShareData = async () => {
      const gameData = await fetchDailyGame();
      if (gameData) {
        setDailyGame(gameData);
      }
      setLoading(false);

      if (!gameData) return;
      
      setDailyGame(gameData);

      const gameState = loadGameState();
      const todayResult = localStorage.getItem("todayResult");
      
      if (gameState && todayResult) {
        const result = JSON.parse(todayResult);
        const completedWords = gameState.userInputs
          .filter(row => row.every(cell => cell !== ''))
          .map(row => row.join(''));

        const message = formatShareMessage(
          calculateGameNumber(),
          completedWords,
          gameData.target_word,
          result.won,
          result.turns
        );
        
        setShareData(message);
      }
    };

    prepareShareData();
  }, []);

  const handleClick = () => {
    if (!shareData) return;

    // Direct user interaction - should work in Safari
    if (navigator.share) {
      navigator.share({ text: shareData })
        .catch(() => {
          navigator.clipboard.writeText(shareData);
          alert('Copied to clipboard!');
        });
    } else {
      navigator.clipboard.writeText(shareData);
      alert('Copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-6 py-2.5 text-sm font-medium
        bg-green-700 text-white/90
        rounded-lg transition-all duration-300
        hover:bg-green-700 hover:scale-105 hover:shadow-lg
        active:scale-95 backdrop-blur-sm
        flex items-center justify-center gap-2
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <ShareIcon className="w-5 h-5" />
      {loading ? "Loading..." : "Share Result"}
    </button>
  );
};
