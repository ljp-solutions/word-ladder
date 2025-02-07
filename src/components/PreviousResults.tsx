import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PreviousResultsProps {
  allResults: Array<{ correct_answer: string; game_date: string }>;
  currentWeekOffset: number;
  totalWeeks: number;
  setCurrentWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

const PreviousResults: React.FC<PreviousResultsProps> = ({ allResults, currentWeekOffset, totalWeeks, setCurrentWeekOffset, onClose }) => {
  const groupResultsByWeek = (results: typeof allResults) => {
    if (!results.length) return [];

    // Sort results by date in ascending order (oldest first)
    const sortedResults = [...results].sort((a, b) => 
      new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
    );

    // Group into weeks of 7 days
    const weeks: typeof allResults[] = [];
    let currentWeek: typeof allResults = [];

    sortedResults.forEach((result, index) => {
      currentWeek.push(result);
      if (currentWeek.length === 7 || index === sortedResults.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  };

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full bg-gray-900/95 rounded-xl shadow-xl
                 border border-white/10 backdrop-blur-sm
                 flex flex-col max-h-[85vh] md:max-h-[80vh] md:max-w-lg
                 mx-auto my-auto overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h3 className="text-white/90 text-base font-semibold">
            Previous Results
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800/50 
                     flex items-center justify-center
                     text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 
                        bg-gray-900/95 border-b border-gray-800">
            <button
              onClick={() => setCurrentWeekOffset(prev => Math.min(prev + 4, totalWeeks - 4))}
              disabled={currentWeekOffset >= totalWeeks - 4}
              className="p-2 text-sm text-gray-400 hover:text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              ← Older
            </button>
            <span className="text-gray-300 text-sm font-medium">
              {currentWeekOffset === 0 ? 'Latest Results' : `${totalWeeks - currentWeekOffset} weeks ago`}
            </span>
            <button
              onClick={() => setCurrentWeekOffset(prev => Math.max(0, prev - 4))}
              disabled={currentWeekOffset === 0}
              className="p-2 text-sm text-gray-400 hover:text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              Newer →
            </button>
          </div>

          {/* Results Grid - Grouped by weeks */}
          <div className="grid grid-cols-7 gap-2 p-4">
            {groupResultsByWeek(allResults).slice(currentWeekOffset, currentWeekOffset + 4).flat().map((result, index) => (
              <div 
                key={result.game_date}
                className="aspect-square bg-gray-800/30 rounded-lg
                         border border-white/5 backdrop-blur-sm
                         flex flex-col items-center justify-center gap-1
                         hover:bg-gray-800/40 transition-all duration-300"
              >
                <span className="text-[0.65rem] text-gray-400 font-medium">
                  {new Intl.DateTimeFormat("en-US", { 
                    weekday: "short" 
                  }).format(new Date(result.game_date))}
                </span>
                <div className={`
                  w-6 h-6 rounded-full 
                  flex items-center justify-center
                  ${result.correct_answer === 'left'
                    ? 'bg-blue-500/80 border-blue-400/30' 
                    : 'bg-green-500/80 border-green-400/30'
                  }
                  border backdrop-blur-sm
                `}>
                  <span className="text-[0.65rem] font-bold text-white/90">
                    {result.correct_answer === 'left' ? 'L' : 'R'}
                  </span>
                </div>
                <span className="text-[0.65rem] text-gray-500">
                  {new Date(result.game_date).getDate()}
                </span>
              </div>
            ))}
          </div>

          {allResults.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">
                No results available yet
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviousResults;
