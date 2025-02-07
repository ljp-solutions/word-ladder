import { useState, useEffect } from 'react';

const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const useGameTracking = (isTestMode: boolean) => {
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<{ choice: string; won: boolean } | null>(null);
  const storageAvailable = isLocalStorageAvailable();

  useEffect(() => {
    if (!storageAvailable || isTestMode) return;

    try {
      const lastPlayedDate = localStorage.getItem("lastPlayedDate");
      const today = new Date().toDateString();
      const savedResult = localStorage.getItem("todayResult");

      if (lastPlayedDate === today && savedResult) {
        setHasPlayedToday(true);
        setTodayResult(JSON.parse(savedResult));
      }
    } catch (error) {
      console.warn('Failed to check last played date:', error);
    }
  }, [isTestMode, storageAvailable]);

  const trackGamePlayed = (choice: string, won: boolean) => {
    if (!isTestMode && storageAvailable) {
      try {
        localStorage.setItem("lastPlayedDate", new Date().toDateString());
        localStorage.setItem("todayResult", JSON.stringify({ choice, won }));
        setHasPlayedToday(true);
        setTodayResult({ choice, won });
      } catch (error) {
        console.warn('Failed to save play date:', error);
      }
    }
  };

  return { hasPlayedToday, todayResult, trackGamePlayed };
};
