import { XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useStats } from '../hooks/useStats';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal = ({ onClose }: StatsModalProps) => {
  const stats = useStats();

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50
        animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="
        bg-gray-900/90 rounded-2xl p-8
        max-w-sm w-[95%] md:w-full mx-auto 
        shadow-xl shadow-black/20
        animate-[fadeIn_0.4s_ease-out,scaleUp_0.3s_ease-out]
        border border-white/10
      ">
        {/* Header */}
        <div className="relative flex flex-col items-center mb-8">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-3 -mr-3 text-white/50 hover:text-white/80
              transition-all duration-200 ease-in-out
              hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <TrophyIcon className="w-8 h-8 text-yellow-400/90 mb-2" />
          <h2 className="text-2xl font-bold text-white/90 tracking-wide">Statistics</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-8">
          {/* Current Streak */}
          <div className="text-center transform opacity-0 animate-[fadeIn_0.4s_ease-out_0.1s_forwards]">
            <div className="text-3xl font-bold text-white/90 drop-shadow-lg transform scale-95 animate-[scaleUp_0.4s_ease-out_0.2s_forwards]">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-white/60 mt-2 font-medium">Current Streak</div>
          </div>

          {/* Best Streak */}
          <div className="text-center transform opacity-0 animate-[fadeIn_0.4s_ease-out_0.2s_forwards]">
            <div className="text-3xl font-bold text-yellow-400/90 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)] transform scale-95 animate-[scaleUp_0.4s_ease-out_0.3s_forwards]">
              {stats.bestStreak}
            </div>
            <div className="text-sm text-white/60 mt-2 font-medium">Best Streak</div>
          </div>

          <div className="col-span-2 border-t border-white/10 my-4"></div>

          {/* Games Played */}
          <div className="text-center transform opacity-0 animate-[fadeIn_0.4s_ease-out_0.3s_forwards]">
            <div className="text-3xl font-bold text-white/90 transform scale-95 animate-[scaleUp_0.4s_ease-out_0.4s_forwards]">
              {stats.totalGames}
            </div>
            <div className="text-sm text-white/60 mt-2 font-medium">Games Played</div>
          </div>

          {/* Win Rate */}
          <div className="text-center transform opacity-0 animate-[fadeIn_0.4s_ease-out_0.4s_forwards]">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent transform scale-95 animate-[scaleUp_0.4s_ease-out_0.5s_forwards]">
              {stats.totalGames > 0 
                ? Math.round((stats.totalWins / stats.totalGames) * 100)
                : 0}%
            </div>
            <div className="text-sm text-white/60 mt-2 font-medium">Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
