import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  won: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ won }) => {
  const shareText = `🔥 Right Today\n${won ? '✅ I got it right today!' : '❌ I lost today!'} Can you?\nright-today.vercel.app`;

  const handleShare = async () => {
    // For mobile devices, try to use native share if available
    const canShare = 'share' in navigator && 
                    navigator.canShare && 
                    navigator.canShare({ text: shareText });

    try {
      if (canShare) {
        await navigator.share({
          title: 'Right Today',
          text: shareText,
          url: 'https://right-today.vercel.app'
        });
      } else {
        await fallbackToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      await fallbackToClipboard();
    }
  };

  const fallbackToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Ultimate fallback - show the text to copy manually
      alert('Please copy this text manually:\n\n' + shareText);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-6 py-2.5 text-sm font-medium
        bg-white/10 text-white/90
        rounded-lg transition-all duration-300
        hover:bg-gray-700 hover:scale-105 hover:shadow-lg
        active:scale-95 backdrop-blur-sm
        flex items-center justify-center gap-2"
    >
      <ShareIcon className="w-5 h-5" />
      Share Result
    </button>
  );
};
