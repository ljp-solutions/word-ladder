import { useState, useEffect } from 'react';
import type { GameStats } from '../types';

const STORAGE_KEY = 'swapple_gameStats';

const defaultStats: GameStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  totalWins: 0,
};

const loadStats = (): GameStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultStats;

    const parsed = JSON.parse(saved);
    return {
      currentStreak: Number(parsed.currentStreak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      totalGames: Number(parsed.totalGames) || 0,
      totalWins: Number(parsed.totalWins) || 0,
    };
  } catch (error) {
    console.warn('Failed to load stats from localStorage:', error);
    return defaultStats;
  }
};

const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats to localStorage:', error);
  }
};

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(loadStats);

  const updateStats = (won: boolean): number => {
    const newStats = {
      currentStreak: won ? stats.currentStreak + 1 : 0,
      bestStreak: won ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
      totalGames: stats.totalGames + 1,
      totalWins: won ? stats.totalWins + 1 : stats.totalWins,
    };

    setStats(newStats);
    saveStats(newStats);
    return newStats.currentStreak;
  };

  return {
    stats,
    updateStats,
  };
};
