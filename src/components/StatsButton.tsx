import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { StatsModal } from './StatsModal';

export const StatsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed top-6 right-6 md:top-8 md:right-8
          p-2.5 rounded-full
          bg-white/10 hover:bg-white/15
          transition-all duration-300
          backdrop-blur-sm
          hover:scale-110 active:scale-95
          hover:shadow-lg hover:shadow-white/5
          z-10
        "
        aria-label="View Stats"
      >
        <ChartBarIcon className="w-5 h-5 text-white/70" />
      </button>

      {isOpen && <StatsModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
