const HowToPlayButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50
        transition-all duration-300 flex items-center justify-center
        border border-white/10 backdrop-blur-sm text-gray-300 text-xl"
        aria-label="How to Play"
      >
        ?
      </button>
    );
  };
  
  export default HowToPlayButton;
  