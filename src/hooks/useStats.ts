import { useState, useEffect } from 'react';
import { loadStats, saveStats } from '../utils/localStorage';
import type { GameStats } from '../types';

const STORAGE_KEY = 'rightToday_gameStats';

const defaultStats: GameStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  totalWins: 0,
};

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(loadStats);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const updateStats = (won: boolean) => {
    setStats(prev => {
      const newStats = {
        currentStreak: won ? prev.currentStreak + 1 : 0,
        bestStreak: won ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
        totalGames: prev.totalGames + 1,
        totalWins: won ? prev.totalWins + 1 : prev.totalWins,
      };
      return newStats;
    });
  };

  return {
    ...stats,
    updateStats,
  };
};
