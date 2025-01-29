export interface GameStats {
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  totalWins: number;
}

export interface GlobalStats {
  total_games: number;
  total_wins: number;
  longest_streak: number;
  daily_games: number;
  daily_wins: number;
  last_updated: string;
}
