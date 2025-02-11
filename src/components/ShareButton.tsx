import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  won: boolean;
  turns?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ won, turns }) => {
  const shareUrl = 'https://word-ladder-omega.vercel.app/';
  const emoji = won ? '✅' : '❌';
  const turnsText = turns ? `${turns} ${turns === 1 ? 'turn' : 'turns'}` : '';
  
  const displayText = `🎯 SWAPPLE\n\n${emoji} ${won ? `I took ${turnsText}!` : "Didn't get today's word"}\n\n🎲 Change or swap letters to reach the target word.\n\nLet's see if you can beat me!`;

  const handleShare = async () => {
    const shareData = {
      text: displayText,
      title: 'SWAPPLE - Daily Word Game',
      url: shareUrl
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(displayText);
        alert('Copied to clipboard!');
      } else {
        prompt('Copy this text to share:', displayText);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User canceled share, do nothing
        return;
      }
      // Fallback if sharing failed
      try {
        await navigator.clipboard.writeText(displayText);
        alert('Copied to clipboard!');
      } catch {
        prompt('Copy this text to share:', displayText);
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
