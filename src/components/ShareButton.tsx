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

  // ✅ Ensure handleClick is inside the component
  const handleClick = async () => {
    if (!shareData) {
      console.error("No share data available");
      return;
    }
  
    console.log("Attempting to share:", shareData);
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Game Result",
          text: shareData,
        });
        console.log("Share successful!");
        return; // ✅ Ensure we don't fallback if `share()` was successful
      } catch (error) {
        console.error("Share failed:", error);
      }
    }
  
    // If sharing isn't supported or fails, copy to clipboard instead
    fallbackCopyToClipboard();
  };
  

  const fallbackCopyToClipboard = () => {
    if (!shareData) return;

    console.log("Attempting to copy:", shareData);
    
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(shareData)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Clipboard write failed:", err));
    } else {
      console.warn("Clipboard API not supported, using old method.");
      const textarea = document.createElement("textarea");
      textarea.value = shareData;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Copied to clipboard!");
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
