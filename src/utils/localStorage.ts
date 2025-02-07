import { GameStats } from '../types';

const STORAGE_KEY = 'swapple_gameStats';
const FIRST_VISIT_KEY = 'swapple_firstVisit';

const defaultStats: GameStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  totalWins: 0,
};

export const loadStats = (): GameStats => {
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

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats to localStorage:', error);
  }
};

export const isFirstVisit = (): boolean => {
  return localStorage.getItem(FIRST_VISIT_KEY) === null;
};

export const markFirstVisitComplete = (): void => {
  localStorage.setItem(FIRST_VISIT_KEY, 'visited');
};
