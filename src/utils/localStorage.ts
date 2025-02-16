import { GameStats } from '../types';

const STORAGE_KEY = 'swapple_gameStats';
const FIRST_VISIT_KEY = 'swapple_firstVisit';
const GAME_STATE_KEY = 'swapple_gameState';

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

interface GameState {
  userInputs: string[][];
  validMoves: number[];
  gameDate: string;
  turnsTaken: number;
  gameWon: boolean;
  animatedRows: number[]; // Add this field
}

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
      turnDistribution: {
        '3': Number(parsed.turnDistribution?.['3']) || 0,
        '4': Number(parsed.turnDistribution?.['4']) || 0,
        '5': Number(parsed.turnDistribution?.['5']) || 0,
        '6': Number(parsed.turnDistribution?.['6']) || 0,
        '7': Number(parsed.turnDistribution?.['7']) || 0,
        '8+': Number(parsed.turnDistribution?.['8+']) || 0
      }
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

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;

    const state = JSON.parse(saved);
    // Verify it's from today
    if (state.gameDate !== new Date().toDateString()) {
      localStorage.removeItem(GAME_STATE_KEY);
      return null;
    }
    return state;
  } catch (error) {
    console.warn('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  localStorage.removeItem(GAME_STATE_KEY);
};

export const isFirstVisit = (): boolean => {
  return localStorage.getItem(FIRST_VISIT_KEY) === null;
};

export const markFirstVisitComplete = (): void => {
  localStorage.setItem(FIRST_VISIT_KEY, 'visited');
};
