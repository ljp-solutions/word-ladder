import { useState, useEffect } from 'react';
import { XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useStats } from '../hooks/useStats';
import { fetchGlobalStats } from '../utils/gameService';
import { calculateWinRate } from '../utils/stats';
import { StatBox } from './StatBox';
import type { GlobalStats } from '../types';
import { StatSection } from './StatSection';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal = ({ onClose }: StatsModalProps) => {
  const stats = useStats();
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGlobalStats = async () => {
      const data = await fetchGlobalStats();
      setGlobalStats(data);
      setIsLoading(false);
    };
    loadGlobalStats();
  }, []);

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

        {/* User Stats */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4 text-center">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Games Played" value={stats.totalGames} />
            <StatBox 
              label="Win Rate" 
              value={`${calculateWinRate(stats.totalWins, stats.totalGames)}%`}
              highlight="purple"
            />
            <StatBox label="Current Streak" value={stats.currentStreak} highlight="gold" />
            <StatBox label="Best Streak" value={stats.bestStreak} highlight="gold" />
          </div>
        </section>

        <hr className="border-white/10 my-6" />

        {/* Global Stats */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4 text-center">Global Stats</h3>
          <div className="grid grid-cols-2 auto-rows-auto gap-4">
            <StatBox 
              label="Total Games" 
              value={globalStats?.total_games ?? 0}
              loading={isLoading}
            />
            <StatBox 
              label="Global Win Rate" 
              value={`${calculateWinRate(
                globalStats?.total_wins ?? 0,
                globalStats?.total_games ?? 0
              )}%`}
              highlight="purple"
              loading={isLoading}
            />
            <div className="col-span-2 flex justify-center">
              <StatBox 
                label="Best Streak Ever" 
                value={globalStats?.longest_streak ?? 0}
                highlight="gold"
                loading={isLoading}
              />
            </div>
          </div>
        </section>

        <hr className="border-white/10 my-6" />

        {/* Today's Stats */}
        <section>
          <h3 className="text-lg font-semibold text-white/90 mb-4 text-center">Today's Stats</h3>
          <div className="flex justify-around gap-8">
            <StatBox 
              label="Games Today" 
              value={globalStats?.daily_games ?? 0}
              loading={isLoading}
            />
            <StatBox 
              label="Today's Win Rate" 
              value={`${calculateWinRate(
                globalStats?.daily_wins ?? 0,
                globalStats?.daily_games ?? 0
              )}%`}
              highlight="purple"
              loading={isLoading}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
