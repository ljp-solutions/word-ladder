import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { StatsModal } from './StatsModal';

export const StatsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50
                transition-all duration-300 flex items-center justify-center
                border border-white/10 backdrop-blur-sm"
        aria-label="View Statistics"
      >
        <ChartBarIcon className="w-5 h-5 text-white/80" />
      </button>

      {isOpen && <StatsModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
