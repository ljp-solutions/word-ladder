import { StatBox } from './StatBox';

interface StatSectionProps {
  title: string;
  stats: {
    gamesPlayed: number;
    wins: number;
    currentStreak: number;
    bestStreak: number;
  };
  loading?: boolean;
}

export const StatSection = ({ title, stats, loading = false }: StatSectionProps) => {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold text-white/80 mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatBox 
          label="Games Played" 
          value={stats.gamesPlayed} 
          loading={loading} 
        />
        <StatBox 
          label="Win Rate" 
          value={`${winRate}%`} 
          highlight="purple"
          loading={loading} 
        />
        <StatBox 
          label="Current Streak" 
          value={stats.currentStreak} 
          highlight="gold"
          loading={loading} 
        />
        <StatBox 
          label="Best Streak" 
          value={stats.bestStreak} 
          highlight="gold"
          loading={loading} 
        />
      </div>
    </div>
  );
};
