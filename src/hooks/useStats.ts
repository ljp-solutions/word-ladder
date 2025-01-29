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

  const updateStats = (won: boolean): number => {
    const currentStats = loadStats(); // Get latest stats from localStorage
    const newStreak = won ? currentStats.currentStreak + 1 : 0;
    
    const updatedStats = {
      currentStreak: newStreak,
      bestStreak: won ? Math.max(currentStats.bestStreak, newStreak) : currentStats.bestStreak,
      totalGames: currentStats.totalGames + 1,
      totalWins: won ? currentStats.totalWins + 1 : currentStats.totalWins,
    };

    setStats(updatedStats);
    saveStats(updatedStats); // Immediately save to localStorage
    
    return newStreak;
  };

  return {
    ...stats,
    updateStats,
  };
};
