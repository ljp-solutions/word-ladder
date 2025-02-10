export type TurnCategory = '3' | '4' | '5' | '6' | '7' | '8+';

export interface GameStats {
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  totalWins: number;
  turnDistribution: Record<TurnCategory, number>;
}

export interface TodayResult {
  word: string;
  won: boolean;
  turns: number;
  streak: number;
}

export interface GlobalStats {
  total_games: number;
  total_wins: number;
  longest_streak: number;
  daily_games: number;
  daily_wins: number;
  last_updated: string;
}
