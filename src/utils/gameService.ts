import { supabase } from './supabase';
import type { GlobalStats } from '../types';

interface GameResult {
  won: boolean;
  streak: number;
  turns: number;
  played_at?: string; // Optional as it's set by default in Supabase
}

interface RecentAnswer {
  correct_answer: string;
  game_date: string;
}

interface DailyGame {
  start_word: string;
  target_word: string;
  joker_steps: any; // JSONB field
}

// Add this helper function to calculate game number
export const calculateGameNumber = (): number => {
  const startDate = new Date('2025-02-01'); // First day the game was released
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

export const saveGameResult = async (won: boolean, streak: number, turns: number): Promise<boolean> => {
    const payload = [{
      won,
      streak,
      turns,
      played_at: new Date()
    }];
  
    console.log("Saving game result with payload:", payload);
  
    try {
      const { data, error } = await supabase
        .from("game_results")
        .insert(payload);
  
      console.log("Supabase response:", { data, error });
  
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
  
      console.log("Game result saved successfully:", payload[0]);
      return true;
    } catch (error: any) {
      console.error("Error saving game result:", error.message);
      return false;
    }
  };
  

// Helper function to get today's game result (if needed later)
export const getTodaysResult = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const { data, error } = await supabase
      .from('game_results')
      .select()
      .gte('played_at', today.toISOString())
      .order('played_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching today\'s result:', error.message);
    return null;
  }
};

export const fetchGlobalStats = async (): Promise<GlobalStats | null> => {
  try {
    const { data, error } = await supabase
      .from('global_stats')
      .select('*')
      .single();

    if (error) throw error;

    // Ensure all number fields are actually numbers
    return {
      total_games: Number(data.total_games),
      total_wins: Number(data.total_wins),
      ave_turns: Number(data.ave_turns),
      longest_streak: Number(data.longest_streak),
      daily_games: Number(data.daily_games),
      daily_wins: Number(data.daily_wins),
      last_updated: data.last_updated,
    };
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return null;
  }
};

export const fetchDailyGame = async (): Promise<DailyGame | null> => {
  try {
    const { data, error } = await supabase
      .from("global_game")
      .select("start_word, target_word, joker_steps")
      .eq("game_date", new Date().toISOString().split("T")[0])
      .single();

    if (error) {
      console.error("Error fetching daily game:", error.message);
      return null;
    }

    return data || null;
  } catch (error: any) {
    console.error("Unexpected error fetching daily game:", error.message);
    return null;
  }
};
