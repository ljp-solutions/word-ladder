import React from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface RecentAnswersProps {
  recentAnswers: Array<{ correct_answer: string; game_date: string }>;
  onShowModal: () => void;
}

const RecentAnswers: React.FC<RecentAnswersProps> = ({ recentAnswers, onShowModal }) => {
  return (
    <div className="w-full mt-4 md:mt-0 mb-9 md:mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white/90 text-sm md:text-base font-medium">
          Recent Answers
        </h3>
        <button 
          onClick={onShowModal}
          className="w-6 h-6 rounded-full bg-gray-700/60 hover:bg-gray-600/80 
                   transition-all duration-300 flex items-center justify-center
                   border border-white/10"
          aria-label="View All Results"
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-white/70" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-2 px-1">
        {[...recentAnswers].reverse().map((answer, index) => {
          const date = new Date(answer.game_date);
          const dayName = new Intl.DateTimeFormat("en-US", { 
            weekday: "short" 
          }).format(date);

          return (
            <div 
              key={index} 
              className="bg-gray-800/30 rounded-lg p-2.5
                       border border-white/5 backdrop-blur-sm
                       flex flex-col items-center gap-2
                       hover:bg-gray-800/40 transition-all duration-300"
            >
              <div className={`
                w-7 h-7 md:w-8 md:h-8 rounded-full 
                flex items-center justify-center
                transition-all duration-300
                ${answer.correct_answer === 'left'
                  ? 'bg-blue-500/80 border-blue-400/30' 
                  : 'bg-green-500/80 border-green-400/30'
                }
                border backdrop-blur-sm
              `}>
                <span className="text-xs md:text-sm font-bold text-white/90">
                  {answer.correct_answer === 'left' ? 'L' : 'R'}
                </span>
              </div>
              <span className="text-xs text-gray-300 font-medium">
                {dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAnswers;
