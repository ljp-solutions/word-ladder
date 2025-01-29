import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStats } from '../hooks/useStats';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal = ({ onClose }: StatsModalProps) => {
  const stats = useStats();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="
        bg-gray-900/95 rounded-xl p-6 
        max-w-sm w-full mx-4 
        shadow-xl shadow-black/20
        animate-fade-scale
      ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-sm text-white/70 mt-1">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.bestStreak}</div>
            <div className="text-sm text-white/70 mt-1">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.totalGames}</div>
            <div className="text-sm text-white/70 mt-1">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {stats.totalGames > 0 
                ? Math.round((stats.totalWins / stats.totalGames) * 100)
                : 0}%
            </div>
            <div className="text-sm text-white/70 mt-1">Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
