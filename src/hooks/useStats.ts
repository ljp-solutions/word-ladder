import { useState } from 'react';
import { GameStats, TurnCategory } from '../types';
import { loadStats as loadStoredStats, saveStats } from '../utils/localStorage';

const defaultStats: GameStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  totalWins: 0,
  turnDistribution: {
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8+': 0
  }
};

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(loadStoredStats);

  const updateStats = (won: boolean, turns: number): number => {
    console.log('Updating stats with turns:', turns); // Debug log

    // Simpler turn category determination
    const turnCategory = turns >= 8 ? '8+' : String(turns) as TurnCategory;
    
    console.log('Determined turn category:', turnCategory); // Debug log
    
    const newStats = {
      currentStreak: won ? stats.currentStreak + 1 : 0,
      bestStreak: won ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
      totalGames: stats.totalGames + 1,
      totalWins: won ? stats.totalWins + 1 : stats.totalWins,
      turnDistribution: {
        ...stats.turnDistribution,
        [turnCategory]: won ? stats.turnDistribution[turnCategory] + 1 : stats.turnDistribution[turnCategory]
      }
    };

    console.log('New stats:', newStats); // Debug log
    setStats(newStats);
    saveStats(newStats);
    return newStats.currentStreak;
  };

  return {
    stats,
    updateStats,
  };
};
