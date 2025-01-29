import { supabase } from './supabase';

interface GameResult {
  won: boolean;
  streak: number;
  played_at?: string; // Optional as it's set by default in Supabase
}

export const saveGameResult = async (won: boolean, streak: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('game_results')
      .insert([{ 
        won, 
        streak,
        played_at: new Date().toISOString() // Explicitly set for consistency
      }]);

    if (error) {
      throw error;
    }

    console.log('Game result saved successfully:', { won, streak });
    return true;
  } catch (error) {
    console.error('Error saving game result:', error.message);
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
